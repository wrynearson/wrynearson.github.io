#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME="$(basename "$0")"

# Defaults
RCLONE_REMOTE="hetzner"
RCLONE_BUCKET="wrynearson-photo-albums"
ALBUM_SLUG=""
ALBUM_TITLE=""
ALBUM_DESCRIPTION=""
ALBUM_DATE=""
ALBUM_TAGS=""
ALBUM_COVER=""
SOURCE_DIR=""
DRY_RUN=false

usage() {
  cat <<EOF
Usage: $SCRIPT_NAME --source <dir> --slug <slug> [options]

Publish a photo album to the object store. Extracts EXIF metadata from each
photo, generates the album manifest (album.json), uploads photos and manifest
to the bucket, and updates the album index (index.json).

Requires: exiftool, rclone (unless --dry-run)

Required:
  --source <dir>       Directory containing JPEG/AVIF photo files
  --slug <slug>        URL-safe album identifier (e.g. "japan-2024")

Options:
  --title <text>       Album title (default: derived from slug)
  --description <text> Short description of the album
  --date <YYYY-MM-DD>  Album date (default: today)
  --tags <list>        Comma-separated tags: "nature,travel,japan"
  --cover <filename>   Cover photo filename (default: first photo)
  --dry-run            Generate JSON locally only, skip upload
  --rclone-remote <n>  rclone remote name (default: $RCLONE_REMOTE)
  --rclone-bucket <p>  rclone bucket path (default: $RCLONE_BUCKET)
  -h, --help           Show this help

Examples:
  $SCRIPT_NAME --source ~/exports/japan-2024 --slug japan-2024 --title "Japan 2024"
  $SCRIPT_NAME --source ~/exports/japan-2024 --slug japan-2024 --dry-run
EOF
  exit 0
}

# --- Argument parsing ---
while [[ $# -gt 0 ]]; do
  case "$1" in
    --source) SOURCE_DIR="$2"; shift 2 ;;
    --slug) ALBUM_SLUG="$2"; shift 2 ;;
    --title) ALBUM_TITLE="$2"; shift 2 ;;
    --description) ALBUM_DESCRIPTION="$2"; shift 2 ;;
    --date) ALBUM_DATE="$2"; shift 2 ;;
    --tags) ALBUM_TAGS="$2"; shift 2 ;;
    --cover) ALBUM_COVER="$2"; shift 2 ;;
    --dry-run) DRY_RUN=true; shift ;;
    --rclone-remote) RCLONE_REMOTE="$2"; shift 2 ;;
    --rclone-bucket) RCLONE_BUCKET="$2"; shift 2 ;;
    -h|--help) usage ;;
    *) echo "Error: Unknown option: $1"; usage ;;
  esac
done

# --- Validation ---
if [[ -z "$SOURCE_DIR" ]]; then echo "Error: --source is required"; usage; fi
if [[ -z "$ALBUM_SLUG" ]]; then echo "Error: --slug is required"; usage; fi
if [[ ! -d "$SOURCE_DIR" ]]; then echo "Error: source directory not found: $SOURCE_DIR"; exit 1; fi

# Derive title from slug if not provided
if [[ -z "$ALBUM_TITLE" ]]; then
  ALBUM_TITLE="$(echo "$ALBUM_SLUG" | sed 's/-/ /g; s/\b\(.\)/\u\1/g')"
fi

# Default date to today
if [[ -z "$ALBUM_DATE" ]]; then
  ALBUM_DATE="$(date +%Y-%m-%d)"
fi

# --- Dependency check ---
if ! command -v exiftool &> /dev/null; then
  echo "Error: exiftool is not installed. Install it with: brew install exiftool"
  exit 1
fi

if [[ "$DRY_RUN" == false ]]; then
  if ! command -v rclone &> /dev/null; then
    echo "Error: rclone is not installed. Install it with: brew install rclone"
    exit 1
  fi
fi

# --- Gather photos ---
PHOTO_FILES=()
while IFS= read -r -d '' f; do
  PHOTO_FILES+=("$f")
done < <(find "$SOURCE_DIR" -maxdepth 1 \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.avif' \) -print0 | sort -z)

if [[ ${#PHOTO_FILES[@]} -eq 0 ]]; then
  echo "Error: no JPEG or AVIF files found in $SOURCE_DIR"
  exit 1
fi

echo "Found ${#PHOTO_FILES[@]} photo(s) in $SOURCE_DIR"

# --- Extract EXIF and generate album.json ---
# We pipe exiftool JSON output into a small Python script for reliable handling
# of GPS coordinate conversion, formatting, and JSON escaping.

PYTHON_GEN=$(cat << 'PYEOF'
import sys, json
from datetime import date

data = json.load(sys.stdin)

slug = sys.argv[1]
title = sys.argv[2]
album_date = sys.argv[3]
description = sys.argv[4]
tags_str = sys.argv[5]
cover_arg = sys.argv[6]

tags = [t.strip() for t in tags_str.split(",") if t.strip()]
photos = []

for i, photo in enumerate(data):
    filename = photo.get("FileName", f"photo-{i+1}.jpg")

    exif = {}

    cam = photo.get("Model", "") or photo.get("ModelID", "")
    if cam: exif["camera"] = cam.strip()

    lens = photo.get("Lens", "") or photo.get("LensID", "")
    if lens: exif["lens"] = lens.strip()

    fl = photo.get("FocalLength", "")
    if fl:
        fl_str = str(fl).replace(" ", "")
        if fl_str:
            exif["focal_length"] = fl_str

    fn = photo.get("FNumber", "")
    if fn:
        try:
            exif["aperture"] = f"f/{float(fn):g}"
        except (ValueError, TypeError):
            exif["aperture"] = str(fn)

    ss = photo.get("ShutterSpeedValue", "") or photo.get("ExposureTime", "")
    if ss:
        ss_str = str(ss).replace(" ", "")
        if ss_str:
            exif["shutter"] = ss_str

    iso = photo.get("ISO", "")
    if iso:
        try:
            exif["iso"] = f"{int(float(iso))}"
        except (ValueError, TypeError):
            exif["iso"] = str(iso)

    # GPS coordinate conversion (DMS -> decimal)
    # exiftool outputs GPS as strings like: "35 deg 40' 33.12" N"
    # or as numeric floats when -n is used
    gps = {}

    def parse_dms(val, ref):
        import re
        if val is None or not val:
            return None
        # Try numeric float first (exiftool -n format)
        if isinstance(val, (int, float)):
            dec = float(val)
        elif isinstance(val, str):
            # Parse string format: "35 deg 40' 33.12" N"
            m = re.match(r"([\d.]+)\s*deg\s*([\d.]+)'\s*([\d.]+)\"\s*([NSEW])?", val)
            if m:
                d, mi, s, _ = m.groups()
                dec = float(d) + float(mi) / 60.0 + float(s) / 3600.0
            else:
                return None
        else:
            return None
        if ref in ("S", "W"):
            dec = -dec
        return round(dec, 6)

    lat_dec = parse_dms(photo.get("GPSLatitude"), photo.get("GPSLatitudeRef", ""))
    lon_dec = parse_dms(photo.get("GPSLongitude"), photo.get("GPSLongitudeRef", ""))
    if lat_dec is not None and lon_dec is not None:
        gps["lat"] = lat_dec
        gps["lon"] = lon_dec

    caption = photo.get("ImageDescription", "") or photo.get("XMP:Description", "") or ""

    entry = {"filename": filename}
    if caption:
        entry["caption"] = caption.strip()
    if exif:
        entry["exif"] = exif
    if gps:
        entry["gps"] = gps

    photos.append(entry)

cover = cover_arg if cover_arg else photos[0]["filename"]

album = {
    "slug": slug,
    "title": title,
    "date": album_date,
    "tags": tags,
    "cover": cover,
    "photos": photos
}

if description:
    album["description"] = description

json.dump(album, sys.stdout, indent=2, ensure_ascii=False)
PYEOF
)

ALBUM_JSON=$(exiftool -json "${PHOTO_FILES[@]}" | python3 -c "$PYTHON_GEN" \
  "$ALBUM_SLUG" "$ALBUM_TITLE" "$ALBUM_DATE" "$ALBUM_DESCRIPTION" "$ALBUM_TAGS" "$ALBUM_COVER")

# --- Output results ---
if [[ "$DRY_RUN" == true ]]; then
  OUTPUT_DIR="./_output/$ALBUM_SLUG"
  mkdir -p "$OUTPUT_DIR"

  echo "$ALBUM_JSON" > "$OUTPUT_DIR/album.json"
  echo ""
  echo "--- Dry Run ---"
  echo "Album manifest written to: $OUTPUT_DIR/album.json"
  echo ""
  echo "Would upload ${#PHOTO_FILES[@]} photo(s) to: $RCLONE_REMOTE:$RCLONE_BUCKET/albums/$ALBUM_SLUG/photos/"
  echo "Would upload manifest to:  $RCLONE_REMOTE:$RCLONE_BUCKET/albums/$ALBUM_SLUG/album.json"
  echo "Would update index at:     $RCLONE_REMOTE:$RCLONE_BUCKET/albums/index.json"
  echo ""
  echo "Generated album.json preview:"
  echo "$ALBUM_JSON"
else
  echo "Uploading photos to $RCLONE_REMOTE:$RCLONE_BUCKET/albums/$ALBUM_SLUG/photos/ ..."
  rclone copy --progress "$SOURCE_DIR/" "$RCLONE_REMOTE:$RCLONE_BUCKET/albums/$ALBUM_SLUG/photos/"

  echo "Uploading album manifest ..."
  echo "$ALBUM_JSON" | rclone rcat "$RCLONE_REMOTE:$RCLONE_BUCKET/albums/$ALBUM_SLUG/album.json"

  # Update index.json
  echo "Updating album index ..."
  TMP_INDEX=$(mktemp)
  if rclone cat "$RCLONE_REMOTE:$RCLONE_BUCKET/albums/index.json" > "$TMP_INDEX" 2>/dev/null; then
    python3 -c "
import json, sys
slug = sys.argv[1]
with open('$TMP_INDEX') as f:
    index = json.load(f)
# Replace if exists, otherwise append
slug_found = any(item.get('slug') == slug for item in index)
if not slug_found:
    index.append({'slug': slug})
    with open('$TMP_INDEX', 'w') as f:
        json.dump(index, f, indent=2)
" "$ALBUM_SLUG"
  else
    # No existing index, create one
    echo '[{"slug": "'"$ALBUM_SLUG"'"}]' > "$TMP_INDEX"
  fi
  rclone rcat "$RCLONE_REMOTE:$RCLONE_BUCKET/albums/index.json" < "$TMP_INDEX"
  rm "$TMP_INDEX"

  echo ""
  echo "Done! Album published: $ALBUM_TITLE"
  echo "  Photos: $RCLONE_REMOTE:$RCLONE_BUCKET/albums/$ALBUM_SLUG/photos/"
  echo "  Manifest: $RCLONE_REMOTE:$RCLONE_BUCKET/albums/$ALBUM_SLUG/album.json"
fi

# Photo Gallery Setup

## What Was Built

A photo gallery feature at `/photos/` with two views:

- **Album index** (`/photos/`) — grid of album cards with cover images, titles, dates, and descriptions
- **Album detail** (`/photos/[slug]/`) — photo grid with a Vanilla JS lightbox (keyboard navigation, EXIF data toggle, mobile swipe)

The old `/portfolio/` path redirects to `/photos/`.

## Files Created

| File | Purpose |
|------|---------|
| `src/_data/albums.js` | Fetches album data from your endpoint at build time. Falls back to placeholder data if unset. |
| `src/photos/index.liquid` | Album listing template. |
| `src/photos/album.liquid` | Individual album template with inline lightbox (JS + CSS). |
| `src/portfolio.md` | Redirect page from `/portfolio/` → `/photos/`. |
| `.gitignore` | Added entries for build artifacts. |

## Required Endpoint Structure

Set the environment variable `ALBUMS_ENDPOINT` at build time. It should point to a base URL that serves the following structure:

```
ALBUMS_ENDPOINT/
├── albums/
│   ├── index.json
│   ├── japan-2024/
│   │   ├── album.json
│   │   └── photos/
│   │       ├── photo-1.jpg
│   │       ├── photo-2.jpg
│   │       └── ...
│   └── seattle-2023/
│       ├── album.json
│       └── photos/
│           ├── photo-a.jpg
│           └── ...
```

### `/albums/index.json`

An array of album references:

```json
[
  { "slug": "japan-2024" },
  { "slug": "seattle-2023" }
]
```

### `/albums/[slug]/album.json`

```json
{
  "slug": "japan-2024",
  "title": "Japan 2024",
  "date": "2024-11-15",
  "description": "A trip through Tokyo and Kyoto.",
  "tags": ["travel", "japan", "photography"],
  "cover": "cover.jpg",
  "photos": [
    {
      "filename": "tokyo-streets.jpg",
      "caption": "Tokyo Streets",
      "exif": {
        "camera": "Sony A7III",
        "lens": "35mm",
        "aperture": "f/1.8",
        "shutter": "1/200",
        "iso": "400"
      },
      "gps": {
        "lat": 35.6762,
        "lon": 139.6503
      }
    }
  ]
}
```

Fields:

| Field | Required | Notes |
|-------|----------|-------|
| `slug` | yes | URL-safe identifier, used in the path |
| `title` | yes | Displayed as the album heading |
| `date` | yes | ISO 8601 date (`YYYY-MM-DD`). Albums sorted newest first. |
| `description` | no | Short text shown on the album card and detail page |
| `tags` | no | Array of strings. Reserved for future tag pages — include now so data is ready. |
| `cover` | yes | Filename only (e.g. `cover.jpg`). Full URL constructed as `{ALBUMS_ENDPOINT}/albums/{slug}/photos/{cover}` |
| `photos[]` | yes | Array of photo objects |
| `photos[].filename` | yes | Image filename. Full URL: `{ALBUMS_ENDPOINT}/albums/{slug}/photos/{filename}` |
| `photos[].caption` | no | Shown in the lightbox below the image |
| `photos[].exif` | no | Object. Any key-value pairs rendered as tags (camera, lens, aperture, shutter, ISO, etc.) |
| `photos[].gps` | no | Object with `lat` and `lon` (decimal degrees). Reserved for map feature. |

## Publishing Albums

A helper script is available at `scripts/publish-album.sh`. It:

1. Takes a directory of JPEG/AVIF exports and an album slug
2. Reads EXIF from each photo via `exiftool` (camera, lens, settings, GPS, captions)
3. Generates `album.json` with all metadata
4. Uploads photos to the bucket via `rclone`
5. Updates `albums/index.json` with the new slug

### Requirements

- `exiftool` (`brew install exiftool`)
- `rclone` (`brew install rclone`) — already configured on your Mac

### Usage

```bash
# Preview what would be generated (no upload):
scripts/publish-album.sh \
  --source ~/exports/japan-2024 \
  --slug japan-2024 \
  --title "Japan 2024" \
  --dry-run

# Upload for real:
scripts/publish-album.sh \
  --source ~/exports/japan-2024 \
  --slug japan-2024 \
  --title "Japan 2024" \
  --description "A trip through Tokyo and Kyoto." \
  --tags "travel,japan,photography"
```

See `scripts/publish-album.sh --help` for all options. Photos are uploaded, manifest is generated, and the index is updated. No manual JSON editing needed.

## Build Command

```bash
ALBUMS_ENDPOINT=https://your-storage.com pnpm build
```

## Fallback Behavior

If `ALBUMS_ENDPOINT` is not set, the site builds with two hardcoded placeholder albums using `dummyimage.com` photos. This is useful for local development and testing the layout.

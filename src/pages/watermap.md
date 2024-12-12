---
title: Watermap
date: 2024-10-30
end-date:
url: https://wrynearson.github.io/watermap/
description: Drinking water, plus toilets and benches, on a 3D map using data from OpenStreetMap.
problem: When traveling or hiking, I often look for fountains to refill my water bottle. Nature also sometimes calls at inopportune times.
outcome: A website that displays drinking water sources and toilets across Europe. Mobile-optimized to load quickly and allow users to quickly (and optionally) see what's nearby.
type: personal
client: none
role: Builder
repo: https://github.com/wrynearson/watermap
---

{% image "./src/assets/img/watermap/watermap.png", "Watermap", "(min-width: 30em) 50 vw, 100vw" %}

Switzerland and many European countries are blessed with public drinking water sources. I usually have a reusable bottle with me when out and about, but sometimes it takes some searching to find a nearby fountain to fill up.

Continuing with my frontend [mentorship](/willwillrun) streak, I decided to build a map myself.

I had a few goals in mind:

1. Keep it as simple as possible (both in terms of code and features).
2. Make it work well on mobile devices (primarily, make it load quickly).
3. Have zero operating costs.

## How it works

There were several steps needed to get this working.

1. Get the data
2. Process
3. Optimize the data
4. Show the data on a map
5. Host the site

### 1. Get the data

[OpenStreetMap](https://www.openstreetmap.org/) is always a good place to start with this specific type of geospatial data.

OSM features uses [tags](https://wiki.openstreetmap.org/wiki/Tags) to describe features of map elements. I don't know of a way to only download elements with specific tags from OSM, and having the most up-to-date information isn't required, so I looked at downloading _all_ OSM data. [This is provided](https://planet.osm.org/), but at 78GB, it's quite a lot of data to work with on this supposedly-simple project.

Luckily, GeoFabrik offers [regional extracts](https://download.geofabrik.de/) of OSM Planet data. The data for [Switzerland](https://download.geofabrik.de/europe/switzerland.html), where I live, is less than 500MB. This seemed like a good place to start.

### 2. Process the data

Once I had a nice `switzerland.osm.pbf`, I then tried to figure out how to extract only the data I needed (drinking water, and later toilets and benches). [Osmium](https://osmcode.org/osmium-tool/) is a powerful CLI tool to process .pbf files and extract data based on tags.

```shell
osmium tags-filter switzerland.osm.pbf drinking_water=yes, amenity=drinking_water -o drinking_water.pbf
```

The `tags-filter` lets you pass one or more tags to extract. Here, Osmium checks for any `drinking_water` key with the value of `yes`, or any `amenity` key with the value of `drinking_water`. OSM tags are [user-defined](https://wiki.openstreetmap.org/wiki/Any_tags_you_like), but [`amenity=drinking_water`](https://wiki.openstreetmap.org/wiki/Tag:amenity%3Ddrinking_water) and [`drinking_water=yes`](https://wiki.openstreetmap.org/wiki/Key:drinking_water) seem to be the two used in practice. I repeated the process with [`amenity=toilets`](https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dtoilets) and [`building=toilets`](https://wiki.openstreetmap.org/wiki/Tag:building%3Dtoilets) for public restrooms, and [`amenity=bench`](https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dbench) and [`leisure=picnic_table`](https://wiki.openstreetmap.org/wiki/Tag:leisure%3Dpicnic_table) for places to sit.

Now our output pbf files (`drinking_water.pbf`, `toilets.pbf` and `benches.pbf`) are each around 1MB, a 99%+ reduction.

### 3. Optimize the data

The data should be optimized in at least two ways:

1. The amount of data shown at one point shouldn't be overwhelming.
2. The amount of data the browser needs to download should be minimized.

From my limited technical ability, and keeping things simple (goal 1), [tiling](https://en.wikipedia.org/wiki/Tiled_web_map) seemed like the best approach. That way, enough data is shown without having to download the whole dataset.

[Tippecanoe](https://github.com/felt/tippecanoe) is an open-source CLI tool to tile geospatial datasets. PBF is not a supported input filetype (AFAIK), so the exported PBF needed to be converted into a format that Tippecanoe supports.

Python and Geopandas seemed like a good tool for this task. After some trial and error, I came up with an approach:

1. Load exported PBF
2. Loop through "layers" in the PBF (element types, which include `points`, `lines`, `multilinestrings` (not commonly used AFAIK), and `multipolygons`)
3. Export layers as individual GeoJSON files (as `{layer}.geojson`)

```python
layers = ['points', 'lines', 'multilinestrings', 'multipolygons']

gdf_list = []

# Iterate through the layers and read each one
for layer in layers:
    try:
        # Read the layer from the PBF file
        gdf = gpd.read_file("../data/raw/output/europe_toilets.pbf", engine="pyogrio", layer=layer)

        # Add a new column to indicate the layer
        gdf['layer'] = layer

        # Append the GeoDataFrame to the list
        gdf_list.append(gdf)

        # Optionally print the first few rows of the GeoDataFrame
        print(f"Layer: {layer}, Number of features: {len(gdf)}")

        # Export the layer as a separate .geojson, to later add as tile layers in tippecanoe

        if len(gdf) > 0:
            export = gdf[["osm_id", "geometry"]]
            export.to_file(f"../data/raw/geojsons/{layer}.geojson", driver="GeoJSON")
        else:
            print(f"Nothing to write to {layer}.geojson. Skipping...")
    except Exception as e:
        print(f"Failed to read layer {layer}: {e}")
```

The full process is written in this [Jupyter Notebook](https://github.com/wrynearson/watermap/blob/main/data_exploration/osm.ipynb), and is repeated for each of the three categories (drinking water, toilets, and benches).

Then, Tippecanoe is used to load the GeoJSON files. One tile set is created for each data type. This could probably be one tile set for _all_ categories. I played around with some of the various flags and settings to try to get the appearance of the tiles to balance data accuracy while not overwhelming users.

```sh
tippecanoe -z14 --drop-densest-as-needed --extend-zooms-if-still-dropping --no-tile-compression --output-to-directory=drinking_water/ raw/geojsons/lines.geojson raw/geojsons/multipolygons.geojson raw/geojsons/points.geojson -B 12
```

Let's break this down:

- `z14` creates tiles up to zoom level 14. Creating higher zoom level tiles exponentially increases the file size or number of tile files. `z14` adequately showed all data without missing detail in this use case.
- `--drop-densest-as-needed` and `--extend-zooms-if-still-dropping` help to reduce the file size of the tile set, especially at low zoom levels.
- `--no-tile-compression` because apparently GitHub Pages [doesn't support compressed tiles](https://martinfleischmann.net/how-to-create-a-vector-based-web-map-hosted-on-github/).
- `--output-to-directory` gives us a bunch of small files, instead of a single file. I think this is also needed to [get this working with GitHub Pages.](https://martinfleischmann.net/how-to-create-a-vector-based-web-map-hosted-on-github/)
- `-B 12` ensures that all data is loaded at zoom level 12. I was having some issues with not having all data appear at higher zoom levels, and this seemed to fix it.

### 4. Show the data on a map

Thinking of goal 1 again, the map is build with Javascript (no frameworks) using MapLibre. Even more simply, the JS code is written directly in the `index.html` file.

When the page loads, the map loads, with viewport defaulting to a view of Europe.

{% image "./src/assets/img/watermap/watermap_mobile.png", "Watermap_mobile", "(min-width: 30em) 50 vw, 100vw" %}

All three sources (drinking water tiles, toilet tiles and bench tiles) are added as individual sources in MapLibre. Then, each layer from each source (`points`, `lines`, `multilinestrings` and `multipolygons`) are added as layers in MapLibre. Each source type shares a color, but the layers have different styling (shared across source type).

Attentive readers might have noticed that the osm_id was kept in the data optimization step – if a point is clicked, its OSM_ID is shown in a tooltip. It would be better to link to the OSM feature through the tooltip.

The basemap is from [OpenFreeMap](https://openfreemap.org/).

MapLibre has a built-in [`NavigationControl`](https://maplibre.org/maplibre-gl-js/docs/API/classes/NavigationControl/) which lets the map access the user's location if they choose to permit it.

### 5. Host the site

As eluded to earlier, this site is hosted at a GitHub Page. Every time I commit to main, the site is re-built. Tiles are stored and loaded from GitHub, and the total hosting cost is $0. Easy!

## Extras

Going against goal 1, I thought about adding more features. The first was to add toilets and benches (already mentioned), which means the name doesn't really make sense anymore...

I then realized that I'm often looking for water / toilets / benches while doing some sport in the mountains. Adding elevation data to create a 3D map would help determine if the desired feature was uphill or downhill. I added this from [Tilezen and sources](https://github.com/tilezen/joerd/blob/master/docs/attribution.md), but then realized it was going against goal 2 by having to load terrain data, so a terrain toggle was added to reduce initial loading times.

## Thoughts and next steps

I think this turned out quite well! It was a great way to learn how to work with large OSM datasets, create map tiles, and build a map using MapLibre. While the scope did increase to include more data types, I think it still sticks to the core vision of being able to see where key features are quickly and in your proximity. The map and data load in under 4MB (most of that coming from the basemap from what I can tell) There are no operating costs – thank you to the open source contributors of the various libraries and datasets used, and to GitHub for supporting free hosting.

This post covers adding data for Switzerland, but data for all of Europe is currently on the map. Adding data globally would be nice, but I think I was pushing the limits of the number of changes in a commit that GitHub appreciates. I'm not sure if I'd run into diff size limitations or timeouts if trying to add more tiles.

Updating the data periodically would be nice as well. Automating the data processing and tiling steps would help make this easier.

For other ideas, please see the [Issues section](https://github.com/wrynearson/watermap/issues) of the repo. Feel free to open an issue yourself!

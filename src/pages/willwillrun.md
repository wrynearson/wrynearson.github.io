---
title: willwill.run
date: 2023-02-01
end-date: ""
url: https://willwill.run/
description: Process and visualize my runs on a 3D map.
problem: I wanted to learn Javascript, React, and how to build web maps.
outcome: A website that fetches my runs from Strava every 24h and displays them on an interactive map.
type: personal
client: none
role: Builder
repo: https://github.com/wrynearson/willwill.run/
---

_A massive thank you goes out to my colleague who spent so many hours patiently mentoring me, using this site as a way to teach Javascript, React, CSS, and other aspects of web development._

{% image "./src/assets/img/willwillrun/willwillrun.png", "Will Will Run", "(min-width: 30em) 50 vw, 100vw" %}

This is a React application that fetches and visualizes runs from Strava.

Runs are fetched daily from Strava. When a listed run is selected, it is displayed on the 3D map, along with basic information including:

- Run name
- Distance
- Pace
- Run type (normal or trail)
- Elevation gain

## How it works

There are several steps needed to get this working.

### Getting the runs

Strava [offers an API](https://developers.strava.com/docs/reference/) to access data stored with them. Their [getting started guide](https://developers.strava.com/docs/getting-started/) walks you through the steps required of requesting a developer account (by creating an API application), requesting data, authenticating, etc. These applications are often for users to authenticate with their account to access their data, and not to store and view other peoples' data (mine, in this case).

First, a list of runs is fetched. Pagination was needed because I have more than 200 activities (the limit per page). I have over 1,200 at the moment! The list of activities is saved as a json file, with some metadata about the activity.

Then, each activity ID in the activities list is used to fetch the run data. Only activities of type `run` (which include normal runs and trail runs) which have public visibility are requested. API requests are limited to 200 per 15 minutes, so the total requests need to be staggered. The streamed activities are transformed and saved as .geojson files, and the list of .geojson files are saved as a list.

### Displaying and deploying the site

The website is a single page React application, built with [Create React App](https://create-react-app.dev/). The body of the site is split into a runs section and map section. The list of runs is generated from the list of .geojson files. These can be sorted by name and date.

The map section is built using [MapLibre](https://maplibre.org/), with map tiles from [OpenFreeMap](https://openfreemap.org/) and hillshade/terrain data from [Tilezen and sources](https://github.com/tilezen/joerd/blob/master/docs/attribution.md). It's incredible that a 3D map can be built entirely with free and open source libraries.

## Next Steps

There are some feature enhancements I'd like to work on, which are listed in the [Issues section of the GitHub repo](https://github.com/wrynearson/willwill.run/issues).

I'd also like to add documentation so that other people can fork the repo and set up the site with their own activities.

Overall, I'm very happy how this has turned out. I've learned so much about Javascript, React, CSS and GitHub Actions. It was great to learn these concepts through a project, and a topic that I'm passionate about (running).

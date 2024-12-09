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
---

{% image "./src/assets/img/willwillrun/willwillrun.png", "Will Will Run", "(min-width: 30em) 50 vw, 100vw" %}

This is a React application that fetches and visualizes runs from Strava.

Activities of type Run (which include normal runs and trail runs) are fetched daily from Strava. When a listed run is selected, it is displayed on the map, along with basic information including:

- Run name
- Distance
- Pace
- Run type (normal or trail)
- Elevation gain

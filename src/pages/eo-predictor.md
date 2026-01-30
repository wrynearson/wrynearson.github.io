---
title: EO Predictor
draft: true
date: 2025-07-24
url: https://developmentseed.org/eo-predictor/
problem: Getting timely Earth observation (EO) data is hard, even for experts.
type: professional
client: development seed
role: builder
description: EO Predictor estimates when and where upcoming observations are
  likely to occur, helping people find relevant EO data faster.
outcome: A better overview of upcoming relevant EO data for disaster responders.
---
[_See this blog post for more details._](https://developmentseed.org/blog/2026-01-21-eo-predictor/)

Working with satellite data is difficult. A variety of providers, platforms and licensing restrictions make finding useful, timely Earth observation hard. Humanitarians and disaster responders have enough to worry about.

With the help of some colleagues (and chatbots...), I made [EO Predictor](https://developmentseed.org/eo-predictor/), a simple mobile-friendly website that shows upcoming predicted observations worldwide in the next 48h.

![](/assets/img/eo-predictor/eo-predictor-2.webp)

## Goals

I had two main goals for this project, in addition to improving my web dev skills:

1.  Not letting perfect get in the way of good. _Predictions that are close enough are all that's needed._
    
2.  Keep this as simple as possible without compromising on required features. _No servers, minimal external dependencies, etc._
    

## How it works

More details can be found in the [Github repo](https://github.com/developmentseed/eo-predictor), but in summary, there are two main pieces of data that power EO Predictor.

1.  Orbital predictions of satellites (fetched from [CelesTrak](https://celestrak.org/)).
    
2.  Properties about the satellite and its sensor (compiled from various sources and stored as constellation-level json files).
    

Each constellation has a json file, which requires a satellite ID number (or array of numbers for constellations), thus linking orbits with properties.

Using a Python library called [skyfield](https://rhodesmill.org/skyfield/), the position of each satellite is calculated in steps of time — currently every 5 minutes for a forward-looking 48 hour period. The positions are then connected to create linestrings representing their orbital paths. Relying mainly on the `swath width` value (the physical width of data the sensor collects), the path is then extruded into a polygon representing the observation area.

![](/assets/img/eo-predictor/eo-predictor-1.webp)

## What users can do

The current user workflow is as follows.

1.  Pan/zoom to their area of interest.
    
2.  Filter based on observation parameters — time, sensor type, spatial resolution, data access , taskability, daylighting, constellation and/or operator.
    
3.  See a list of predicted passes, in chronological order, that meet their filter criteria.
    
4.  See the same passes on the map.
    
5.  Click on an observation (list or map) and be directed to the official data repository of that provider.
    

## What can be done

Incorporating predicted cloud cover is on the top of the backlog. Working with users to hear more about their pain points in finding timely Earth observation is also high on the priority list, so that future work could be planned.

![](/assets/img/eo-predictor/eo-predictor-3.webp)

## What I learned

This has been a very fun project! I've learned a lot about satellites, such as:

1.  Orbital physics (which is quite advanced 🤯).
    
2.  The sensor properties (optical/SAR, resolution, swath width, etc.).
    
3.  Data repositories and their discoverability and timeliness (the sector is very siloed).
    

I've also learned a lot about building what's essentially a data dashboard without any databases or cloud storage, which in my mind would mean complexity. The satellite properties are stored as json files, the script to predict their observations is a single Python file which runs every 24h in a Github action, and the site is served as a static Github Page. This means no deployment, hosting or data access costs.

Hopefully this tool is useful for those who need an estimation of where upcoming Earth observations may take place.
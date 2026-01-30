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

![](/assets/img/eo-predictor/eo-predictor-1.webp)

## Goals

I had two main goals for this project, in addition to improving my web dev skills:

1.  Not letting perfect get in the way of good. _Predictions that are close enough are all that's needed._
    
2.  Keep this as simple as possible without compromising on required features. _No servers, minimal external dependencies, etc._
    

## How it works

More details can be found in the [Github repo](https://github.com/developmentseed/eo-predictor), but in summary, there are two main pieces of data that power EO Predictor.

1.  Orbital predictions of satellites (fetched from [CelesTrak](https://celestrak.org/))
    
2.  Properties about the satellite and its sensor (compiled from various sources and stored as constellation-level json files).
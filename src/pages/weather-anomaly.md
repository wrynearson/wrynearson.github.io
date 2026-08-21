---
title: Weather Anomaly
draft: true
date: 2026-03-16
end-date: 2026-05-24
url: https://developmentseed.org/weather-anomaly/
description: Visualizing forecasted weather compared to the historical baseline.
problem: Most consumer weather apps don't show how abnormal upcoming weather will be.
outcome: A global map showing how abnormal the daily temperature forecast (min,
  max, mean) is versus the baseline.
type: professional
client: development seed
role: builder
---
Summer 2026 in Europe has been hot. We've heard about it in the local and [global](https://www.nytimes.com/2026/08/14/climate/europe-heat-waves-jet-stream.html?eafs_enabled=false) news. People either:

1. Read about abnormal weather, which depends on someone determining that it's worth writing about;
2. Are warned about it by their meteo service, which is based on thresholds and not the degree of abnormality;
3. Experience it, potentially without adequate warning.

This product exposes the *degree* of abnormality of upcoming weather globally, starting with temperature. It compares global daily temperature forecasts of the next week to global 1990-2020 norms, answering:

1. How much warmer or colder will it be (±°C).
2. How "outside of the norm" (standard deviation σ) will it be.

![CleanShot 2026-08-21 at 12.00.16@2x.webp](</assets/img/CleanShot 2026-08-21 at 12.00.16@2x.webp>)

## How it works

The data prep is grouped into three steps, which are described in more detail in the [GitHub repository](https://github.com/developmentseed/weather-anomaly).

1. Historical weather data ([ERA5 reanalysis data](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=overview) from 1990 to 2020) is used to compute daily climatological stats for temperature (mean, min, max, variance) for each calendar day. I.e., all August 21sts are compared to compute the mean mean, mean min, mean max and variance of the three across the three decades.
2. Forecast data ([ECMWF IFS ensemble](https://dynamical.org/catalog/ecmwf-ifs-ens-forecast-15-day-0-25-degree/)) is resampled to compute daily temperature aggregates (mean, min, max)
3. The two are compared, calculating the difference in temperature (e.g., forecasted max minus historical mean max) and standard deviation.

Steps two and three are run daily via GitHub actions, updating the website to have a forward-looking 8-day window.

The data is stored as [zarr](https://zarr.dev/), a way to store chunked, multi-dimensional data. For the data, latitude, longitude, date, and variable (e.g., max temperature anomaly °C) are all dimensions, and is chunked based similarly to how map tiling works. That way, when someone is zoomed into a specific country or region, only data in their viewport is loaded for all dates and variables, making data transfer more efficient. It could be made more efficient by only sending the requested date or variable.

## Future Work

The product was [launched](https://www.linkedin.com/feed/update/urn:li:activity:7465125048157388800/) in June 2026. Europe (and other parts of the world) experienced multiple record-breaking heat waves later in the summer. 2027 is [predicted to be the hottest year on record](https://www.bbc.com/weather/articles/c3ekg93vjz9o).

I hope that this product is insightful for people, and can help them prepare for anomalous weather. Currently, only temperature is included, but the historical and forecast data include a rich variety of variables that could be insightful for people.


---
title: Coffee Log
draft: false
date: 2024-04-01
end-date: ""
description: Programmatically tracking the brews of coffee I prepare.
problem: The world of coffee has so much depth. How do I document my learning journey?
outcome: A list of beans and brews I prepare, and a greater appreciation for coffee, its producers and roasters.
client: none
type: professional
role: none
url: "https://wrynearson.github.io/coffee/"
---

Coffee is more than just ...coffee. You probably know it can be prepared in different ways. You might also know that it can be roasted in different ways.

That was the extent of my knowledge, until I fell into the rabbit hole of specialty coffee. Single origin, drying method, flavor notes, pour over technique – coffee encompasses so much more than just the bitter black liquid you mindlessly drink to start your day, or that milky, creamy beverage you might order from a cafe.

Being new to this world, and wanting to document my journey of discovery in it, I built a [coffee log](/coffee) to document it all.

## What It Does

The [coffee log](/coffee) keeps details of my coffee journey, and helps me improve my preparation.

It made up of a few different pieces

1. A [running list of coffees](/coffee) I've brew.
2. The [beans I have brewed with](/coffee/beans), including some data such as price, origin, and flavor notes.
3. The details of each brew, including the grind setting, brew time, and amount of coffee input and output.
4. Notes about the flavor, and comments about the process or end result.

## How It Works

A few pieces are needed to make the whole thing work.

The data about beans is added into a Google Sheet around when I buy or receive the coffee. I fill in as much information into the spreadsheet as possible, including the name, origin, varietal(s), drying and roast methods, price, roast date, and a few other fields. [Here's](/coffee/beans/18/) an example "bean page" with most of the collected information.

The brew information is added at the time of brewing using a Google Form. The form is updated daily with the list of (active) beans I have from the Google Sheet using Apps Script. Information such as the input and output mass (g), preparation method, brewing time, flavor notes and process comments. [Here's](/coffee/brews/245) an example "brew page" with most of the collected information.

There's a very small amount of automated data processing done in Google Sheets to ensure that brews and related info are in the right place, and which adds unique identifiers to the brews and beans. Because of this, and to not adjust the form responses directly, I use cell references in a separate sheet.

This site is built using [11ty](https://11ty.dev). Using a small [Javascript file](https://github.com/wrynearson/wrynearson.github.io/blob/11ty/src/_data/coffee.js), and again with the help of Apps Script, I fetch the brews and beans data on site build.

11ty's data and template support makes building new pages based on stored information very straightforward. The unique brew and bean identifiers can be used to build pages, such as`/coffee/beans/{bean_id}` or `/coffee/brews/{brew_id}`. Each page, or the coffee log itself, can reference data using straightforward for loops and key/object values.

## Next steps

Currently, this site is built locally, and then pushed to Github to trigger the Github Page to update. This could be done using Github Actions daily to keep the coffee log more updated.

Also, some of the data collected could be changed. For example, a quantitative rating could be added and later analyzed to see trends over time. However, this wouldn't definitively say much about my brewing technique, but could instead be highlighting the quality of beans I purchase, or my increased snobbiness towards coffee (hopefully not — I want to still appreciate a strong cup of diner coffee).

## Outcome

Overall, I learned a lot from this project.

1. Data-driven static site generation with 11ty.
2. Apps Script and their app deployments.
3. How my coffee brewing process changed over time.

Most importantly, it made me think much more about a crop with incredible diversity, and the people who prepare it for us along the way.

---
title: Coffee Log
date: 2099-01-01
tags: [Coding, Projects]
description:
author: Will Rynearson
image:
---

## Beans

<table class="table">
  <thead class="table-head">
  <tr class="table-row-head">
    <th class="cell">Coffee</th>
    <th class="cell">Country</th>
    <th class="cell">Process</th>
    <th class="cell">Roast Level</th>
    </tr>
   </thead>

    <tbody class="table-head">
    {% for meta in beans %}
        <tr class="table-row">
            <td class="cell">{{meta.internal_name}}</td>
            <td class="cell">{{meta.producing_country}}</td>
            <td class="cell">{{meta.process}}</td>
            <td class="cell">{{meta.roast_level}}</td>
        </tr>
    {% endfor %}
    </tbody>

</table>

## Brews

<table class="table">
  <thead class="table-head">
  <tr class="table-row-head">
    <th class="cell">Date</th>
    <th class="cell">Coffee</th>
    <th class="cell">Preparation</th>
    <th class="cell">Notes</th>
    </tr>
   </thead>

  <tbody class="table-head">
    {% for meta in brews %}
        <tr class="table-row">
            <td class="cell">{{meta.date}}</td>
            <td class="cell">{{meta.beans}}</td>
            <td class="cell">{{meta.type}}</td>
            <td class="cell">{{meta.notes}}</td>
        </tr>
    {% endfor %}
  </tbody>

</table>

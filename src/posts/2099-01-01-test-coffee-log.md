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
    <th class="cell">Bean</th>
    <th class="cell">Country</th>
    <th class="cell">Process</th>
    <th class="cell">Roast Level</th>
    </tr>
   </thead>

    <tbody>
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

<table>
  <thead>
  <tr>
    <th scope="col">Date</th>
    <th scope="col">Beans</th>
    <th scope="col">Type</th>
    <th scope="col">Notes</th>
    </tr>
   </thead>

    <tbody>
    {% for meta in brews %}
        <tr>
            <td>{{meta.date}}</td>
            <td>{{meta.beans}}</td>
            <td>{{meta.type}}</td>
            <td>{{meta.notes}}</td>
        </tr>
    {% endfor %}
    </tbody>

</table>

---
title: Coffee Log
date: 2099-01-01
tags: [Coding, Projects]
description:
author: Will Rynearson
image:
---

## Old Brews

<table class="table">
  <thead class="table-head">
  <tr class="table-row-head">
    <th class="cell">Date</th>
    <th class="cell">Coffee</th>
    <th class="cell">Preparation</th>
    <th class="cell">Notes</th>
    </tr>
   </thead>

  <tbody class="table-body">
    {% for meta in brews_old %}
        <tr class="table-row">
            <td class="cell">{{meta.date}}</td>
            <td class="cell">{{meta.beans}}</td>
            <td class="cell">{{meta.type}}</td>
            <td class="cell">{{meta.notes}}</td>
        </tr>
    {% endfor %}
  </tbody>

</table>

## Fetched Brews

<table class="table">
  <thead class="table-head">
  <tr class="table-row-head">
    <th class="cell">Date</th>
    <th class="cell">Coffee</th>
    <th class="cell">Preparation</th>
    <th class="cell">Notes</th>
    </tr>
   </thead>

  <tbody class="table-body">
    {% for meta in coffee.brews %}
        <tr class="table-row">
            <td class="cell"><time>{{ meta.Zeitstempe | readableDate }}</time></td>
            <td class="cell">{{meta.bean}}</td>
            <td class="cell">{{meta.Type}}</td>
            <td class="cell">{{meta.Notes}}</td>
        </tr>
    {% endfor %}
  </tbody>

</table>

## Fetched Beans

<table class="table">
  <thead class="table-head">
  <tr class="table-row-head">
    <th class="cell">Real Name</th>
    <th class="cell">Min Altitude</th>
    <th class="cell">Max Altitude</th>
    <th class="cell">Roast Level</th>
    <th class="cell">Archived</th>
    </tr>
   </thead>

  <tbody class="table-body">
  <!-- coffee is the .js file, and brewing is the object it returns -->
    {% for meta in coffee.beans %}
      {% if meta.archived == true %}
      
      <tr class="table-row">
        <td class="cell"><em>{{meta.real_name}}</em></td>
        <td class="cell">{{meta.alt_min}}</td>
        <td class="cell">{{meta.alt_max}}</td>
        <td class="cell">{{meta.roast_level}}</td>
        <td class="cell">{{meta.archived}}</td>
      </tr>

      {% else %}

      <tr class="table-row">
        <td class="cell">{{meta.real_name}}</td>
        <td class="cell">{{meta.alt_min}}</td>
        <td class="cell">{{meta.alt_max}}</td>
        <td class="cell">{{meta.roast_level}}</td>
        <td class="cell">{{meta.archived}}</td>
      </tr>

      {% endif %}
    {% endfor %}

  </tbody>

</table>

Hi

---
title: Coffee Log
date: 2099-01-01
tags: [Coding, Projects]
author: Will Rynearson
image:
permalink: "/coffee/"
---

<p class="description">I've prepared {{coffee.brews_combined.length}} coffees using {{coffee.beans.length}} types of coffee since I started tracking in early 2024.</p>

## Brews

<table class="table">
  <thead class="table-head">
  <tr class="table-head">
    <th class="table-head">Date</th>
    <th class="table-head">Coffee</th>
    <th class="table-head">Preparation</th>
    <th class="table-head">Notes</th>
    </tr>
   </thead>

  <tbody class="table-body">
    {% for meta in coffee.brews_combined reversed %}
        <tr class="table-row">
            <td class="cell"><time>
          {% if meta.date == blank %}
            <em>
              Early {{ meta.date | default: "2024" }}
              </em>
            {% else %}
            {{ meta.date | dateFormat }}
          {% endif %}
            </time></td>
            <td class="cell"><a href="/beans/{{meta.id}}">{{meta.bean}}</a></td>
            <td class="cell">{{meta.type}}</td>
            <td class="cell">{{meta.notes}}</td>
        </tr>
    {% endfor %}
  </tbody>

</table>

<br>

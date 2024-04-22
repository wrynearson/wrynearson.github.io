---
title: Coffee Log
date: 2099-01-01
tags: [Coding, Projects]
description:
author: Will Rynearson
image:
permalink: "/coffee/"
---

## Brews

<table class="table">
  <thead class="table-head">
  <tr class="table-head">
    <th class="cell">Date</th>
    <th class="cell">Coffee</th>
    <th class="cell">Preparation</th>
    <th class="cell">Notes</th>
    </tr>
   </thead>

  <tbody class="table-body">
    {% for meta in coffee.brews_combined %}
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

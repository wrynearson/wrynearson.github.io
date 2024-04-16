---
title: Coffee Log
date: 2099-01-01
tags: [Coding, Projects]
description:
author: Will Rynearson
image:
---

## Beans

<table>
  <thead>
  <tr>
    <th scope="col">Bean</th>
    <th scope="col">Country</th>
    <th scope="col">Process</th>
    <th scope="col">Roast Level</th>
    </tr>
   </thead>

    <tbody>
    {% for meta in beans %}
        <tr>
            <td>{{meta.internal_name}}</td>
            <td>{{meta.producing_country}}</td>
            <td>{{meta.process}}</td>
            <td>{{meta.roast_level}}</td>
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

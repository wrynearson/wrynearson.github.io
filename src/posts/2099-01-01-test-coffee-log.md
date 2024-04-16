---
title: Coffee Log
date: 2099-01-01
tags: [Coding, Projects]
description: Coffee
author: Will Rynearson
image:
---

<ul>
    {% for meta in beans -%}
    <li>{{ meta.internal_name }} was roasted on {{ meta.roast_date }}</li>
    {% endfor -%}
</ul>

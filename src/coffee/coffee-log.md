---
title: Coffee Log
author: Will Rynearson
image:
permalink: "/coffee/"
layout: base
---

# Coffee Log

<p class="description">I've prepared {{coffee.brews_combined.length}} coffees using <a href="/coffee/beans/">{{coffee.beans.length}} bags of coffee</a> since I started tracking in early 2024.</p>

<br>

<table class="table">
  <thead class="table-head">
  <tr class="table-head">
    <th class="table-head narrow">Date</th>
    <th class="table-head">Coffee</th>
    <th class="table-head narrow">Style</th>
    <th class="table-head wide">Notes</th>
    </tr>
   </thead>

  <tbody class="table-body">
    {% for meta in coffee.brews_combined reversed %}
      <tr class="table-row">
        {% if meta.starred == true %}
          <td class="cell starred">
              {% if meta.date == blank %}
                <a href="/coffee/brews/{{meta.brew_id}}" class="starred">
                  <em>
                    
                    Early {{ meta.date | default: "2024" }}

                  </em>
                </a>
              {% else %}
                <a href="/coffee/brews/{{meta.brew_id}}">
                  <time>
                  {{ meta.date | dateFormat }}
                  </time>
                </a>
              {% endif %}
          </td>
          <td class="cell starred">
            <a href="/coffee/beans/{{meta.id}}">{{meta.bean}}</a>
          </td>
          <td class="cell starred">{{meta.type}}</td>
          <td class="cell starred">{{meta.notes}}</td>
        {% else %}
          <td class="cell">
            <time>
              {% if meta.date == blank %}
                <em>
                  <a href="/coffee/brews/{{meta.brew_id}}">
                    Early {{ meta.date | default: "2024" }}
                  </a>
                </em>
              {% else %}
                <a href="/coffee/brews/{{meta.brew_id}}">
                  {{ meta.date | dateFormat }}
                </a>
              {% endif %}
            </time>
          </td>
          <td class="cell">
            <a href="/coffee/beans/{{meta.id}}">{{meta.bean}}</a>
          </td>
          <td class="cell">{{meta.type}}</td>
          <td class="cell">{{meta.notes}}</td>
        </tr>
      </tr>

        {% endif %}
    {% endfor %}

  </tbody>

</table>

<br>

<footer class="footer">
<div class="name_link">
  —
  <a href="{{ '/' | url }}">
    Will
  </a>
</div>
<div class="stats">
  <div class="words">
    {% fortawesomeRegular 'edit' %}
    <a href="{{ '/words' | url }}">
      <p title="I've written {{words.words}} words worth of notes in {{words.year}}, as of {{words.calculated}}">
        {{ words.words }} words
      </p>
    </a>
  </div>
  <div class="coffee">
    <a href="{{ '/coffee'}}">☕️ {{ coffee.brews_combined.length }}</a>
  </div>
</div></div>
</footer>

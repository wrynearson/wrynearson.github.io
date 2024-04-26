---
title: Coffee Beans
author: Will Rynearson
image:
description: Here's the list of coffee I've been brewing since early 2024. Click on the name for more information about that type of coffee, and to see the various brews using that coffee.
permalink: "/coffee/beans/"
layout: base
---

# Coffee Beans

<div class="description">
  {{ description }}
</div>

<br>

<table class="table">
    <thead class="table-head">
        <tr class="table-head">
        <th class="table-head narrow">Name</th>
        <th class="table-head narrow">Producing Country</th>
        <th class="table-head narrow">Roaster</th>
        </tr>
   </thead>

    <tbody class="table-body">
        {% for meta in coffee.beans reversed %}
            {% if meta.archived == true %}
                <tr class="table-row">
                    <td class="cell archived">
                        <a href="/coffee/beans/{{meta.id}}/">
                            {{meta.real_name}}
                        </a>
                    </td>
                    <td class="cell archived">
                        {{meta.producing_country}}
                    </td>
                    {% if meta.roaster == blank %}
                        <td class="cell archived">
                            <a href="{{meta.bean_link}}">
                                {{meta.shop}}
                            </a>
                        </td>
                    {% else %}
                        <td class="cell archived">
                            <a href="{{meta.bean_link}}">
                                {{meta.roaster}}
                            </a>
                        </td>
                    {% endif %}
                </tr>
            {% else %}
                <tr class="table-row">
                    <td class="cell">
                        <a href="/coffee/beans/{{meta.id}}/">
                            {{meta.real_name}}
                        </a>
                    </td>
                    <td class="cell">
                        {{meta.producing_country}}
                    </td>
                    {% if meta.roaster == blank %}
                        <td class="cell">
                            <a href="{{meta.bean_link}}">
                                {{meta.shop}}
                            </a>
                        </td>
                    {% else %}
                        <td class="cell">
                            <a href="{{meta.bean_link}}">
                                {{meta.roaster}}
                            </a>
                        </td>
                    {% endif %}
                </tr>
            {% endif %}
        {% endfor %}
    </tbody>

</table>

<p> See all brews in the <a href="/coffee/"">Coffee Log</a>.

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
    </div>
</footer>

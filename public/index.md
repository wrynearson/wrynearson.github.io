---
title: Title of site
layout: "base.liquid"
about: About me is about someone and might be about some projects, maybe some traits, and possibly some hobbies.
---

<div class=about>
  {{ about }}
</div>

## Posts

{% for post in collections.posts reversed %}
  <a href="{{ post.url }}">
    <div class="post-title"> 
      {{ post.data.title }}
    </div>
    <time>{{ post.data.date | date: "%B %d, %Y" }}</time>
  </a>
{% endfor %}

## Projects

{% for post in collections.projects %}
  <a href="{{ post.url }}">
    <div class="project-title">
      {{ post.data.title }}
    </div>
  </a>
{% endfor %}

Here's an image:

![NEAT+](/assets/img/neat_logo_2.png)
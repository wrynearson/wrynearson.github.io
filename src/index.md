---
title: Will Rynearson
layout: "base.liquid"
description: Will Rynearson | Product Manager,  Sustainability Advocate, Outdoor Enthusiast
---

<div class=about-me>
  I lead projects that are good for the planet.
  
  I'm currently a <a href="https://en.wikipedia.org/wiki/Product_manager"> Product Manager</a> with <a href="https://developmentseed.org"> Development Seed</a>. Previously, I was a Project Analyst for the United Nations, working on improving the <a href="{{ base.url }}/NEAT+"> environmental sustainability of humanitarian action</a>. 
  
  In my free time, you can find me in the mountains or <a href="{{ base.url }}/portfolio">taking photos</a>. 
  
  Feel free to reach out on <a href="https://www.linkedin.com/in/willrynearson/">LinkedIn</a>.
</div>

## Posts

{% for post in collections.posts reversed %}
<a href="{{ post.url }}">

<div class="post-title">
{{ post.data.title }}
</div>
</a>
{% endfor %}

## Projects

{% for post in collections.pages %}
<a href="{{ post.url }}">

<div class="project-title">
{{ post.data.title }}
</div>
</a>
{% endfor %}

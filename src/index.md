---
title: Will Rynearson
layout: "base.liquid"
description: Will Rynearson | Product Owner,  Sustainability Advocate, Outdoor Enthusiast
---

<div class=about-me>
  Hi! I'm a <a href="https://www.scrum.org/resources/what-is-a-product-owner"> Product Owner</a> with <a href="https://developmentseed.org"> Development Seed</a>. Previously, I was a consultant for the United Nations, working on improving the <a href="{{ base.url }}/NEAT+"> environmental sustainability of humanitarian action</a>. 
  
  I'm learning <a href="https://grow.google/certificates/data-analytics/#?modal_active=none">data analysis</a>, web design (this site), and German. In my free time, you can find me in the mountains or <a href="{{ base.url }}/portfolio">taking photos</a>. 
  
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

{% for post in collections.pages reversed %}
<a href="{{ post.url }}">

<div class="project-title">
{{ post.data.title }}
</div>
</a>
{% endfor %}

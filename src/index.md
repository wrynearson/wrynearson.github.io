---
title: Will Rynearson
layout: "base.liquid"
description: Will Rynearson | Product Manager, Sustainability Advocate, Outdoor Enthusiast
---

<div class=about-me>
  <p>I lead projects that are good for the planet.</p>
  
  <p>I'm currently a <a href="https://en.wikipedia.org/wiki/Product_manager"> Product Manager</a> with <a href="https://developmentseed.org"> Development Seed</a>, where I lead a variety of projects primarily related to environmental and social sustainability.</p>
  
  <p>Previously, I was a Project Analyst for the United Nations, working on improving the <a href="{{ base.url }}/NEAT+"> environmental sustainability of humanitarian action</a>.</p>

  </p>I grew up in the US, lived in <a href="{{ base.url }}/houtouwan">China</a>, and now live in Switzerland.</p>

  </p>In my free time, you can find me in the mountains or <a href="{{ base.url }}/portfolio">taking photos</a>.</p>

  </p>Feel free to reach out on <a href="https://www.linkedin.com/in/willrynearson/">LinkedIn</a>.</p>

</div>

## Projects

{% for post in collections.pages reversed %}
<a href="{{ post.url }}">

<div class="project-title">
{{ post.data.title }}
</div>
</a>
{% endfor %}

## Posts

{% for post in collections.posts reversed %}
<a href="{{ post.url }}">

<div class="post-title">
{{ post.data.title }}
</div>
</a>
{% endfor %}

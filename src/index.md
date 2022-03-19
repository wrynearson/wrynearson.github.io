---
title: Will Rynearson
layout: "base.liquid"
---

<div class=about-me>
  Hi! I'm Will, a sustainability analyst. I'm currently a consultant for the United Nations working on improving the <a href="{{ base.url }}/NEAT+"> environmental sustainability of humanitarian action</a>. I'm learning data analysis, web design, and French. In my free time, you can find me in the mountains or taking photos. Feel free to reach out on <a href="https://www.linkedin.com/in/willrynearson/">LinkedIn</a>.
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
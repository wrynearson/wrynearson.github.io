---
title: Will Rynearson
layout: "base.liquid"
description: Will Rynearson | Product Manager, Sustainability Advocate, Outdoor Enthusiast
---

<section id=about-me>

  <p>I lead projects that are good for the planet.</p>
  
  <p>I'm currently a <a href="https://en.wikipedia.org/wiki/Product_manager"> Product Manager</a> with <a href="https://developmentseed.org"> Development Seed</a>, where I lead a variety of web development projects primarily related to environmental and social sustainability.</p>
  
  <p>Previously, I was a Project Analyst for the United Nations, working on improving the <a href="{{ base.url }}/NEAT+"> environmental sustainability of humanitarian action</a>.</p>

  </p>I grew up in the US, lived in <a href="{{ base.url }}/houtouwan">China</a>, and now live in Switzerland.</p>

  </p>In my free time, you can find me in the mountains or <a href="/photos/">taking photos</a>.</p>

  </p>Feel free to reach out on <a href="https://www.linkedin.com/in/willrynearson/">LinkedIn</a>.</p>

</section>

<section id="recently">

## Recently

{% assign mostRecent = collections.mostRecent %}
{% if mostRecent %}

<details>

<summary>{{ mostRecent.data.date | date: "%B %Y" }}</summary>

{{ mostRecent.content }}

<div>
  <br/>
  <hr/>
  <h3>Previously</h3>
  {% assign previousPosts = collections.recently | reverse | slice: 1, collections.recently.size %}
  
  {% for recently in previousPosts %}
  <a href="{{ recently.url }}">
    <div class="recently">
    {{ recently.data.date | date: "%B %Y" }}
    </div>
  </a>
  {% else %}
  <em> No previous posts.</em>
{% endfor %}

</div>

</details>
{% else %}
  <p>No recent files found.</p>
{% endif %}

</section>

<section id="projects">

## Projects

{% for post in collections.pages reversed %}

<div class="post-title">
<a href="{{ post.url }}">{{ post.data.title }}</a>
<!-- <div class="project-type">{{ post.data.type }}</div> -->
<time>{{ post.data.date | date: "%B %Y" }}</time> 
</div>

{% endfor %}

</section>

<section id="posts">

## Posts

{% for post in collections.posts reversed %}

<div class="post-title">
<a href="{{ post.url }}">{{ post.data.title }}</a>
<time>{{ post.data.date | date: "%B %Y" }}</time> 
</div>

{% endfor %}

</section>

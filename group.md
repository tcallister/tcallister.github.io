---
title: Gravitational Waves at Williams
permalink: /group/
intro: |-
  See below for the current Williams group!
  If you are a Williams student and looking for ways to get involved, email me at tac7@williams.edu or drop by my office to chat.
---
{% comment %}
  People come from _people/ (one file per person). Fields:
    name, role, start (year), end (year; leave out while current),
    photo (filename in assets/images/people/; optional, initials shown otherwise),
    now (alumni: current position), link (optional personal page; not `url`, which Jekyll reserves).
  The file body is a one- or two-sentence project description (shown for current members).
  No `end` → listed under Current; with `end` → listed under Alumni.
{% endcomment %}
{% assign current = site.people | where_exp: "p", "p.end == nil" | sort: "start" %}
{% assign alumni = site.people | where_exp: "p", "p.end != nil" | sort: "end" | reverse %}

<section class="block">
  <h2 class="label">Current</h2>
  <div class="people">
    {% for p in current %}
    <article class="person" id="{{ p.slug }}">
      {% if p.photo %}
        <img class="avatar" src="{{ '/assets/images/people/' | append: p.photo | relative_url }}" alt="{{ p.name }}" loading="lazy">
      {% else %}
        {% assign words = p.name | split: " " %}
        <div class="avatar t{{ forloop.index0 | modulo: 5 | plus: 1 }}" aria-hidden="true">{{ words.first | slice: 0 }}{{ words.last | slice: 0 }}</div>
      {% endif %}
      <div>
        <h3>{% if p.link %}<a href="{{ p.link }}">{{ p.name }}</a>{% else %}{{ p.name }}{% endif %}</h3>
        <p class="role">{{ p.role }} · since {{ p.start }}</p>
        {{ p.content | markdownify }}
      </div>
    </article>
    {% endfor %}
  </div>
</section>

{% if alumni.size > 0 %}
<section class="block">
  <h2 class="label">Alumni</h2>
  <ul class="alumni">
    {% for p in alumni %}
    <li id="{{ p.slug }}">
      <span class="an">{% if p.link %}<a href="{{ p.link }}">{{ p.name }}</a>{% else %}{{ p.name }}{% endif %}</span>
      <span class="ar">{{ p.role }}, {{ p.start }}{% if p.end != p.start %}–{{ p.end }}{% endif %}</span>
      {% if p.now %}<span class="now">Now: {{ p.now }}</span>{% endif %}
    </li>
    {% endfor %}
  </ul>
</section>
{% endif %}

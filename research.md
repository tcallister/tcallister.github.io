---
title: Research
permalink: /research/
intro: |-
  How and where do black holes and neutron stars form? What are their properties? And how can we extract this information from noisy and incomplete data? These are the questions I'm excited by and work to answer.
---
{% comment %}
  Themes come from _research/ (one file per theme), sorted by `order`. The same files make the home-page tiles.
  Each theme: title, order, color (1-5), desc (optional tile caption; none used), image (optional; tile + figure here), credit (image credit under figure; markdown links OK),
  papers (arXiv IDs, as quoted strings, of papers in _papers/). The file body is the description.
{% endcomment %}
{% assign themes = site.research | sort: "order" %}
{% for t in themes %}
<section class="res-item" id="{{ t.slug }}" style="--theme: var(--a{{ t.color | default: 1 }})">
  <h2>{{ t.title }}</h2>
  <div class="res-body">
    {% comment %} Figure comes first so the text can wrap around it (CSS float) {% endcomment %}
    {% if t.image %}
      {% assign src = '/assets/images/' | append: t.image | relative_url %}
      <figure class="res-fig"><a href="{{ src }}"><img src="{{ src }}" alt="" loading="lazy"></a>
        {% if t.credit %}<figcaption>{{ t.credit | markdownify | remove: '<p>' | remove: '</p>' | strip }}</figcaption>{% endif %}</figure>
    {% endif %}
    {{ t.content | markdownify }}
  </div>
  {% if t.papers.size > 0 %}
  <h3 class="label">Selected papers</h3>
  <ul class="res-papers">
    {% for id in t.papers %}
      {% assign p = site.papers | where: "arxiv", id | first %}
      {% if p %}
        <li><a href="https://arxiv.org/abs/{{ p.arxiv }}">{{ p.title }}</a> <span class="ry">{{ p.date | date: "%Y" }}</span></li>
      {% else %}
        <li>Missing paper: arXiv {{ id }} is not in _papers/</li>
      {% endif %}
    {% endfor %}
  </ul>
  {% endif %}
</section>
{% endfor %}

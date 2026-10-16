---
title: News
permalink: /news/
redirect_from: /news.html
---
{% comment %}
  Items come from _news/ (one file per item), newest first.
  Each item's id (#slug) lets the home-page feed link straight to it.
  Optional `image` (path under assets/images/) shows uncropped below the text; click → full size.
{% endcomment %}
{% assign news = site.news | sort: "date" | reverse %}
{% for n in news %}
<article class="news-item" id="{{ n.slug }}">
  <span class="fd">{{ n.date | date: "%B %-d, %Y" }}</span>
  <h2>{{ n.title }}</h2>
  {{ n.content | markdownify }}
  {% if n.image %}
    {% assign src = '/assets/images/' | append: n.image | relative_url %}
    <a class="news-img" href="{{ src }}"><img src="{{ src }}" alt="" loading="lazy"></a>
  {% endif %}
</article>
{% endfor %}

---
title: Gallery
permalink: /gallery/
redirect_from: /gallery.html
rule: noise    # header rule: sketched noise instead of the chirp
intro: |-
  I spend a lot of time making plots and graphics for talks, and sometimes I'm asked to share these for others to use.
  Below are some recent figures, with links to the code used to make them.
  Please use them in your own talks! If you do, please credit me (and feel free to star the GitHub repos).


  Suggested credit: *Figure: T. Callister (github.com/gw-gallery)*
---
{% comment %}
  Items come from _gallery/ (one file per figure set), sorted by `order`.
  Each item: title, order, repo, images (filenames in assets/images/gallery/; .mp4 → looping video).
  Clicking a figure opens the full-size file.
{% endcomment %}
{% assign items = site.gallery | sort: "order" %}
{% for g in items %}
{% unless forloop.first %}<canvas class="noise-rule" aria-hidden="true"></canvas>{% endunless %}
<article class="gal-item" id="{{ g.slug }}">
  <h2>{{ g.title }}</h2>
  <div class="gal-figs{% if g.images.size == 1 %} one{% endif %}">
    {% for f in g.images %}
      {% assign src = '/assets/images/gallery/' | append: f | relative_url %}
      {% if f contains '.mp4' %}
        <video src="{{ src }}" data-autoplay loop muted playsinline controls preload="metadata"></video>
      {% else %}
        <a href="{{ src }}"><img src="{{ src }}" alt="" loading="lazy"></a>
      {% endif %}
    {% endfor %}
  </div>
  {{ g.content | markdownify }}
  {% if g.repo %}<div class="meta"><a class="btn" href="{{ g.repo }}">{% include icon-github.html %}Code and variants on GitHub</a></div>{% endif %}
</article>
{% endfor %}

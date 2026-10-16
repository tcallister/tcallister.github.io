---
title: Selected Publications
permalink: /publications/
redirect_from: /publications.html
intro: |-
  Among co-authored LIGO-Virgo-KAGRA collaboration papers, only those to which I directly contributed appear in selected publications below.

  * [Selected publications](https://scixplorer.org/public-libraries/4dPzXD5qTGOB007HInq-DA) on SciX
  * [Complete list](https://scixplorer.org/public-libraries/uFuoi1M4TGmSvUMbYWVMYw) on SciX, including all co-authored LVK papers
---
{% comment %}
  Papers come from _papers/ (one file per paper), newest first, grouped by year.
  Filter chips sit below the header rule (was `card_include: pub-filters.html`, inside the card).
{% endcomment %}
{% include pub-filters.html %}
{% assign papers = site.papers | sort: "date" | reverse %}
{% assign years = papers | group_by_exp: "p", "p.date | date: '%Y'" %}
{% for y in years %}
<section class="year-group">
  <h2 class="year">{{ y.name }}</h2>
  {% for p in y.items %}{% include paper.html p=p %}{% endfor %}
</section>
{% endfor %}

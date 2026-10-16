---
title: CV
permalink: /cv/
pdf: /assets/Callister_CV.pdf   # full CV; copy the compiled PDF here under the same name to update
pdf_desc: Publications, talks, teaching & mentoring, service & outreach, honors   # shown on the header-card link
card_include: cv-card.html
employment:
  - years: 2025–present
    title: Assistant Professor of Astronomy
    place: Williams College
  - years: 2022–2025
    title: KICP Fellow<br>Schmidt AI in Science Postdoctoral Fellow   # <br> = line break
    place: Kavli Institute for Cosmological Physics, University of Chicago
  - years: 2019–2022
    title: Flatiron Research Fellow
    place: Center for Computational Astrophysics, Flatiron Institute
education:
  - years: 2014–2019
    title: Ph.D. in Physics
    place: California Institute of Technology
  - years: 2013–2014
    title: M.Phil. in Astronomy
    place: University of Cambridge
  - years: 2009–2013
    title: B.A. in Physics and Astronomy
    place: Carleton College
---
{% comment %}
  Short CV: edit the `employment` and `education` lists above (newest first).
  Each entry: years, title, place. The full CV is the PDF at `pdf`.
{% endcomment %}
{% assign sections = "employment,education" | split: "," %}
{% for s in sections %}
<section class="block cv-block">
  <h2 class="label">{{ s | capitalize }}</h2>
  <ul class="cv-list">
    {% for e in page[s] %}
    <li>
      <span class="cy">{{ e.years }}</span>
      <span><span class="ct">{{ e.title }}</span><span class="cp">{{ e.place }}</span></span>
    </li>
    {% endfor %}
  </ul>
</section>
{% endfor %}

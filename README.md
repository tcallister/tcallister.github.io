# tcallister.github.io

Personal academic website. Jekyll 3.10 (via the `github-pages` gem), custom theme, built and served by GitHub Pages from `master`.

Content lives as **one markdown file per item** in five folders. Each item appears on a page (and some on the home page) but gets no URL of its own; links to it use anchors like `/news/#slug`, where `slug` is the filename minus `.md`.

| Folder | Shows up on | Sorted by |
|---|---|---|
| `_papers/` | Publications; "Selected papers" on Research | `date`, newest first |
| `_news/` | News; latest 3 on home | `date`, newest first |
| `_gallery/` | Gallery | `order` |
| `_people/` | Group | `start` (current), `end` (alumni) |
| `_research/` | Research; home-page tiles | `order` |

Images go in `assets/images/` (subfolders noted below).

## Two rules that break things silently

1. **Quote arXiv IDs**: `arxiv: "2011.09570"`, not `arxiv: 2011.09570`. YAML reads the unquoted form as a number and drops the trailing zero. Same for the `papers:` list in `_research/`.
2. **Quote any value that contains `: `**, e.g. `title: "Spins: a review"`. Otherwise the file fails to parse.

Also: never name a field `url` (Jekyll reserves it). Use `link`.

## Add a paper

`_papers/YYYY-firstauthor-short-title.md` (filename is for your convenience only):

```yaml
---
title: "Gravitational-wave constraints on the progenitors of fast radio bursts"
authors: "T. Callister, J. Kanner, and A. Weinstein"   # "T. Callister" is bolded automatically
date: 2016-03-01                  # sets sort order
venue: "Astrophys. J. Letters 825, L12"
arxiv: "1603.08867"               # QUOTED. Gives arXiv, SciX, and INSPIRE links
journal: https://iopscience.iop.org/article/10.3847/2041-8205/825/1/L12/
thumbnail: papers/2011.09570.webp  # optional; path under assets/images/. 336x252 (4:3) WebP crop of a figure
tags: [first]                     # any of: first, student, lvk
role: "Writing Team & Core Analyst"   # optional; shown after author list (useful for LVK papers)
highlight: "PRL Editor's Suggestion"  # optional; free-text badge
coverage:                         # optional; press pills with outlet logo
  - outlet: aasnova               # key in _data/coverage.yml (aasnova, physics, astrobites, spacecom, astronomy, sciam)
    link: https://aasnova.org/...
    label: "AAS Nova"             # optional; overrides the outlet's default text
---
```

No body needed.

**Author lists**: if T. Callister is 1st–3rd author, list names through T. Callister (then `, et al.` if more follow). Otherwise use `"A. Author et al. (incl. T. Callister)"`.

**New tag type**: add its label to `_data/badges.yml`, then add a `.badge.<tag>` rule and a `.chip[data-filter="<tag>"]` rule in `assets/css/main.scss` (copy the existing ones).

## Add a news item

`_news/YYYY-MM-DD-short-name.md`:

```yaml
---
title: Non-parametric BBH populations paper in PRX
date: 2024-04-01
image: news/prx.jpeg     # optional; under assets/images/. Shown uncropped below the text
---
A few sentences of markdown. [Links](https://example.com) work.
```

## Add a gallery entry

Put the files in `assets/images/gallery/`, then create `_gallery/short-name.md`:

```yaml
---
title: Landscape of observed compact binary mergers
order: 1                 # position on the page
repo: https://github.com/gw-gallery/cbc-landscape   # optional
images:                  # filenames only; .mp4 plays as a looping video
  - cbc_landscape_gwtc3.png
  - cbc_landscape_gwtc3_with_errors.png
---
Caption in markdown. Say "first/second", not "left/right": images stack on phones.
```

## Add a group member

`_people/first-last.md`:

```yaml
---
name: Celine Mayer
role: Undergraduate, Williams '27
start: 2026
end: 2027             # leave out while current; adding it moves them to Alumni
photo: celine.jpg     # optional; in assets/images/people/. Initials shown otherwise
now: PhD student, MIT   # alumni only: current position
link: https://...     # optional personal page
---
One or two sentences on their project (shown for current members only).
```

Photos display at 4:5; crop accordingly.

## Add or edit a research theme

`_research/short-name.md`. Each theme is one section on the Research page **and** one tile on the home page.

```yaml
---
title: Black hole populations
order: 1                  # position on page and among tiles
color: 1                  # accent color, 1–5
image: research/ngc6397-black-holes.jpg   # optional; under assets/images/
credit: "Illustration: ESA/Hubble, N. Bartmann"   # optional; shown under the figure; markdown links OK
papers: ["2302.07289", "2205.08574"]   # QUOTED arXiv IDs of papers in _papers/
---
A paragraph describing the theme.
```

An ID not found in `_papers/` renders as "Missing paper".

## Update the CV

`cv.md` front matter holds the `employment` and `education` lists (`years`, `title`, `place`; newest first; `<br>` in a title forces a line break). The header-card link to the full CV shows `pdf_desc` as its description. For the full CV, recompile the LaTeX and copy the PDF to `assets/Callister_CV.pdf` (same name, so links don't change).

## Site-wide settings

`_config.yml` holds the name, search-engine description, contact links (home page), footer, side-strip image and credit, and the "Featured in" label for press pills. Page intros are the `intro:` field at the top of `research.md`, `group.md`, etc. The home bio is the body of `index.md`; the headshot is its `photo:` field.

`news.md`, `publications.md`, and `gallery.md` carry `redirect_from:` so the old site's URLs (`/news.html` etc.) forward to the new ones. Leave these in place; renaming a page's `permalink` needs a matching `redirect_from` too.

## Preview locally

Uses the conda env `personal-website-development` (Ruby + gems installed inside it):

```sh
conda run --no-capture-output -n personal-website-development bundle exec jekyll serve --livereload
```

Then open http://localhost:4000. Restart the server after editing `_config.yml`; it isn't reloaded live.

## Publish

Push to `master`. GitHub Pages rebuilds automatically (a minute or two).

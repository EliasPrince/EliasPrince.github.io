# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bundle install              # Install Ruby dependencies
bundle exec jekyll serve    # Run local dev server (http://localhost:4000)
bundle exec jekyll build    # Build static site to _site/
```

## Architecture

This is a **Jekyll static site** hosted on GitHub Pages — no Node.js, no build pipeline beyond Bundler/Jekyll.

**Key patterns:**
- Site-wide config (title, hero text, skills, colors) lives in `_config.yml` — prefer editing data there over hardcoding in templates
- `_layouts/` contains page skeletons (`wrapper.html` is the main layout); `_includes/` contains reusable components dropped in via `{% include %}` tags
- `_projects/` is a Jekyll collection — each subdirectory is a project entry rendered via `_layouts/post.html`
- CSS variables for theming are defined at the top of `css/styles.css`; theme colors are also declared in `_config.yml` and referenced in templates
- `_site/` is generated output — never edit files there directly

**Content flow:** `_config.yml` data → Liquid templates in `_layouts/` and `_includes/` → rendered HTML in `_site/`

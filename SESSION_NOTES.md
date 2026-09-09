# Session Notes — 2026-09-09

Handoff from a visual-design session, picked up right after the 2026-09-08 cleanup pass below. **No production files changed** — this session was scoped entirely to nailing down a new visual direction before porting it. Read this before picking up the port.

## What happened this session

User shared a screenshot of an internal dev-tool/agent-runtime UI they liked (monospace labels, muted palette, technical schematic feel) and asked for thoughts on the direction for this portfolio. After discussion, scope was narrowed to *just the visual language* — type, color, borders — not the literal graph/interactive-panel UI from the reference.

Iterated live in a new standalone file, **`style-test.html`** at the repo root (self-contained HTML/CSS, real site content, excluded from the Jekyll build via `_config.yml`'s `exclude:` list). To preview it: `python3 -m http.server 8934` from the repo root, then open `http://localhost:8934/style-test.html` (opening via `file://` also works in a normal browser — only the Chrome automation extension used during this session couldn't navigate to `file://` directly).

### Design decisions locked in (don't re-litigate without reason)

- **Palette pared to 3 colors**: warm paper background (`#eeeae0`), dark ink text (`#23231f`), one muted slate-blue accent (`#46647d`). No multi-color tier coding like the reference image had.
- **Type**: IBM Plex Mono (Google Fonts) for headings/nav/labels/tags, uppercase + letter-spaced for labels; Inter for body copy.
- **Sharp corners, hairline borders** instead of shadows/rounded cards — same box language reused across the photo frame, project cards, skill tags, and the contact form.
- **No background texture** — a grid-paper background was tried and explicitly rejected ("too much"). Flat paper color only.
- **Hero layout matches the original site's architecture**: text left, photo right, horizontal — not centered/stacked (a centered-stack version was tried and rejected; user asked to go back to the original arrangement, just with a bigger square/bordered photo instead of circular).
- **No status bar** — the reference image's "STATUS / ROLE / BASE / FOCUS" strip was cut as an unneeded feature, not core info.
- **Nav mark is a small bordered "EP" monogram**, not the spelled-out name — spelling it out read as redundant against the hero heading.
- **Wider content column**: max-width 1280px with 32px side padding, not the original's larger margins.
- **Section headings** (Projects/Skills/Contact) each get a small accent-colored square marker before the text, to give the accent color a deliberate presence beyond hover states.
- User's stated general principle: default to the simpler version at every step, cut anything that isn't core info. Several rounds of this session were "tone it down further" — trust that instinct during the port too, rather than re-adding chrome.

### Next session: port this into production

The plan (confirmed with user) is to port `style-test.html`'s CSS into the real site — `css/styles.css` and the `colors:` block in `_config.yml` — applied across the actual layouts (`_layouts/`, `_includes/`), **not** a wholesale copy-paste. Important constraint: `style-test.html` has **zero responsive rules** (it's a desktop-width mockup only). `css/styles.css` already has real breakpoints at 1200px/768px/600px (see its bottom third) — the new type/color/border language needs to be threaded into those existing breakpoints, not bypass them.

Read `style-test.html` fresh when starting the port rather than trusting this summary for exact values — it may have had further small tweaks.

---

# Session Notes — 2026-09-08

Handoff notes from a portfolio cleanup/prep session ahead of job applications. Read this before picking up more work.

## What was shipped this session

Commits `d2e5e8e..fafe33c` on `main`, pushed to `origin/main` (GitHub Pages auto-deploys from there — live at eliasprince.github.io).

1. **`d2e5e8e`** — Fixed a real bug: `_config.yml` had `text: "##1a1c20"` (double `#`, invalid CSS). Because `color` is an inherited CSS property, body text still rendered black by fallback, but the contact form's input/textarea `border` (non-inherited) silently collapsed to `0px none` — **the contact form inputs were invisible**, just floating labels with no visible box. Also fixed the local dev server, which couldn't run at all (Ruby version mismatch — see Local Dev Setup below).
2. **`fd24c08`** — Compressed all project + profile images: 78MB → 16MB, no visible quality loss (see Image Pipeline below). Along the way found 2 files that were PNG renders/screenshots mislabeled `.jpeg` — renamed to `.png` instead of lossy-recompressing them (see below).
3. **`a417cfd`** — Removed template cruft: orphaned `_layouts/about.html` (unused placeholder, not linked anywhere), `assets/readme/` (5.1MB of the Jekyll template's own onboarding screenshots), `Reference/template.md`.
4. **`fafe33c`** — Removed the Resume link (nav + footer) and deleted the resume PDF — it was out of date. Also finished untracking `_site/` from git (a mid-session `git reset` had accidentally re-staged 9 of those files before the first cleanup commit, so `a417cfd` only got most of the way).

## Local dev setup (read this before running `jekyll serve`)

System Ruby (2.6) is too old; Homebrew's default `ruby` (4.0) is too new — the `github-pages` gem pins an old Jekyll/Liquid that calls `Object#tainted?`, removed in Ruby 3.2+. Use Ruby 3.1:

```bash
brew install ruby@3.1   # if not already installed
export PATH="/opt/homebrew/opt/ruby@3.1/bin:$PATH"
bundle install
bundle exec jekyll serve --port 4321
```

`_config.yml` changes need a full server restart — Jekyll's `--watch` auto-regen does not pick up config changes, only content/template edits.

Gemfile has `csv`/`base64`/`logger`/`bigdecimal`/`webrick` added explicitly (Ruby 3.4+ dropped these as default gems; harmless on older Ruby).

## Image pipeline

Only `sips` (macOS built-in) is installed — no imagemagick/cwebp/jpegoptim on this machine as of 2026-09-08. Compression recipe used:

```bash
sips -Z 1600 -s formatOptions 72 -s format jpeg "$f" --out "$f.tmp" && mv "$f.tmp" "$f"
```

**Before bulk-compressing, always check actual format vs. extension**: `sips -g format <file>`. Two files in `_projects/` were CAD/FEA renders or screenshots (flat colors, sharp text) saved as PNG but named `.jpeg` — forcing those through JPEG compression made them *bigger* and would add visible artifacts. They're now correctly named `.png`:
- `_projects/EPF13/EPF13_2.png` (was `.jpeg`)
- `_projects/Aquaculture-Pens/SeaStation1.png` (was `.jpeg`)

Rule of thumb: real camera photos → JPEG compresses well. Renders/screenshots/diagrams → keep PNG.

## What's NOT done yet — likely next-session work

The user's original ask was "add more text and images" and "clear UI that isn't janky." This session was almost entirely bug-fixing and cleanup — it did NOT add new content. Remaining/open items, roughly in likely priority order:

- **Add more project content/images** — the actual ask. Current 5 projects each have a short description + 5 skill tags + photo gallery, which the user said is enough depth per project — but they may want *more projects* added, or more photos per existing project.
- **Resume** — link and PDF were removed because the PDF was out of date. Needs a new PDF re-added to `assets/resume/` + the nav/footer links restored (see git history around `fafe33c` for exactly what was removed, easy to reverse).
- **Project grid has 5 cards** in a 2-column grid, leaving one slot empty/asymmetric on the last row. Not broken, just slightly uneven — resolves itself if a 6th project gets added.
- **`_projects/Mortality-System/`** has 9 images (`Mortality1.jpeg`...`Mortality9.jpeg`) but the gallery only includes `1,2,3,5,8` — `4,6,9` are unused. Unclear if intentional; worth asking the user.
- **Bigger-picture rework**: user is open to changing the stack entirely in a *future* pass (not now) — see conversation history / memory for context. Don't propose this unprompted; they want the current Jekyll site kept stable for now while they're actively applying to jobs.
- **Custom domain**: user considered buying `eliasprince.com` for ~$0.01 but it turned out to cost more than that at checkout — decided to hold off. Worth revisiting if/when they start writing blog content (mentioned wanting a blog for future VC/founder-adjacent job applications).

## Repo/environment facts worth knowing

- Remote: `https://github.com/EliasPrince/EliasPrince.github.io.git` (case-sensitive canonical form — lowercase redirects but still works).
- `_site/` is now properly gitignored and untracked — never commit it.
- `Gemfile.lock` is gitignored (a past commit deliberately removed it — GitHub Pages manages its own gem resolution; a committed lockfile causes build conflicts).

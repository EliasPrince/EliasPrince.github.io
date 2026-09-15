# Session Notes — 2026-09-14 — About page content + photo

Picked up from the 2026-09-10 index-layout port. All work is pushed and live. Working tree clean.

## What shipped

- **About page bio.** New `about:` value in `_config.yml` (multi-line, rendered via `markdownify`, blank line = paragraph). The hero on Home keeps the short `description:`; About no longer reuses it. Hero description wording tweaked to "subsea hardware" and "design and analysis for naval ships."
- **About page photo.** `about_image:` / `about_image_caption:` in `_config.yml` render a framed, captioned photo beside the bio (`_includes/about.html`). Layout mirrors the hero: `6fr 4fr` grid, 60px gap, `align-items: center`, heading lives inside the text column so heading + paragraphs center as one block. Stacks under 900px. Photo is `assets/images/profile-image/Elias-Field-Testing.jpeg`, a near-square crop from a field-test shot (Tofino BC, Aug 2026 — location not in the caption yet).
- **Skills grid.** Removed the dashed rule under category labels and a stale `.skills-card span { margin-bottom: 0 }` override that was silently zeroing the label margin; labels now have 20px below.
- **CLAUDE.md content rule.** Never write or draft content about Elias without explicit permission — no bios, project bodies, captions, or year/org/role/team values, and no placeholders. He supplies facts/draft; Claude edits and wires in. This was a direct instruction after Claude started drafting a project page unprompted.
- **`PROJECT_NOTES.md`** (repo root, **gitignored + excluded from the Jekyll build**) holds raw source facts for all five projects pulled from Claude chat. Contains internal part numbers, cost targets, and customer names — never commit it. A copy also lives in Claude's memory dir.

## Image handling notes

- iPhone exports may be HEIC data with a `.jpg`/`.jpeg` extension — always `sips -g format` first. Two frames of the same scene had identical byte sizes; don't assume same-size = same-file.
- EXIF orientation: `sips` reports stored pixel dims, not displayed ones. A small Swift/CoreImage script was used to bake orientation and crop in displayed coordinates (lived in the session scratchpad; trivial to rewrite: load via ImageIO, `CIImage.oriented(forExifOrientation:)`, crop, write JPEG).
- Browser cache bit three times because filenames didn't change. Elias declined a cache-busting query on the stylesheet link — just hard-refresh after deploys.

## Open items

- **Project content** is next. Source facts are in `PROJECT_NOTES.md`. Camera (BMC V2) and Navy FEA are well-documented; net pens, mortality system, and power supply enclosure still need year/role/ownership/outcome from Elias. Proposed public exclusions (part numbers, requirement IDs, cost targets, customer + teammate names, competitor note, exact window specs) are awaiting his confirmation.
- Optional caption location for the About photo.
- Elias asked about private repo + public site: GitHub Pro (~$4/mo) is the simple path; two-repo Action or Netlify/Cloudflare are free alternatives. No decision yet.
- Mortality-System gallery still uses only images 1,2,3,5,8 of 9 — unresolved.

---

# Session Notes — 2026-09-10 (evening) — UI review + index layout port

Picked up right after the multi-page IA rework below was committed. User asked for a creative UI review with everything on the table (IA, layout, nav, whether to have project cards at all), approved the direction from a standalone mockup, and had it ported and pushed the same evening. **Live on eliasprince.github.io as of commit `34878b9`.**

## What shipped

- **Project cards are gone.** `/projects/` is now a row index (thumb · year · title + tagline · role/org/team · arrow). Home shows one **lead project** block (`lead: true` in front matter, else the first featured project) plus compact rows for the other featured projects. Both modes come from the same `_includes/projects.html` via `featured_only`.
- **New project page** (`_layouts/post.html`): no outer frame, title, tagline, a **meta strip** that only renders the fields a project has (role / org / year / team), the main image uncropped, `description` as an overview paragraph, then body content, skills tags, prev/next links.
- **`_includes/figure.html`** for captioned images in project bodies: `{% include figure.html src="X.jpeg" caption="..." %}`; wrap two in `<div class="fig-grid">` for a pair. `image-gallery.html` still works for uncaptioned masonry sets (paths now derived from `page.path`, not `page.url`).
- **Clean project URLs**: `/projects/<Folder>/` via per-project `permalink`, with `redirect_from: /projects/<Folder>/index/` so old links keep working (jekyll-redirect-from ships in the github-pages gem; added to `plugins:`).
- **Head/meta**: per-page `<title>`, meta description, inline SVG "EP" favicon. Footer moved inside `<body>`. (Social-preview/Open Graph tags were added then removed at the user's request — he doesn't care about link previews on LinkedIn etc. Don't re-add.)
- **Nav** marks the current page (`aria-current`, hairline underline; Projects button fills when active). Hero "View Projects" now goes to `/projects/`, not the on-page anchor.
- **Footer** = "Get in touch → LinkedIn" + site links + copyright. No email address anywhere on the site, no resume — both explicitly declined again. The Formspree contact form stays on Home only.
- **Hero bio** rewritten in `_config.yml` `description` — first person, general, **no project specifics** (numbers/ARR/team size belong on project pages only). The About page renders the same paragraph. Skills categories reordered so Engineering comes first.
- **Bugs fixed on the way**: template alt text "john doe headshot", `<button>` nested in `<a>`, hero `h3` accidentally going monospace, and the mobile menu showing the desktop links (a specificity bug — `nav .right` beat `.desktop-nav`; now `nav .right.desktop-nav`).

## Taste calls confirmed this session (also in memory — see [[portfolio-design-feedback]])

- Hero photo: **exactly the production size and square framing** — a smaller version and a full-height uncropped version were both rejected. Don't touch it again.
- Index thumbnails: generous (168×118 on `/projects/`, 128×90 in Home rows).
- Tone: inviting/easy-going. No "case study" wording, no figure numbers; project sections should read like "Background / What I did / How it went".
- Project write-ups target **200–500 words + a few captioned pictures**, high-level, not design-review depth.
- Not every project will have every meta field — that's fine; templates render only what exists. User will revisit fields when adding content.

## Open items for next session

- **Content.** This is the main remaining work. Each project still has only the front-matter `description` + an uncaptioned gallery. Plan per project: short body in three sections, 2–4 `figure.html` images with real captions, and fill `year` / `org` / `role` / `team` where they apply. Only the camera project has `year` (2026) so far, so the other four currently sort in reverse alphabetical order at the bottom of the index until years are added.
- **Mortality-System** has 9 images but only `1,2,3,5,8` are used — still unresolved whether that's intentional.
- **Scaling**: user flagged that the site should grow with his career (more projects, possibly an investments list if he moves into VC, possibly writing/Substack). Nothing built for it, but the index row pattern and extra Jekyll collections are the intended path; the "last nav item is a bordered button" CSS will need revisiting when a fourth nav item appears.
- **Stack**: Jekyll is fine for now; Astro would be the move if collections multiply. Content (front matter + markdown + images in folders) is portable either way. Don't propose a migration unprompted.
- Mockups `style-test.html` / `layout-test.html` were deleted after the port; they're in git history if ever needed.

## Verifying layouts locally

Headless Chrome won't go narrower than ~500px, and the Chrome extension's window resize is unreliable in this environment. For a true phone-width check, put the page in a 390px `<iframe>` inside a wide headless screenshot:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --window-size=1440,2400 --screenshot=out.png http://localhost:4321/
```

---

# Session Notes — 2026-09-10

Continuation of the 2026-09-09 visual-direction work below — picked up after the style port was already live. Two separate pieces of work happened this session; read both before continuing.

## Part 1: Project detail page cleanup

Started from "the project pages feel janky." Root-caused and fixed several real bugs, not just taste tweaks:

- **The image gallery's flex-wrap CSS was completely dead** — `_includes/image-gallery.html`'s wrapper `<div>` was missing the `image-gallery` class the CSS targeted, so every project image rendered as its own full-width centered block instead of a grid. Fixed the include, and merged each project's one-include-per-image markdown calls into a single comma-separated call per project.
- Per user feedback, replaced the flex-wrap image row entirely with a **CSS-columns masonry gallery** (native aspect ratios, no cropping, no per-image border) — see [[portfolio-design-feedback]] memory for why (he explicitly prefers no-crop over a more "professional-looking" cropped grid).
- Post title left-aligned and resized to match the rest of the site's type scale (was centered and oversized — a leftover from before the style port). Added a "← All Projects" back-link. Section headings ("Project Overview", "Skills Used") got the same accent-square marker used elsewhere.
- Centered the summary/content column (`max-width: 880px`) so text, tags, and gallery all line up with the hero image width instead of spanning the full wide frame.
- Removed the hairline border on the hero project image; removed the LinkedIn icon badge next to the name in the hero (the separate "LinkedIn ↗" button lower down was kept).
- Site-wide bug fixes found during a broader audit: project card descriptions were clipping mid-character with no ellipsis (invalid `line-clamp: 4px` fighting a conflicting `max-height`); the Contact section was a narrow centered island inconsistent with the left-aligned, full-width Projects/Skills sections.

## Part 2: Multi-page IA rework

User said to ignore the legacy layout and rethink navigation/IA/content structure entirely ("everything is on the table"). Proposed and got sign-off on going multi-page. Shipped:

- **New `/about/` page** — bio (built from `_config.yml`'s `name`/`headline`/`description`) + the full categorized skills grid, moved off the homepage. No resume link — user explicitly deferred that (see [[portfolio-rework-plans]]).
- **Home trimmed** to hero + 3 *featured* projects (not the full catalog, which used to be duplicated verbatim between `/` and `/projects/`) + a "View All Projects →" link + Contact.
- **`/projects/`** is now the sole full catalog page.
- Added a `tagline` front-matter field per project for short card blurbs, so cards no longer show the long paragraph `description` (that's detail-page-only now) — fixes the "run-on text in cards" complaint. Cards also now show only the top 3 skill tags instead of all 5.
- Nav/footer updated to Home / About / Projects everywhere; Projects deliberately kept as the last nav item so it keeps the `nav .right a:last-child` CTA-button styling.
- Contact form is centered within its section while the "Contact" heading stays left-aligned like every other section header — see [[portfolio-design-feedback]] for this pattern (left-aligned headers + marker, centered content is fine).

Full details on the resulting structure and front-matter conventions are in the [[portfolio-ia-and-conventions]] memory — read that before adding new projects or pages rather than re-deriving conventions from the templates.

Committed as `c00d7ae` (Part 1) and `63c422b` (Part 2) on `main` — pushed later on 2026-09-10 along with the index-layout port above.

---

# Session Notes — 2026-09-09

Handoff from a visual-design session, picked up right after the 2026-09-08 cleanup pass below. **No production files changed** — this session was scoped entirely to nailing down a new visual direction before porting it. Read this before picking up the port.

**Update (2026-09-10): the port described below is done.** `css/styles.css`, `_config.yml`'s `colors:` block, and `_layouts/wrapper.html`/`_includes/navbar.html` were all updated to the new direction later on 2026-09-09 (see commits `5c7fa01`, `1f87f02`, `b5d0380`). The 2026-09-10 session above builds on top of that finished port — don't re-port from `style-test.html`.

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

**Updated 2026-09-10 — see the session notes at the top of this file for what's since been resolved.** Remaining/open items, roughly in likely priority order:

- **Add more project content/images** — the original ask, still not done. Current 5 projects each have a tagline + description + top skill tags + photo gallery. They may want *more projects* added (the IA now supports this cleanly — see [[portfolio-ia-and-conventions]]), or more photos per existing project.
- **`_projects/Mortality-System/`** has 9 images (`Mortality1.jpeg`...`Mortality9.jpeg`) but the gallery only includes `1,2,3,5,8` — `4,6,9` are unused. Still unclear if intentional; worth asking the user.
- **Resume** — explicitly deferred again on 2026-09-10 when building the new `/about/` page (user said "skip resume for now"). No PDF in the repo. Add a link there once a current PDF exists — see [[portfolio-ia-and-conventions]] for where the About page content lives.
- **Bigger-picture stack rework**: user is open to changing the stack entirely in a *future* pass (not now) — this is still true even after the 2026-09-10 IA rework, which stayed within Jekyll. Don't propose a framework migration unprompted; see [[portfolio-rework-plans]] memory.
- **Custom domain**: user considered buying `eliasprince.com` for ~$0.01 but it turned out to cost more than that at checkout — decided to hold off. Worth revisiting if/when they start writing blog content (the new IA has room for a future `/writing/` or `/blog/` top-level page).

## Repo/environment facts worth knowing

- Remote: `https://github.com/EliasPrince/EliasPrince.github.io.git` (case-sensitive canonical form — lowercase redirects but still works).
- `_site/` is now properly gitignored and untracked — never commit it.
- `Gemfile.lock` is gitignored (a past commit deliberately removed it — GitHub Pages manages its own gem resolution; a committed lockfile causes build conflicts).

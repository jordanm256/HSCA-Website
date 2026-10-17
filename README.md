# HSCA website

The website for HSCA (Hearth & Spire Construction Architecture), Kampala.
Plain HTML, CSS and JavaScript. No build step, no frameworks: open `index.html`
in a browser and it works.

```
index.html          the page: all fixed text lives here
css/style.css       the look: colours, fonts, spacing (variables at the top)
js/config.js        the behaviour: contact details + every effect setting
js/data.js          the content that grows: projects, concepts, journal notes
js/main.js          draws the cards, menu, title block, enquiry form
js/drafting.js      cursor grid, crosshair, dimension lines, snap points
assets/logo/        HSCA logos and spire mark (SVG, from the brand pack)
assets/icons/       HSCA activity icons (SVG, from the brand pack)
assets/img/         favicon PNGs and the social-sharing image; put photos here
```

---

## Add a project

1. Put the photo in `assets/img/` (WebP or JPG, about 1600 px wide, under 300 KB).
2. Open `js/data.js`, copy one whole `{ ... }` block in `projects`, paste it at
   the top of the list and put a comma after it.
3. Fill in the fields. Set `image: "assets/img/your-photo.webp"` and describe
   the photo in `imageAlt`.

Sheet numbers (A-402, A-403 ...), the "next sheet" tile and the type filters
(shown once you have 6 or more projects) all update by themselves.
Concepts and journal notes work the same way in the same file.
Set `featured: true` on one project to make its card two columns wide.

## Change colours and fonts

Open `css/style.css`. Everything is in the `:root` block at the top.

- **Brand colours** (`--brand-...`) are the guideline values. Leave them.
- **Paper print** (light) uses the tokens directly under them: `--bg`, `--ink`,
  `--text`, `--line`, `--warm` and so on.
- **Blueprint print** (dark) repeats the same tokens twice further down
  (once for "follow my device", once for the Print switch). Change both.
- **Fonts** are `--font-display`, `--font-body`, `--font-mono`. The Google Fonts
  link that loads them is in the `<head>` of `index.html`.
- **Spacing**: `--gutter` (page edges), `--sheet-pad` (space between sections),
  `--gap` (space between cards).

## Edit text

Fixed text (headlines, services, process, about, contact) is in `index.html`.
Each section is marked with a comment like `A-201 SERVICES`. Change the words
between the tags, nothing else. Projects, concepts and journal notes are in
`js/data.js`.

## Adjust or switch off the effects

Open `js/config.js`.

- Everything off: `effects.enabled: false`
- One thing off: set `intro`, `cursorGrid`, `crosshair`, `coordinates`,
  `dimensionLines`, `snapPoints`, `hideNativeCursor` or `touchMarks` to `false`
- Grid: `grid.size`, `grid.radius`, `grid.restDelay`, `grid.strength`
- Snapping: `snap.radius` (how close before the cursor jumps to a corner)
- Intro length: `--intro-ms` in `css/style.css`

To add the effects to a new element, give it `data-dim` (dimension lines on
hover) and/or `data-snap` (corner markers).

Effects never run on touch screens (phones get a survey mark where you tap
instead) or for visitors who have "reduce motion" switched on. If the
JavaScript fails to load, the site is still complete and usable.

## Deploy for free

**Netlify (easiest):** go to app.netlify.com/drop and drag the whole `hsca`
folder onto the page. You get a live link in a few seconds. Add your domain
under *Domain settings*.

**GitHub Pages:** create a repository, upload the folder contents, then
*Settings → Pages → Deploy from branch → main / root*.

**Vercel:** *Add New → Project*, import the folder or repository, framework
preset "Other", no build command.

After deploying, replace `https://hsca.studio/` in the Open Graph tags at the
top of `index.html` and in `sitemap.xml` with your real address.

### The enquiry form

There is no server, so the form writes the enquiry out and opens it in the
visitor's WhatsApp or email app; they press send there. If you would rather
receive form submissions in an inbox, sign up for Formspree (free tier) or
Netlify Forms and point the form at it.

## Placeholders to replace

Search the files for `PLACEHOLDER`. They show on the site as yellow "hold"
notes so nothing is missed.

| Where | What |
|---|---|
| `js/data.js` → projects | neighbourhood, year, description and photo for each of the 3 projects (or delete ones that are not real yet) |
| `js/data.js` → concepts | title, site, year, design question, description, drawing/render |
| `index.html` → A-301 Process | warranty terms |
| `index.html` → A-601 Practice | both founder names and portraits |
| `index.html` → A-901 Enquiry | studio address |
| `js/data.js` → journal | the three notes are drafts in your voice; edit or replace, then remove the "Preliminary" stamp |
| `index.html` → `<head>` | real domain in `og:url` and `og:image` |

## Fonts

Your brand pack uses **Gotham** and **Gotham Narrow**. The files supplied are
desktop fonts; Gotham's licence does not allow putting desktop files on a
website, so the site uses close open-licence stand-ins from Google Fonts:

- Gotham Narrow → **Encode Sans Semi Condensed** (headings)
- Gotham → **Montserrat** (body text)
- **IBM Plex Mono** for drawing labels (sheet numbers, dimensions)

If you buy a Gotham **webfont** licence from Hoefler&Co / Monotype, put the
`.woff2` files in `assets/fonts/` and uncomment the `@font-face` block near the
top of `css/style.css`. Gotham is already first in the font lists, so it takes
over automatically.

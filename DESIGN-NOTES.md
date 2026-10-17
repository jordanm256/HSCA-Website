# Design decisions

**The site is a drawing set.** Every section is a numbered sheet (A-000 Cover to
A-901 Enquiry) with its own scale. A title block on the right edge tracks the
sheet you are on, its scale, and how far through the set you are; on phones it
becomes a small chip at the bottom. The footer's site map is a drawing register.
This structure makes a small portfolio read as deliberate: three projects fill
a register that is clearly built to grow.

**Two prints of one set.** Paper (light, a cool drafting-film white) and
Blueprint (dark, on Blue Metal). The site follows the visitor's device setting;
the *Print* switch in the title block overrides it. Concepts and the footer are
always blueprint, so unbuilt work sits on a visibly different sheet.

**Brand colours used in the guideline proportions.** Blue Metal carries the
text and large grounds, Blue Board is reserved for linework and dimensions,
Reflector Yellow is the "hearth": calls to action, the active step, snap points.
Grey Concrete and Grey Granite are not used as fills; the neutrals are tinted
toward the navy instead so the page stays in one family.

**Hearth and spire, quietly.** A shallow chevron (the hearth base) sits under
every sheet title; the scroll meter in the title block has a spire tip that
rises as you read; on hover the crosshair grows a small yellow spire over
anything clickable; a spire stands on the datum line that closes the Approach sheet.

**Headline.** "Most renovations start with a hammer. Ours start with a
drawing." It states the difference (design before demolition) in the client's
terms, without claims we cannot back up.

**Placeholders as "holds".** Missing facts are shown the way drawings mark
information still awaited: a yellow hold note with the literal
`[PLACEHOLDER: ...]` text. Projects without photos show their plan linework
instead of an empty grey box, so the page looks finished before the photos
exist. The last tile in the register is an open "next sheet" that invites an
enquiry.

**Honest content.** No invented clients, testimonials, numbers or awards. The
three project entries are templates for real jobs. New builds, tenders and the
workshop are presented as what they are: in preparation.

**Measurements are real arithmetic.** Coordinates and dimension strings convert
screen pixels to millimetres on paper (1 px = 0.2646 mm) and multiply by the
current sheet's scale, so the numbers change as you move between 1:20, 1:50,
1:100 and 1:200 sheets.

**Enquiry without a server.** The form validates, then opens WhatsApp or email
with the message already written. It works on any free host and never loses an
enquiry to a broken backend. WhatsApp is also one tap away on every screen.

**Performance.** No frameworks, no images above the fold except SVG. All effects
run on one canvas and the animation loop sleeps when the cursor is still.

## Brand files used

- Logo files (SVG, RGB): primary logo on light (blue mark + navy wordmark),
  primary logo on dark (blue mark + white wordmark), logo mark in blue, white,
  navy and yellow. Used unaltered: header, footer, intro, title block, favicon.
- Activity icon set (SVG): design, renovation, construction, maintenance,
  handover. Used in Services and Process in their guideline colours (navy body,
  Blue Board baseline; white body in blueprint print).
- Style guidelines PDF: palette, typography hierarchy (uppercase Gotham Narrow
  Medium headings, Gotham Narrow Light for large text, Gotham Book body),
  herringbone and tile patterns (redrawn in CSS behind the Kitchens and
  Bathrooms cards), blueprint illustration style (informs the plan drawings).

## Not used, and why

- **Gotham / Gotham Narrow font files.** Desktop licences do not cover web
  embedding. Replaced with Encode Sans Semi Condensed, Montserrat and IBM Plex
  Mono (all open licence). A ready slot for licensed Gotham webfonts is in
  `css/style.css`.
- **Secondary (stacked) logo, agency-name lockup, outline and emblem.** The
  horizontal primary logo fits every slot on the site; the outline and emblem
  are informal marks meant for merchandise, so they were left out to keep the
  logo use clean.
- **CMYK, PDF and Illustrator files.** Print formats; the RGB SVGs cover the web.
- **Core values and construction icon sets.** The values are written out in the
  Practice section; adding more icons would have crowded the drawings.
- **Brand visuals (hard hat, tape, tape-measure mockups).** Stock photography
  with the logo applied; not real HSCA work, so not shown as if it were.
- **Invoices, quotations and service agreements** in the Drive folder were not
  opened beyond their names; they are client documents, not brand material.

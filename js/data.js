/* ==========================================================================
   HSCA — SITE CONTENT DATA
   --------------------------------------------------------------------------
   Everything that changes often lives here: built projects, design concepts
   and journal notes. The page reads this file and draws the cards for you.

   HOW TO ADD A PROJECT
   1. Copy one whole { ... } block inside `projects` below.
   2. Paste it at the TOP of the list (newest first) and add a comma after it.
   3. Change the text. Put your photo in /assets/img/ and set `image`.
   That's it. Sheet numbers (A-401, A-402 ...) are given automatically.

   PLACEHOLDERS
   Any text that starts with "[PLACEHOLDER" is shown on the site as a
   "hold" note (the way drawings mark information that is still awaited).
   Replace them with real content when you have it.

   FIELDS
   title     Name of the job, e.g. "Kitchen, Ntinda"
   type      One of: "Kitchen" | "Bathroom" | "Kitchen + bathroom" | "Interior" | "New build"
   place     Neighbourhood or town
   year      Year completed
   status    "Completed" | "On site" | "Design stage"
   summary   2–3 sentences: the brief, what changed, what it was built from
   scope     Short list of what HSCA did
   image     Path to a photo, e.g. "assets/img/ntinda-kitchen.webp" ("" = none yet)
   imageAlt  Describe the photo for people using screen readers
   plan      Line drawing shown over the card: "kitchen" | "bathroom" | "house" | "section"
   featured  true = card spans two columns (use for one or two projects only)
   ========================================================================== */

window.HSCA_DATA = {

  /* ---------------------------------------------------------------- BUILT WORK */
  projects: [
    {
      title: "Kitchen renovation",
      type: "Kitchen",
      place: "[PLACEHOLDER: neighbourhood, Kampala]",
      year: "[PLACEHOLDER: year]",
      status: "Completed",
      summary: "[PLACEHOLDER: 2–3 sentences. What the client asked for, what we changed in the layout, and the main materials.]",
      scope: ["Measured survey", "Layout redesign", "Joinery", "Plumbing + electrics", "Finishes"],
      image: "",
      imageAlt: "[PLACEHOLDER: describe the photo]",
      plan: "kitchen",
      featured: true
    },
    {
      title: "Bathroom renovation",
      type: "Bathroom",
      place: "[PLACEHOLDER: neighbourhood, Kampala]",
      year: "[PLACEHOLDER: year]",
      status: "Completed",
      summary: "[PLACEHOLDER: 2–3 sentences. The problem with the old room, the new layout, waterproofing and finishes.]",
      scope: ["Measured survey", "Wet-room layout", "Tiling", "Sanitary ware"],
      image: "",
      imageAlt: "[PLACEHOLDER: describe the photo]",
      plan: "bathroom",
      featured: false
    },
    {
      title: "Kitchen + bathroom",
      type: "Kitchen + bathroom",
      place: "[PLACEHOLDER: neighbourhood, Kampala]",
      year: "[PLACEHOLDER: year]",
      status: "On site",
      summary: "[PLACEHOLDER: 2–3 sentences about the job. Leave status as \"On site\" until handover.]",
      scope: ["Design", "Costing", "Build"],
      image: "",
      imageAlt: "[PLACEHOLDER: describe the photo]",
      plan: "section",
      featured: false
    }
  ],

  /* ------------------------------------------------- ORIGINAL DESIGN CONCEPTS
     Unbuilt and speculative work. Shown on a separate blueprint sheet and
     always labelled "Concept" so nobody mistakes it for a finished building.
     Extra field:
     question  The design question the concept explores (one sentence)      */
  concepts: [
    {
      title: "[PLACEHOLDER: concept title]",
      type: "Residential concept",
      place: "[PLACEHOLDER: site or city]",
      year: "[PLACEHOLDER: year]",
      question: "[PLACEHOLDER: the question this design asks, e.g. how a house on a steep Kampala plot could step with the slope instead of cutting into it.]",
      summary: "[PLACEHOLDER: 2–3 sentences on the idea, the site and the materials.]",
      image: "",
      imageAlt: "[PLACEHOLDER: describe the drawing or render]",
      plan: "house"
    },
    {
      title: "[PLACEHOLDER: concept title]",
      type: "Competition entry",
      place: "[PLACEHOLDER: site or city]",
      year: "[PLACEHOLDER: year]",
      question: "[PLACEHOLDER: the question this design asks.]",
      summary: "[PLACEHOLDER: 2–3 sentences on the brief, the idea and where it was submitted.]",
      image: "",
      imageAlt: "[PLACEHOLDER: describe the drawing or render]",
      plan: "section"
    }
  ],

  /* ---------------------------------------------------------------- JOURNAL
     Short notes on design thinking. `body` is a list of paragraphs.
     status "Preliminary" shows a small stamp; change to "" to remove it.   */
  journal: [
    {
      title: "Why we draw a kitchen at 1:20",
      date: "2026-10-01",
      tag: "Method",
      status: "Preliminary",
      body: [
        "A kitchen is mostly small decisions: how far the hob sits from the window, whether the fridge door clears the counter, where the gas cylinder lives. At 1:100 these decisions disappear. At 1:20 they are visible, and they get made on paper instead of on site.",
        "Every kitchen we design gets a plan and elevations at 1:20. It takes longer, and it saves the most expensive kind of change: the one made after the tiles are on the wall."
      ]
    },
    {
      title: "Start with the wet wall",
      date: "2026-09-15",
      tag: "Bathrooms",
      status: "Preliminary",
      body: [
        "In most Kampala renovations the cheapest bathroom is the one that keeps its drains where they are. Moving a WC can mean breaking a slab; moving a basin usually does not.",
        "So we draw the existing plumbing first, mark what can move freely and what cannot, and design the room around the wall that carries the water. Good layouts often come from that constraint."
      ]
    },
    {
      title: "Two rainy seasons",
      date: "2026-09-02",
      tag: "Climate",
      status: "Preliminary",
      body: [
        "Kampala gets two rainy seasons a year and a lot of red dust in between. Both reach inside the house. A finish that looks right in a showroom can stain, swell or mould within a year here.",
        "We choose materials for the room they will actually live in: sealed timber near water, tiles that hide dust in the joints, ventilation that works when the windows are shut against the rain."
      ]
    }
  ]
};

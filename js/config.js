/* ==========================================================================
   HSCA — SITE SETTINGS (one place to tweak behaviour)
   --------------------------------------------------------------------------
   Colours, fonts and spacing live at the top of css/style.css.
   Everything that MOVES or REACTS lives here.

   To switch ALL drawing effects off:   effects.enabled: false
   To switch off just one:              set its line below to false
   Effects are always off on touch screens and for visitors who have
   "reduce motion" turned on in their device settings.
   ========================================================================== */

window.HSCA_CONFIG = {

  /* Contact details used by buttons, links and the enquiry form */
  contact: {
    whatsapp: "256700790451",          // international format, no + or spaces
    phoneDisplay: "+256 700 790 451",
    email: "karibu@hsca.studio",
    instagram: "hscauganda",
    tiktok: "hscauganda"
  },

  effects: {
    enabled: true,          // master switch for every effect below
    intro: true,            // short line-drawing intro on first visit
    cursorGrid: true,       // fine grid that fades in around the cursor
    crosshair: true,        // drafting crosshair that follows the cursor
    coordinates: true,      // live X / Y label next to the crosshair
    dimensionLines: true,   // dimension strings around hovered images, cards and headings
    snapPoints: true,       // corner markers + cursor snapping
    hideNativeCursor: true, // hide the normal arrow while the crosshair is active
    touchMarks: true        // on phones: a survey mark with coordinates where you tap
  },

  grid: {
    size: 24,               // px between grid lines
    majorEvery: 5,          // every Nth line is slightly stronger
    radius: 220,            // px radius of the grid around the cursor
    restDelay: 900,         // ms of stillness before the grid fades away
    fadeIn: 0.14,           // 0–1, higher = faster fade in
    fadeOut: 0.06,          // 0–1, higher = faster fade out
    strength: 0.55          // overall grid opacity (0–1)
  },

  snap: {
    radius: 18,             // px: how close the cursor must be to a corner to snap
    showWithin: 170         // px: corner markers appear on elements this close
  },

  dimensions: {
    offset: 16,             // px gap between element and dimension line
    drawSpeed: 0.12,        // 0–1, how fast the line draws in
    pxToMm: 0.2646          // 1 CSS px = 0.2646 mm on paper; multiplied by sheet scale
  },

  intro: {
    oncePerSession: true    // only show the intro on the first page view of a visit
  },

  projects: {
    filterFrom: 6           // show type filters once there are this many projects
  }
};

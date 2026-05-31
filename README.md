# VanaHerbs Website

Premium herb import/export business website — Uttarakhand, India.

---

## Project Structure

```
vanaherbs/
├── index.html              # Main HTML — semantic markup only
├── css/
│   ├── reset.css           # Browser normalisation
│   ├── variables.css       # Design tokens (colours, spacing, typography)
│   ├── base.css            # Body, typography, layout utilities
│   ├── components.css      # Reusable UI components (buttons, nav, cards, footer…)
│   ├── sections.css        # Section-specific layouts (hero, about, products…)
│   ├── animations.css      # Keyframes & scroll-reveal classes
│   └── responsive.css      # Breakpoint overrides (≤1024, ≤900, ≤600, ≤400)
├── js/
│   ├── cursor.js           # Custom cursor tracking & hover states
│   ├── nav.js              # Sticky nav + mobile hamburger menu
│   ├── hero.js             # Auto-rotating image carousel
│   ├── animations.js       # Scroll-triggered IntersectionObserver reveals
│   ├── counters.js         # Animated number counters
│   ├── parallax.js         # Parallax scroll on landscape band
│   └── form.js             # Form validation & submission handling
└── assets/
    └── images/             # Place local images here (optional)
```

---

## Customisation Checklist

Before going live, update these placeholders:

| Item | File | What to change |
|---|---|---|
| Business name | `index.html` | Replace all `VanaHerbs` / `Vana` occurrences |
| WhatsApp number | `index.html`, `js/form.js` | Replace `919800000000` with real number |
| Email address | `index.html` | Replace `contact@vanaherbs.in` |
| Phone number | `index.html` | Replace `+91 98XXX XXXXX` |
| Address | `index.html` | Update city/state if needed |
| Est. year | `index.html` | Update `Est. 2022` in hero eyebrow |
| Copyright year | `index.html` | Update footer copyright |

---

## Deployment

### Netlify (free, fastest)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `vanaherbs/` folder onto the page
3. Done — live URL in seconds

### GitHub Pages (free)
1. Push the folder contents to a GitHub repository
2. Go to Settings → Pages → Deploy from branch (main / root)
3. Access at `https://yourusername.github.io/vanaherbs`

### cPanel / Shared Hosting
Upload all files via FTP to `public_html/` and the site is live.

---

## Tech Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — custom properties, Grid, Flexbox, no frameworks
- **Vanilla JS** — no libraries, no build tools required
- **Fonts** — Cormorant Garamond (display) + DM Sans (body) via Google Fonts
- **Images** — Unsplash (free, production-safe)

---

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

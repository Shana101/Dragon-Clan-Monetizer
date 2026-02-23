# Favicon & OpenGraph Image Setup Guide

## Overview

This document describes how to replace the favicon and OpenGraph (social sharing) assets for Heidi Studio.

---

## 1. Favicon

**Current state:** The app references `/favicon.png` from `client/public/`.

**To replace:**

1. Prepare your favicon image as a `.png` file.
2. Replace the file at:
   ```
   client/public/favicon.png
   ```
3. No code changes are needed — `client/index.html` already references this path:
   ```html
   <link rel="icon" type="image/png" href="/favicon.png" />
   ```

**Recommended specs:**
- Format: PNG
- Size: 32×32 or 48×48 pixels (standard), optionally include 16×16 and 192×192 for broader device support
- Transparent background if applicable

---

## 2. OpenGraph Image (Social Sharing Preview)

**Current state:** The `og:image` and `twitter:image` meta tags in `client/index.html` currently point to a Replit placeholder URL. A Vite plugin (`vite-plugin-meta-images.ts`) automatically rewrites these URLs at build time to use the correct deployment domain.

**To replace:**

1. Prepare your OpenGraph image.
2. Save it to the `client/public/` directory with one of these exact filenames:
   - `opengraph.png` (preferred)
   - `opengraph.jpg`
   - `opengraph.jpeg`
3. The Vite plugin will automatically detect the file and rewrite the meta tag URLs to:
   ```
   https://{deployment-domain}/opengraph.{ext}
   ```

**No manual URL changes are needed** — the plugin handles it.

**You only need one image at one size.** Unlike favicons, there is no multi-resolution requirement for OpenGraph images. A single 1200×630 image works universally across all platforms.

**Directory:** `client/public/` — the image is served from the site root (e.g., `https://yourdomain.com/opengraph.png`).

**Recommended specs:**
- Format: PNG or JPG
- Size: **1200×630 pixels** — this is the universal standard that works across Facebook, LinkedIn, Twitter/X, Discord, Slack, iMessage link previews, and others
- File size: under 1 MB for fast loading
- Only one image file is needed

---

## 3. OpenGraph Title & Description

These are **hardcoded** in `client/index.html` (lines 7–15) and must be edited manually.

**Current values:**
```html
<meta property="og:title" content="Heidi Studio" />
<meta property="og:description" content="A creator studio with dashboards, recording, teleprompter, editing, highlights, and publishing workflows—powered by Heidi." />
<meta name="twitter:title" content="Heidi Studio" />
<meta name="twitter:description" content="A creator studio with dashboards, recording, teleprompter, editing, highlights, and publishing workflows—powered by Heidi." />
```

**To update:**

Edit `client/index.html` and replace the `content` values for all four tags above with your desired title and description. Keep the `og:` and `twitter:` versions in sync.

---

## File Reference

| File | Purpose |
|---|---|
| `client/index.html` | Contains favicon link, OG meta tags, Twitter Card meta tags |
| `client/public/favicon.png` | Favicon image file (replace this) |
| `client/public/opengraph.png` | OG image file (add/replace this) |
| `vite-plugin-meta-images.ts` | Vite plugin that auto-rewrites OG image URLs at build time |

---

## Checklist

- [ ] Replace `client/public/favicon.png` with branded favicon
- [ ] Add `client/public/opengraph.png` (1200×630) with branded social image
- [ ] Update `og:title` and `twitter:title` in `client/index.html`
- [ ] Update `og:description` and `twitter:description` in `client/index.html`
- [ ] Test by deploying and pasting the URL into [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or [Twitter Card Validator](https://cards-dev.twitter.com/validator)

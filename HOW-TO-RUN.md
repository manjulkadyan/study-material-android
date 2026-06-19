# Android Interview Study Guide — Website

A self-contained static site. **No build step, no internet, no dependencies** — just HTML + one CSS file, all links relative. Works on a Mac, on localhost, and copied onto an iPad.

```
site/
├── index.html                 ← multi-page site landing (topic cards) — Mac/localhost
├── OFFLINE-single-file.html   ← EVERYTHING in one file — best for iPad / no-server
├── style.css
├── site.js                    ← keyboard nav + sidebar scrollspy (client-side only)
├── serve.sh                   ← one-command local server (Mac/Linux)
└── topics/                    ← 17 topic pages (one per section)
```

Navigation:
- **Persistent left sidebar** — every topic is listed; click a topic to expand it and see its **subtopics** (4.1, 4.2, …). Only topics + subtopics appear here (no deeper levels), so the list stays scannable. The current topic stays expanded and highlighted, and the sidebar auto-highlights the subtopic you're reading as you scroll.
- **Deeper navigation (sub-sub topics)** — each topic page has its own **Table of Contents** at the top; every entry (and every in-page cross-reference) is a clickable link that jumps you straight to that heading.
- **Move between topics** — the floating **‹ ›** arrows on the left/right edges, the **Previous / Next** buttons at the bottom, or just your keyboard's **← / →** arrow keys.
- **Mobile / narrow screens** — the sidebar collapses; tap **☰** in the top bar to open it.
- Everything is client-side (no server calls), so it all works from `file://` too.

---

## Run on a Mac / PC

**Easiest — just open the file:**
Double-click `index.html`. It opens in your browser and everything works offline (all links are relative).

**As a localhost server (nicer URLs, closer to "real" hosting):**
```bash
cd site
./serve.sh          # or: python3 -m http.server 8000
```
Then open **http://localhost:8000** in your browser. Stop with `Ctrl+C`.

---

## Use it on an iPad

⚠️ **Why the multi-file site looks broken on iPad:** tapping a file in the **Files** app opens Apple's *Quick Look* preview, not a browser — and iOS Safari **cannot open local `file://` pages at all**. Quick Look won't reliably follow links between files or load a separate `style.css`/`site.js`. So the multi-page `site/` folder needs a real browser/server on iPad. Pick one:

**Option A — One file, just tap it (EASIEST, no extra app, no server) ✅**
Use **`OFFLINE-single-file.html`** — the entire guide (all 17 topics + CSS + JS) is baked into **one** file, so there's nothing external for Quick Look to fetch.
1. Copy just `OFFLINE-single-file.html` to the iPad (AirDrop / iCloud Drive / email).
2. Tap it in the **Files** app. It renders fully offline: sidebar (tap a topic to expand its subtopics), per-topic Tables of Contents, prev/next links, and ←/→ keyboard nav if you have a keyboard. All navigation is in-page, so nothing breaks.

**Option B — Run a real localhost server on the iPad (full multi-page experience)**
1. Install **a-Shell** (free, App Store) — it bundles Python.
2. Move the `site` folder where a-Shell can see it (its Documents, or link via Files).
3. In a-Shell: `cd site` then `python3 -m http.server 8000`.
4. Open **http://localhost:8000** in Safari. Leave a-Shell running while you read.

**Option C — Documents by Readdle (multi-page, no server)**
1. Install **Documents by Readdle** (free) — its built-in browser follows relative links/CSS, which the bare Files preview does not.
2. Copy the `site` folder in, tap `index.html` → opens in the in-app browser; all links/CSS/TOCs work offline.

> TL;DR for iPad: **just use `OFFLINE-single-file.html` (Option A).** Options B/C are only if you specifically want the multi-page layout.

---

## Regenerating

The site is generated from the section `.md` files by `../_build_combined.py`:
```bash
cd ..            # the study/ folder
python3 _build_combined.py
```
This rebuilds the combined doc, the per-topic tab files, **and** this `site/`.

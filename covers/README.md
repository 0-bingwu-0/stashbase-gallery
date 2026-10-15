# Gallery Covers

Every cover shares one 16:9 layout: a tone with paper grain and one large glyph that names what the project is for, its outline in the tone's deep colour and its body cut from white paper. The cover carries nothing else: no text, no project name (the app prints it beside the cover), no logo. Pick a glyph whose shape differs from the others, so four covers side by side tell apart at card size.

* `cover.css`: the shared layout and tones (`green`, `blue`, `clay`, `violet`). The tones share one lightness, with hues far enough apart to tell cards apart at a glance.
* `<id>.html`: one file per project. Set the tone with the class on `<body>`, and paste the glyph's [lucide](https://lucide.dev) paths into `svg.glyph`; mark the shapes to fill white with `class="body"`.

Render at 1600 × 900 with headless Chrome, then save it as `wikis/<id>/screenshots/cover.jpg`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --hide-scrollbars --force-device-scale-factor=1 --window-size=1600,900 --virtual-time-budget=3000 --screenshot=cover.png "file://$PWD/covers/<id>.html"
sips -s format jpeg -s formatOptions 90 cover.png --out wikis/<id>/screenshots/cover.jpg
```

| Project | Tone and glyph |
| --- | --- |
| resume-builder | green, `file-user` |
| linkedin-ghostwriter | blue, `feather` |
| x-content-starter | clay, `megaphone` |
| paper-tracker-for-industry | violet, `funnel` |

# Gallery Covers

Every cover shares one 16:9 layout: a tone with paper grain and one thing the project makes, in that thing's own form, lifted off the tone. The forms differ in shape (a resume page, a post with a picture, a dark post on X, a digest drawn as 337 dots with 5 picked), so four covers side by side tell apart at card size. Only one line on each is large enough to read there; the rest is texture. The cover carries no project name (the app prints it beside the cover), no logo, and no chat bubbles. Use real content from the project.

* `cover.css`: the shared tones (`green`, `blue`, `clay`, `violet`), grain, and the lifted `.thing`. The tones share one lightness, with hues far enough apart to tell cards apart at a glance.
* `<id>.html`: one file per project. Set the tone with the class on `<body>`, and draw the thing in `.thing` with its own styles.
* `fonts/`: Newsreader and Space Grotesk, the same as stashbase.ai.

Render at 1600 × 900 with headless Chrome, then save it as `wikis/<id>/screenshots/cover.jpg`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --hide-scrollbars --force-device-scale-factor=1 --window-size=1600,900 --virtual-time-budget=3000 --screenshot=cover.png "file://$PWD/covers/<id>.html"
sips -s format jpeg -s formatOptions 90 cover.png --out wikis/<id>/screenshots/cover.jpg
```

| Project | Tone and thing |
| --- | --- |
| resume-builder | green, resume page |
| linkedin-ghostwriter | blue, LinkedIn post |
| x-content-starter | clay, post on X |
| paper-tracker-for-industry | violet, weekly digest |
| llm-wiki-for-papers | green, map of papers and how they connect |
| poc-deck-builder | blue, results slide with each success criterion against its target |

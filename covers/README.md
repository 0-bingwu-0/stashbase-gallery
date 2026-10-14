# Gallery Covers

Every cover shares one layout: a macaron background with paper grain, a serif title with an italic second line, and the project's own output on a white page. Each project gets its own color.

* `cover.css`: the shared layout and the colors (`mint`, `pink`, `butter`, `lavender`, `peach`, `sky`).
* `<id>.html`: one file per project. Set the color with the class on `<body>`, and put the project's visual in `.sheet`.
* `fonts/`: Newsreader and Space Grotesk, the same as stashbase.ai.

Render at 1600 × 900 with headless Chrome, then save it as `wikis/<id>/screenshots/cover.jpg`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --hide-scrollbars --force-device-scale-factor=1 --window-size=1600,900 --virtual-time-budget=3000 --screenshot=cover.png "file://$PWD/covers/<id>.html"
```

| Project | Color |
| --- | --- |
| resume-builder | mint |
| linkedin-ghostwriter | sky |
| x-content-starter | pink |
| paper-tracker-for-industry | lavender |

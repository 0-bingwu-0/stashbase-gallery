# StashBase Gallery

The curated gallery behind **Explore the Gallery** in [StashBase](https://stashbase.ai):
ready-made Wikis and project templates you can download and use right away, starter prompts included,
and ready-made personas for the Agent.
This repository **is** the backend — a static index consumed by the app and the
website, updated by pull request, no server anywhere.

## How it works

Everything lives in [`gallery.json`](./gallery.json). Each entry points at a
public git repository where the whole project lives in the files — clone it,
disconnect, and it still works. `starterPrompts` are questions worth asking the
moment the folder is open in StashBase.

Consumers fetch the index at runtime and fall back to a bundled snapshot when
offline:

```
https://assets.stashbase.ai/gallery.json
```

(An R2 bucket behind Cloudflare on our own domain — reliable in regions where
GitHub endpoints are not. The `publish.yml` Action uploads `gallery.json` and
the screenshot assets on every push to `main`; the index is short-cached, so
an edit is live within minutes of merging.)

## Schema

`schemaVersion` is bumped only on breaking changes; consumers must ignore
fields they do not recognize. Version 2 uses a single `screenshot` string instead
of the `screenshots` array. Entries appear in the order listed in `wikis`.

| Field | Meaning |
| --- | --- |
| `id` | Stable slug, never reused |
| `name` | Display name |
| `category` | One word: `course`, `research`, `reference`, … |
| `description` | One sentence — source, then what's inside |
| `about` | The introduction on the entry page, in the publisher's own words: why the wiki was made, what it holds, who it is for. Plain text, a blank line between paragraphs, up to 8,000 characters |
| `contents` | Short inventory line |
| `repo` / `clone` | Where the Wiki lives, and the exact command to fetch it |
| `learnMore` | Optional deep-dive page |
| `starterPrompts` | Questions to paste into the chat box as-is |
| `screenshot` | One cover image path or published URL per project |

### Personas

`personas` lists ready-made personas a reader can add to their own library in
StashBase. Adding takes a copy, so a later change here never reaches a persona
someone already added. Every sample answers the same request, so readers can
compare voices side by side.

| Field | Meaning |
| --- | --- |
| `id` | Stable lowercase slug (`a-z`, `0-9`, `-`), never reused |
| `name` | Display name |
| `category` | One word: `news`, `fiction`, `docs`, … |
| `description` | One line under the name |
| `icon` | Optional icon name from the app's set (`feather`, `newspaper`, …); others read as the default |
| `prompt` | The exact text the Agent receives, up to 32,000 characters |
| `sample` | Optional `{ request, reply }`: a real exchange under this persona |

## Contributing

Open a pull request that adds one entry to `gallery.json`. The bar matches the
[selection criteria](https://stashbase.ai/blog/github-knowledge-bases/#how-we-picked)
used across StashBase: the knowledge must live **in** the repository, serve an
identifiable reader, and stay useful with the network off.

## License

Apache-2.0

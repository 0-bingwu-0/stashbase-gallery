# StashBase Gallery

The curated gallery behind **Explore the Gallery** in [StashBase](https://stashbase.ai):
ready-made Wikis you can download and use right away, starter prompts included.
This repository **is** the backend — a static index consumed by the app and the
website, updated by pull request, no server anywhere.

## How it works

Everything lives in [`gallery.json`](./gallery.json). Each entry points at a
public git repository where the whole Wiki lives in the files — clone it,
disconnect, and it still works. `starterPrompts` are questions worth asking the
moment the folder is open in StashBase.

Consumers fetch the index at runtime and fall back to a bundled snapshot when
offline:

```
https://cdn.jsdelivr.net/gh/0-bingwu-0/stashbase-gallery@main/gallery.json
```

(jsDelivr rather than raw.githubusercontent.com so the index also resolves in
regions where GitHub raw endpoints are unreliable.) jsDelivr caches `@main`
for up to 12 hours; to make an edit visible immediately, hit

```
https://purge.jsdelivr.net/gh/0-bingwu-0/stashbase-gallery@main/gallery.json
```

## Schema

`schemaVersion` is bumped only on breaking changes; consumers must ignore
fields they do not recognize.

| Field | Meaning |
| --- | --- |
| `id` | Stable slug, never reused |
| `name` | Display name |
| `category` | One word: `course`, `research`, `reference`, … |
| `description` | One sentence — source, then what's inside |
| `contents` | Short inventory line shown on the card |
| `repo` / `clone` | Where the Wiki lives, and the exact command to fetch it |
| `learnMore` | Optional deep-dive page |
| `starterPrompts` | Questions to paste into the chat box as-is |

## Contributing

Open a pull request that adds one entry to `gallery.json`. The bar matches the
[selection criteria](https://stashbase.ai/github-knowledge-bases/#how-we-picked)
used across StashBase: the knowledge must live **in** the repository, serve an
identifiable reader, and stay useful with the network off.

## License

Apache-2.0

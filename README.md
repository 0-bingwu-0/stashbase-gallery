# StashBase Gallery

The curated gallery behind **Explore the Gallery** in [StashBase](https://stashbase.ai):
ready-made Wikis and project templates you can download and use right away, and ready-made personas for the Agent.
This repository **is** the backend — a static index consumed by the app and the
website, updated by pull request, no server anywhere.

## How it works

Everything lives in [`gallery.json`](./gallery.json). Each entry points at a
public git repository where the whole project lives in the files — clone it,
disconnect, and it still works. Each entry shows its cover and introduction before a reader opens or copies it.

The app fetches the index at runtime. The website reads it at build time, so
website changes need a rebuild and deployment. Both keep a bundled fallback:

```
https://assets.stashbase.ai/gallery.json
```

(An R2 bucket behind Cloudflare on our own domain — reliable in regions where
GitHub endpoints are not. The `publish.yml` Action uploads `gallery.json` and
the screenshot assets on every push to `main`; the index is short-cached, so
an edit is live within minutes of merging.)

## Schema

Entries appear in the order listed in `wikis`. Each project has one cover and an introduction. Consumers validate the fields they use and ignore unknown fields.

| Field | Meaning |
| --- | --- |
| `id` | Stable slug, never reused |
| `name` | Display name |
| `category` | One word: `template`, `course`, `research`, `reference`, … |
| `description` | One sentence under the project name, led by the reader’s goal or benefit rather than a feature list |
| `about` | Purpose, intended audience, and what readers can do. Plain text with a blank line between paragraphs; keep setup requirements, costs, and limitations in the project README |
| `repo` | Public GitHub repository to copy |
| `screenshot` | One cover image path or published URL |

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

#!/usr/bin/env node
/**
 * Gallery publish tool — content-hash the screenshots and point
 * gallery.json at their immutable R2 URLs.
 *
 * Daily flow: drop/replace images under `wikis/<id>/screenshots/`,
 * reference them in gallery.json by BARE repo-relative path (or keep an
 * already-hashed URL), run `node scripts/publish.mjs`, review the diff,
 * push. CI (.github/workflows/publish.yml) verifies and uploads.
 *
 * Naming: `<name>-<sha1 first 8>.<ext>` — a changed image gets a NEW
 * URL, so every image response can be cached forever and nothing ever
 * needs purging. Only gallery.json (short cache) moves.
 *
 * Modes:
 *   (none)    rewrite gallery.json in place (idempotent)
 *   --verify  exit 1 if gallery.json is not in published form (CI gate)
 *   --list    print "<local file>\t<object key>\t<content type>" for
 *             every referenced image (CI upload loop)
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ASSET_BASE_URL = 'https://assets.stashbase.ai';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const galleryPath = path.join(root, 'gallery.json');

const CONTENT_TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

function hashedKey(localPath) {
  const digest = crypto.createHash('sha1').update(fs.readFileSync(localPath)).digest('hex').slice(0, 8);
  const ext = path.extname(localPath);
  const base = path.basename(localPath, ext);
  const dir = path.relative(root, path.dirname(localPath)).split(path.sep).join('/');
  return `${dir}/${base}-${digest}${ext}`;
}

/** A screenshot entry may be: a bare repo-relative path ("wikis/x/screenshots/cover.png"),
 *  an already-published URL on ASSET_BASE_URL, or a legacy jsDelivr URL
 *  whose repo path we can recover. Returns { url, localPath|null }. */
function resolveScreenshot(value) {
  let relative = null;
  if (!/^https?:\/\//i.test(value)) {
    relative = value.replace(/^\/+/, '');
  } else if (value.startsWith(`${ASSET_BASE_URL}/`)) {
    // Strip the hash suffix to find the source file it was made from.
    const key = value.slice(ASSET_BASE_URL.length + 1);
    relative = key.replace(/-[0-9a-f]{8}(\.\w+)$/, '$1');
  } else {
    const legacy = value.match(/cdn\.jsdelivr\.net\/gh\/[^/]+\/[^/@]+@[^/]+\/(.+)$/);
    if (legacy) relative = legacy[1];
  }
  if (!relative) return { url: value, localPath: null };
  const localPath = path.join(root, relative);
  if (!fs.existsSync(localPath)) {
    throw new Error(`screenshot source missing: ${relative}`);
  }
  return { url: `${ASSET_BASE_URL}/${hashedKey(localPath)}`, localPath };
}

const gallery = JSON.parse(fs.readFileSync(galleryPath, 'utf8'));
const uploads = new Map();
for (const wiki of gallery.wikis ?? []) {
  if (!Array.isArray(wiki.screenshots)) continue;
  wiki.screenshots = wiki.screenshots.map((value) => {
    const { url, localPath } = resolveScreenshot(value);
    if (localPath) {
      const key = url.slice(ASSET_BASE_URL.length + 1);
      uploads.set(key, localPath);
    }
    return url;
  });
}

const published = `${JSON.stringify(gallery, null, 2)}\n`;
const current = fs.readFileSync(galleryPath, 'utf8');
const mode = process.argv[2];

if (mode === '--verify') {
  if (published !== current) {
    console.error('gallery.json is not in published form — run `node scripts/publish.mjs` and commit the result');
    process.exit(1);
  }
} else if (mode === '--list') {
  for (const [key, localPath] of uploads) {
    const type = CONTENT_TYPES[path.extname(localPath).toLowerCase()] ?? 'application/octet-stream';
    process.stdout.write(`${path.relative(root, localPath)}\t${key}\t${type}\n`);
  }
} else {
  if (published === current) {
    console.log('gallery.json already published-form; nothing to do');
  } else {
    fs.writeFileSync(galleryPath, published);
    console.log('gallery.json rewritten — review the diff, then commit and push');
  }
  for (const key of uploads.keys()) console.log('  asset:', key);
}

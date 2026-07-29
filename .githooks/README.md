# Git hooks

Version-controlled hooks for this repo. Zero dependencies (plain shell + `bun`).

## Activate (once per clone)

```bash
git config core.hooksPath .githooks
```

## What runs

- **pre-commit** — if a commit stages a source that feeds the generated files
  (`lib/guides-data.ts`, `lib/spec-data`, `lib/kit-data`, `lib/examples-data`,
  the `gen-*` scripts, `utils/site-url.ts`, or `public/pricing.md`), it
  regenerates `public/sitemap.xml`, `public/llms.txt`, and
  `public/llms-full.txt` and re-stages them.

## Why

Netlify builds with `build:ci` (`nuxt build`, **no** `sync:all`), and
`gen:llms` reads the sibling `../core` repo that only exists in the monorepo.
So the derived files can't be regenerated on Netlify — they must be generated
locally and committed. This hook makes that automatic. Bypass a run with
`git commit --no-verify`.

# gui-landing (dotgui.org)

Nuxt site for the `.gui` format. Content lives in `lib/*-data.ts`; routes,
sitemap, and llms files are **derived** from it.

## Derived files must be committed (important)

Netlify deploys with `build:ci` (`nuxt build` only — **no** `sync:all`), and
`gen:llms` reads the sibling `../core` repo that doesn't exist in Netlify's
single-repo checkout. So these files are **not** regenerated on deploy and must
be committed up to date:

- `public/sitemap.xml` — `bun run gen:sitemap`
- `public/llms.txt`, `public/llms-full.txt` — `bun run gen:llms`

A **pre-commit hook** (`.githooks/pre-commit`) does this automatically when you
change a source file. Activate it once per clone:

```bash
git config core.hooksPath .githooks
```

If you ever commit with `--no-verify` or from an env without the hook, run
`bun run gen:sitemap && bun run gen:llms` and commit the result yourself.

## Guides / FAQ authoring

- Guides: append a `GuideEntry` to `lib/guides-data.ts` — no new `.vue` file;
  the route, sitemap, and llms entries are all derived.
- Homepage FAQ: `lib/site-faq.ts` (single source for the on-page FAQ and the
  FAQPage JSON-LD — keep them identical).
- House style: no em/en dashes in prose (reads as an AI tell).

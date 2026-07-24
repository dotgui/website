<template>
  <KitShell>
    <header id="kit-top" class="kit-header">
      <p class="kit-eyebrow">@dotgui/kit · engine</p>
      <h1 class="kit-title">The reference engine for the .gui format</h1>
      <p class="kit-desc">
        <strong>@dotgui/kit</strong> takes a <code>.gui</code> file through its entire life 
        parse, validate, render, score  in one package, behind one version. It is a pure,
        deterministic library: same input, same output, <strong>zero AI</strong>. If the
        format's meaning depends on it, it lives here.
      </p>
      <div class="install-row">
        <InstallCmd pkg="@dotgui/kit" />
        <span class="ver">v{{ version }}</span>
      </div>
    </header>

    <section id="lifecycle" class="cat">
      <h2 class="cat-label">Lifecycle</h2>
      <p class="cat-lead">
        The write path is <em>author → validate → pack</em>. Validation is the one hard
        check  illegal markup can't be saved as a real <code>.gui</code>. Everything else
        is à la carte: render when you want pixels, score when you want a quality report.
        The read path is just as short  <em>parse → render</em>.
      </p>
      <DocCode :code="lifecycleCode" lang="ts" />
    </section>

    <section id="modules" class="cat">
      <h2 class="cat-label">Modules</h2>
      <p class="cat-lead">
        The root export is just the canonical types. Behaviour lives in subpath exports, so a
        consumer only bundles what it imports  pull the parser without the renderer. Open any
        module for its API and examples.
      </p>
      <div class="cat-grid">
        <NuxtLink v-for="m in kitModules" :key="m.slug" :to="`/kit/${m.slug}`" class="card">
          <div class="card-head">
            <span class="card-name">{{ m.name }}</span>
            <span class="kind-badge" :class="`kind-${m.kind}`">{{ m.tag }}</span>
          </div>
          <p class="card-desc">{{ m.sub }}  {{ m.desc[0] }}</p>
          <span class="card-cta">Open module →</span>
        </NuxtLink>
      </div>
      <p class="cat-note">
        The <strong>optimizer</strong> (Clean's diff signal) is injected  pass it into
        <code>score</code> or Clean reports NA, never faked. The <strong>rasterizer</strong>
        ships a light <code>puppeteer-core</code> default; opt into full
        <code>puppeteer</code> for a bundled Chromium.
      </p>
    </section>

    <section id="quality" class="cat">
      <h2 class="cat-label">Quality</h2>
      <p class="cat-lead">
        The scorer measures whether a file is <em>well-built</em>, never whether the design
        is fashionable  the way an HTML validator judges markup, not websites. Four levels:
        <strong>Clean</strong>, <strong>Consistent</strong>, <strong>Accessible</strong>
        (WCAG 2.2 visual criteria), and <strong>Comprehensible</strong> (AI-ready semantics via
        the 53-role vocabulary). All four run locally, offline, with zero AI. A low score is
        still a valid file  the kit reports and takes no action.
      </p>
      <p><NuxtLink to="/spec/quality" class="cat-link">Read the full quality model →</NuxtLink></p>
    </section>

    <section id="faq" class="cat">
      <h2 class="cat-label">Frequently asked</h2>
      <div class="faq">
        <div v-for="(f, i) in faq" :key="i" class="faq-item">
          <p class="faq-q">{{ f.q }}</p>
          <p class="faq-a">{{ f.a }}</p>
        </div>
      </div>
    </section>
  </KitShell>
</template>

<script setup lang="ts">
import { kitModules } from '~/lib/kit-data'

const version = '0.2.1'

const lifecycleCode = `import { validate } from '@dotgui/kit/validate'
import { pack } from '@dotgui/kit/package'
import { render } from '@dotgui/kit/render'

const errors = validate(markup)        // the only required step
if (!errors.length) {
  const file = await pack({ markup })  // → .gui bytes (+ preview.webp)
  const dom  = render(markup)          // → live DOM, one call
}`

const faq = [
  {
    q: 'Does @dotgui/kit use AI?',
    a: 'No  zero AI, by design. The kit executes the format\'s rules and nothing else: pure rule evaluation with deterministic output. AI-assisted authoring lives in agents and skills outside the kit, so the engine stays trustworthy and reproducible.'
  },
  {
    q: 'Is validation required to create a .gui file?',
    a: 'Yes  and it is the only required step. The minimal path is valid markup → zip. Render, lint, score, and preview are optional capabilities, not gates.'
  },
  {
    q: 'Can I use just the parser or just the renderer?',
    a: 'Yes. Each capability is a subpath export (@dotgui/kit/parser, /render, /validate, …), so bundlers tree-shake everything you don\'t import. The parser and linter are DOM-free and run in any JavaScript environment.'
  },
  {
    q: 'How is the preview.webp thumbnail generated?',
    a: 'pack() renders the file to HTML and rasterizes it with puppeteer-core driving a system Chromium  a light install with no bundled browser. If no browser is found, packing still succeeds with a placeholder preview and a console error explaining the fix.'
  }
]

usePageSeo({
  path: '/kit',
  title: '@dotgui/kit  the reference engine for the .gui format',
  description: '@dotgui/kit is the deterministic engine for .gui files: parser, validator, HTML renderer, CCAC scorer, linter, autofix, packager, and rasterizer  9 modules in one package, zero AI, tree-shakeable subpath exports.'
})

useProductSchema({
  path: '/kit',
  name: '@dotgui/kit',
  crumb: 'kit',
  description: 'The reference engine for the .gui format  parse, validate, render, lint, score, and package .gui files with one deterministic, zero-AI library.',
  faq
})
</script>

<style scoped>
.kit-header { padding: 48px 40px 8px; }
.kit-eyebrow {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
}
.kit-title {
  font-family: var(--display);
  font-size: 36px;
  font-weight: var(--display-weight);
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--ink);
  margin-bottom: 14px;
  max-width: 640px;
}
.kit-desc {
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.75;
  color: var(--text-muted);
  max-width: 640px;
  margin: 0;
}
.kit-desc strong { color: var(--text); font-weight: 600; }
.kit-desc code { font-family: var(--mono); font-size: 0.9em; color: var(--text); }

.install-row { display: flex; align-items: center; gap: 12px; margin-top: 20px; }
.install {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--on-dark);
  background: var(--surface-dark);
  border-radius: var(--radius-sm);
  padding: 9px 15px;
}
.ver { font-size: 11.5px; color: var(--text-dim); }

.cat { padding: 40px 40px 0; border-top: none; }
.cat-label {
  font-family: var(--display);
  font-size: 20px;
  font-weight: var(--display-weight);
  letter-spacing: -0.015em;
  color: var(--ink);
  margin-bottom: 12px;
}
.cat-lead {
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-muted);
  max-width: 680px;
  margin: 0 0 18px;
}
.cat-lead em { color: var(--text); font-style: italic; }
.cat-lead code, .cat-note code { font-family: var(--mono); font-size: 0.9em; color: var(--text); }
.cat-lead strong, .cat-note strong { color: var(--text); font-weight: 600; }
.cat-link { font-family: var(--sans); font-size: 14px; color: var(--blue); text-decoration: none; }
.cat-link:hover { text-decoration: underline; }
.cat-note {
  font-family: var(--sans);
  font-size: 13px;
  line-height: 1.75;
  color: var(--text-dim);
  max-width: 680px;
  margin: 18px 0 0;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
.card {
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  border: 1px solid var(--hairline);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  text-decoration: none;
  transition: border-color 140ms var(--ease-out), transform 140ms var(--ease-out), box-shadow 140ms var(--ease-out);
}
.card:hover {
  border-color: var(--muted-soft);
  transform: translateY(-2px);
  box-shadow: 0 12px 30px -18px rgba(16,16,16,.28);
}
.card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.card-name { font-family: var(--mono); font-size: 14px; font-weight: 600; color: var(--text); }
.kind-badge {
  font-family: var(--sans);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  line-height: 1;
}
.kind-blue   { color: var(--blue);   background: rgba(43,107,228,.1);  border-color: rgba(43,107,228,.22); }
.kind-purple { color: var(--purple); background: rgba(157,91,234,.1);  border-color: rgba(157,91,234,.22); }
.kind-muted  { color: var(--muted);  background: var(--surface-strong); border-color: var(--hairline); }
.card-desc {
  font-family: var(--sans);
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0 0 14px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-cta { font-family: var(--sans); font-size: 12px; color: var(--text-dim); transition: color 140ms var(--ease-out); }
.card:hover .card-cta { color: var(--text); }

.faq { max-width: 720px; }
.faq-item { padding: 0 0 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); }
.faq-item:last-child { border-bottom: none; margin-bottom: 0; }
.faq-q { font-family: var(--sans); font-size: 14px; font-weight: 600; color: var(--text); margin: 0 0 6px; }
.faq-a { font-family: var(--sans); font-size: 13px; line-height: 1.7; color: var(--text-muted); margin: 0; max-width: 680px; }

section:last-child { padding-bottom: 64px; }

@media (max-width: 900px) {
  .kit-header { padding: 36px 20px 8px; }
  .cat { padding: 32px 20px 0; }
}
@media (max-width: 600px) {
  .cat-grid { grid-template-columns: 1fr; }
}
</style>

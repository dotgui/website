<template>
  <SpecShell>
    <div class="leaf">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/spec">Spec Reference</NuxtLink>
        <span class="sep">/</span>
        <span class="current">Quality</span>
      </nav>

      <div class="q-body">
        <h1>The quality model — CCAC</h1>
        <p class="q-lead">
          The .gui quality score measures <strong>the file, not the design</strong>. Like
          an HTML validator, it answers “is this a well-built file?” — never “is this a
          good-looking design?” The score is <strong>100% local, offline, deterministic,
          and zero-AI</strong>: pure rule evaluation over the parsed tree and fixed
          vocabularies, so the same file scores the same everywhere, forever.
        </p>

        <h2>The gate</h2>
        <p>
          Before quality is measured, two binary conditions must hold. <strong>Valid</strong> —
          the file conforms to the spec; a file that fails is not a .gui file and is not
          scored. <strong>Intact</strong> — every reference resolves: <code>$token</code>
          names exist, asset <code>src</code> values point to real files in the package,
          component ids match declared components. A file can be syntactically valid and
          silently broken; intact catches that. Fail either and there is no report.
        </p>

        <h2>The four levels</h2>
        <table class="q-table">
          <thead><tr><th>Level</th><th>Question it answers</th></tr></thead>
          <tbody>
            <tr>
              <td><code>C</code> Clean</td>
              <td>Is the file built without waste? No dead markup, no redundant nesting, no unused declarations.</td>
            </tr>
            <tr>
              <td><code>C</code> Consistent</td>
              <td>Does the file agree with itself? Declared tokens and styles actually used; one system, not three.</td>
            </tr>
            <tr>
              <td><code>A</code> Accessible</td>
              <td>Is the file physically legible? WCAG 2.2 visual criteria — contrast, tap-target sizes, text sizes.</td>
            </tr>
            <tr>
              <td><code>C</code> Comprehensible</td>
              <td>How AI-ready is the file as semantics? The fraction of nodes documented by declared
                <NuxtLink to="/spec/roles">role=</NuxtLink> anchors, each read at face value as far as its reach allows.</td>
            </tr>
          </tbody>
        </table>
        <p>
          Every level emits the same envelope — <code>{ "score": 0–100, "audits": [...] }</code> —
          and the reference implementation is <NuxtLink to="/kit">@dotgui/kit/score</NuxtLink>.
        </p>

        <h2>Advisory, never a gate</h2>
        <p>
          A low score is still a valid, packable file. The kit produces the measurement
          and takes no action; what happens next is the consuming tool's policy — a CI
          job might fail below a threshold, an app might show a badge, a batch pipeline
          might auto-discard. The test for what belongs in the score: <em>would another
          designer disagree? Would I disagree next year?</em> If yes, it's design taste
          and it stays out. Beauty, composition, and trendiness are deliberately not
          measured.
        </p>
      </div>
    </div>
  </SpecShell>
</template>

<script setup lang="ts">
const pageUrl = 'https://dotgui.org/spec/quality'

const faq = [
  {
    q: 'Does the .gui quality score judge how good a design looks?',
    a: 'No — it measures the file, not the design. Like an HTML validator, it checks whether the file is well-built: clean structure, self-agreement, physical legibility, and self-describing semantics. Beauty and taste are deliberately out of scope.'
  },
  {
    q: 'Does scoring require an AI model or a network connection?',
    a: 'No. All four CCAC levels are local, offline, deterministic rule evaluation over the parsed tree and fixed vocabularies. Same input, same output, on any machine.'
  },
  {
    q: 'Can a low-scoring .gui file still be used?',
    a: 'Yes. A low score is still a valid, packable file. The score is advisory — the kit reports a number and takes no action; any gate or threshold is the consuming tool\'s policy.'
  }
]

usePageSeo({
  path: '/spec/quality',
  title: 'CCAC — the .gui quality model (Clean, Consistent, Accessible, Comprehensible)',
  description: 'How .gui files are scored: four local, zero-AI levels — Clean, Consistent, Accessible (WCAG 2.2 visual criteria), and Comprehensible (AI-readiness via the role vocabulary). The score measures the file, never the design.'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'CCAC — the .gui quality model',
        description: 'The quality specification for .gui files: a deterministic, zero-AI, fully local score across Clean, Consistent, Accessible, and Comprehensible levels.',
        url: pageUrl,
        isPartOf: { '@type': 'TechArticle', name: '.gui Spec Reference', url: 'https://dotgui.org/spec' },
        author: { '@type': 'Organization', name: '.gui (dotgui)', url: 'https://dotgui.org' }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Spec Reference', item: 'https://dotgui.org/spec' },
          { '@type': 'ListItem', position: 2, name: 'Quality', item: pageUrl }
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      })
    }
  ]
})
</script>

<style scoped>
.leaf { padding-bottom: 64px; }

.breadcrumb {
  font-family: var(--sans);
  font-size: 12px;
  color: var(--text-dim);
  padding: 24px 40px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.breadcrumb a { color: var(--text-muted); text-decoration: none; }
.breadcrumb a:hover { color: var(--text); }
.breadcrumb .current { color: var(--text); }

.q-body { padding: 18px 40px 0; max-width: 760px; }

.q-body h1 {
  font-family: var(--display);
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--ink);
  margin-bottom: 12px;
}

.q-lead, .q-body p {
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-muted);
  margin: 0 0 16px;
}
.q-body strong { color: var(--text); }
.q-body a { color: var(--text); }
.q-body p code {
  font-family: var(--mono);
  font-size: 0.92em;
  color: var(--text);
}

.q-body h2 {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin: 32px 0 10px;
}

.q-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--sans);
  font-size: 13px;
  margin: 8px 0 16px;
}
.q-table th {
  text-align: left;
  font-family: var(--sans);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-weight: 500;
  padding: 0 14px 8px 0;
  border-bottom: 1px solid var(--border);
}
.q-table td {
  padding: 10px 14px 10px 0;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: top;
  line-height: 1.65;
  color: var(--text-muted);
}
.q-table td:first-child { white-space: nowrap; color: var(--text); font-weight: 500; }
.q-table td code { font-family: var(--mono); color: var(--text-dim); margin-right: 4px; }
.q-table a { color: var(--text); }

@media (max-width: 900px) {
  .breadcrumb { padding: 20px 20px 0; }
  .q-body { padding: 16px 20px 0; }
}
</style>

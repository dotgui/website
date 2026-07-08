<template>
  <DocShell title="The CLI" overview="/cli" :groups="navGroups">
    <header id="cli-top" class="doc-header">
      <p class="doc-eyebrow">@dotgui/cli · toolchain</p>
      <h1 class="doc-title">The command-line toolchain for .gui files</h1>
      <p class="doc-desc">
        <strong>gui</strong> reads, writes, lints, renders, and packages <code>.gui</code> files 
        and installs the dotgui skill into the AI agents you already use. The CLI itself
        contains <strong>no AI</strong>: it is a fast, deterministic tool, and the design
        generation happens in your own agent.
      </p>
    </header>

    <section id="install" class="cat">
      <h2 class="cat-label">Install</h2>
      <p class="cat-lead">
        Two commands to a working setup  install the CLI, then point it at your agents.
      </p>
      <InstallCmd pkg="@dotgui/cli" global />
      <div class="after-install">
        <DocCode label="Then set up your agents" :code="setupCode" lang="sh" />
      </div>
      <p class="cat-note">
        <code>gui setup</code> detects your installed agents  Claude Code, Gemini CLI, and
        others  installs the dotgui skill into each one, and allowlists the
        <code>gui</code> command so agents run it without permission prompts. After that,
        asking any of those tools for a UI “in gui” just works.
      </p>
    </section>

    <section id="model" class="cat">
      <h2 class="cat-label">Mental model</h2>
      <p class="cat-lead">Your agent designs. <code>gui</code> keeps it valid.</p>
      <DocCode :code="modelCode" lang="txt" />
      <p class="cat-note">
        A real agent  warm session, your best model, full tool-calling and vision  produces
        better UIs than anything a CLI could wrap around a model. So the CLI doesn't try. It
        owns the one thing only it can do perfectly: keeping every <code>.gui</code> file
        <strong>valid</strong>. Invalid markup never gets packaged  <code>gui write</code>
        lints first and exits non-zero with structured errors.
      </p>
    </section>

    <section id="commands" class="cat">
      <h2 class="cat-label">Commands</h2>
      <p class="cat-lead">The full surface  every command is deterministic and package-aware.</p>
      <table class="doc-table">
        <thead><tr><th>Command</th><th>What it does</th></tr></thead>
        <tbody>
          <tr v-for="c in commands" :key="c.id" :id="`cmd-${c.id}`">
            <td><code>{{ c.cmd }}</code></td>
            <td v-html="c.desc"></td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="agents" class="cat">
      <h2 class="cat-label">For agents</h2>
      <p class="cat-lead">A machine-friendly contract.</p>
      <p class="cat-note">
        Agents are a first-class audience: <code>read</code>, <code>write</code>,
        <code>lint</code>, and <code>info</code> accept <code>--json</code> for
        machine-readable output and errors. Commands exit <code>0</code> on success and
        non-zero on failure  a lint or validation error exits <code>1</code> and writes
        nothing. All package operations run in an ephemeral shadow directory that is created
        and deleted within each command, so nothing is left on disk.
      </p>
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
  </DocShell>
</template>

<script setup lang="ts">
const setupCode = `gui setup`

const modelCode = `You ──ask──▶ your agent ──uses──▶ dotgui skill ──calls──▶ gui
                                                  └─ lint · autofix · render · package`

const commands = [
  { id: 'read', cmd: 'gui read home.gui', nav: 'gui read', desc: 'Print the markup; <code>--assets</code> lists assets, <code>--preview</code> / <code>--asset name</code> extract images to a viewable path.' },
  { id: 'write', cmd: 'gui write home.gui', nav: 'gui write', desc: 'Save from stdin: lint → repack → regenerate <code>preview.webp</code>. Nothing is written if the markup is invalid.' },
  { id: 'lint', cmd: 'gui lint home.gui', nav: 'gui lint', desc: 'Validate; <code>--fix</code> applies deterministic autofix and writes back.' },
  { id: 'render', cmd: 'gui render home.gui -o out.png', nav: 'gui render', desc: 'Rasterize to PNG/WEBP/JPEG using a Chromium already on your machine.' },
  { id: 'assets', cmd: 'gui add · gui rm', nav: 'gui add / rm', desc: 'Add or remove an asset inside the package  no manual unzipping, ever.' },
  { id: 'setpreview', cmd: 'gui set-preview home.gui shot.webp', nav: 'gui set-preview', desc: 'Replace the embedded <code>preview.webp</code> with your own image.' },
  { id: 'open', cmd: 'gui open home.gui', nav: 'gui open', desc: 'Open the file in the dotgui viewer.' },
  { id: 'info', cmd: 'gui info home.gui', nav: 'gui info', desc: 'Name, root canvas, asset list, preview.' },
  { id: 'pack', cmd: 'gui pack · gui unpack', nav: 'gui pack / unpack', desc: 'Folder ⇄ <code>.gui</code> conversion for hand-editing.' },
  { id: 'setup', cmd: 'gui setup', nav: 'gui setup', desc: 'Install the dotgui skill into detected agents and allowlist <code>gui</code>.' },
  { id: 'skill', cmd: 'gui skill where · update', nav: 'gui skill', desc: 'Manage the installed dotgui skill  print its location, or update it.' }
]

const navGroups = [
  {
    label: 'Guide',
    items: [
      { label: 'Install', to: '#install' },
      { label: 'Mental model', to: '#model' },
      { label: 'For agents', to: '#agents' },
      { label: 'FAQ', to: '#faq' }
    ]
  },
  {
    label: 'Commands',
    items: commands.map(c => ({ label: c.nav, to: `#cmd-${c.id}`, mono: true }))
  }
]

const faq = [
  {
    q: 'Does the gui CLI generate designs?',
    a: 'No. The CLI contains zero AI  it lints, autofixes, renders, and packages. Design generation happens in your own agent (Claude Code, Gemini CLI, Cursor), which gui setup teaches the format via the dotgui skill.'
  },
  {
    q: 'What happens if my agent writes invalid markup?',
    a: 'gui write refuses to save it. The command lints first, exits non-zero with structured errors, and writes nothing  so a broken file can never become a .gui package. With --fix, deterministic autofix repairs common issues.'
  },
  {
    q: 'Does gui render need a bundled browser?',
    a: 'No download is bundled. Rendering drives a Chromium-based browser already installed on your machine  Chrome, Edge, Brave, or Chromium  via puppeteer-core. If none is found, gui write simply skips the preview instead of blocking the save.'
  },
  {
    q: 'Do I need to unzip .gui files to edit them?',
    a: 'Never. gui treats the package like a folder  read markup, list assets, add or remove files  and does the unzip/rezip in an ephemeral cache that cleans itself up.'
  }
]

usePageSeo({
  path: '/cli',
  title: 'gui CLI  the command-line toolchain for .gui files',
  description: '@dotgui/cli reads, writes, lints, renders, and packages .gui files, and installs the dotgui skill into AI agents like Claude Code and Gemini CLI. Deterministic, zero-AI, agent-friendly with --json output and stable exit codes.'
})

useProductSchema({
  path: '/cli',
  name: '@dotgui/cli',
  crumb: 'cli',
  description: 'The command-line toolchain for the .gui format: read, write, lint, render, and package .gui files, plus one-command skill setup for AI coding agents.',
  faq
})
</script>

<style scoped>
.doc-header { padding: 48px 40px 8px; }
.doc-eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
}
.doc-title {
  font-family: var(--display);
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--ink);
  margin-bottom: 14px;
  max-width: 660px;
}
.doc-desc {
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.75;
  color: var(--text-muted);
  max-width: 660px;
  margin: 0;
}
.doc-desc strong { color: var(--text); font-weight: 600; }
.doc-desc code { font-family: var(--mono); font-size: 0.9em; color: var(--text); }

.cat { padding: 40px 40px 0; border-top: none; }
.cat-label {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 600;
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
.cat-lead code { font-family: var(--mono); font-size: 0.9em; color: var(--text); }
.cat-note {
  font-family: var(--sans);
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--text-muted);
  max-width: 680px;
  margin: 18px 0 0;
}
.cat-note code { font-family: var(--mono); font-size: 0.9em; color: var(--text); }
.cat-note strong, .cat-lead strong { color: var(--text); font-weight: 600; }

.after-install { margin-top: 18px; max-width: 680px; }

/* spec-style table */
.doc-table {
  width: 100%;
  max-width: 820px;
  border-collapse: collapse;
  font-size: 13px;
}
.doc-table th {
  text-align: left;
  font-family: var(--sans);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-weight: 500;
  padding: 0 16px 10px 0;
  border-bottom: 1px solid var(--border);
}
.doc-table td {
  padding: 11px 16px 11px 0;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  line-height: 1.6;
  vertical-align: top;
  font-family: var(--sans);
}
.doc-table td:first-child {
  font-family: var(--mono);
  color: var(--text);
  font-size: 12px;
  white-space: nowrap;
  padding-right: 24px;
}
.doc-table :deep(code) {
  font-family: var(--mono);
  font-size: 0.92em;
  color: var(--text);
}
tr[id] { scroll-margin-top: 72px; }

.faq { max-width: 720px; }
.faq-item { padding: 0 0 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); }
.faq-item:last-child { border-bottom: none; margin-bottom: 0; }
.faq-q { font-family: var(--sans); font-size: 14px; font-weight: 600; color: var(--text); margin: 0 0 6px; }
.faq-a { font-family: var(--sans); font-size: 13px; line-height: 1.7; color: var(--text-muted); margin: 0; max-width: 680px; }

section:last-child { padding-bottom: 64px; }

@media (max-width: 900px) {
  .doc-header { padding: 36px 20px 8px; }
  .cat { padding: 32px 20px 0; }
}
</style>

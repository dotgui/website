<template>
  <section id="loop">
    <div data-reveal>
      <div class="section-label">How it works</div>
      <h2>Author. Check. Ship.</h2>
      <p>
        The toolchain splits cleanly in two: <strong>your own AI agent does the designing</strong> —
        Claude Code, Gemini CLI, Cursor — and a <strong>100% deterministic, zero-AI engine</strong>
        does everything else. The format stays open in the middle; the file stays yours.
      </p>
    </div>

    <div class="loop-grid" data-reveal="stagger">
      <NuxtLink to="/cli" class="loop-card">
        <div class="loop-step">01 — Author</div>
        <h3>Your agent writes the file</h3>
        <p>
          <code>gui setup</code> installs the dotgui skill into the coding agents you
          already use. Ask for a design “in gui” — the agent knows the format, writes
          the markup, and calls the <code>gui</code> CLI to save it.
        </p>
        <span class="loop-cta">@dotgui/cli →</span>
      </NuxtLink>

      <NuxtLink to="/kit" class="loop-card">
        <div class="loop-step">02 — Check</div>
        <h3>The engine keeps it valid</h3>
        <p>
          <code>@dotgui/kit</code> validates, lints, autofixes, and scores every file —
          pure rules, same input, same output. Broken markup never becomes a
          <code>.gui</code>; quality is measured on the CCAC scale.
        </p>
        <span class="loop-cta">@dotgui/kit →</span>
      </NuxtLink>

      <NuxtLink to="/embed" class="loop-card">
        <div class="loop-step">03 — Ship</div>
        <h3>Render it anywhere</h3>
        <p>
          One CDN script embeds the file on any website. The kit renders it to DOM or
          rasterizes it to an image, and the Figma plugin moves it in and out of design
          tools.
        </p>
        <span class="loop-cta">@dotgui/embed →</span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.loop-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  margin-top: var(--space-xl);
}

.loop-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  border: 2px solid var(--ink);
  border-radius: var(--radius-xl);
  text-decoration: none;
  transition: transform 400ms var(--ease-spring);
}
.loop-card:nth-child(1) { background: var(--brand-peach); transform: rotate(-1deg); }
.loop-card:nth-child(2) { background: var(--brand-teal); transform: rotate(0.8deg); }
.loop-card:nth-child(3) { background: var(--brand-lavender); transform: rotate(-0.6deg); }
.loop-card:hover { transform: rotate(0deg) translateY(-4px); }

.loop-step {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--canvas);
  color: var(--ink);
  border-radius: var(--radius-pill);
  padding: 5px 12px;
  width: fit-content;
  transform: rotate(-1.5deg);
  margin-bottom: var(--space-md);
}

.loop-card h3 {
  font-family: var(--sans);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0 0 var(--space-xs);
}

.loop-card p {
  font-family: var(--sans);
  font-size: 13.5px;
  line-height: 1.65;
  margin: 0 0 var(--space-md);
  flex: 1;
}

.loop-card p code {
  font-family: var(--mono);
  font-size: 0.9em;
  background: rgba(255, 255, 255, 0.45);
  border-radius: 4px;
  padding: 1px 5px;
}

.loop-cta {
  font-family: var(--mono);
  font-size: 12.5px;
  font-weight: 500;
}

/* Per-card ink: dark text on light fills, light text on the teal card */
.loop-card:nth-child(1) h3, .loop-card:nth-child(1) p, .loop-card:nth-child(1) .loop-cta { color: #5a2a08; }
.loop-card:nth-child(1) h3 { color: var(--ink); }
.loop-card:nth-child(3) h3, .loop-card:nth-child(3) p, .loop-card:nth-child(3) .loop-cta { color: #2a1a52; }
.loop-card:nth-child(3) h3 { color: var(--ink); }
.loop-card:nth-child(2) h3, .loop-card:nth-child(2) p, .loop-card:nth-child(2) .loop-cta { color: var(--on-dark); }
.loop-card:nth-child(2) p { color: #c8ddd5; }
.loop-card:nth-child(2) p code { background: rgba(255, 255, 255, 0.14); }

@media (max-width: 820px) {
  .loop-grid { grid-template-columns: 1fr; }
}
</style>

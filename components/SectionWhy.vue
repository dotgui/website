<template>
  <section>
    <div data-reveal>
      <div class="section-label">Why it exists</div>
      <h2>Designed for AI agents</h2>
      <p>
        When an AI agent needs to understand or reproduce a UI, it needs text. Figma's native format is a binary API — not something you paste into a prompt.
        <strong>.gui</strong> bridges that gap: it's compact, human-readable XML that fits in a context window.
      </p>
      <p>
        An agent can read a <code>.gui</code> file and know exactly what's on screen —
        the layout structure, every text value, colors, spacing, font weights — without screenshots or visual reasoning.
        It can also <em>write</em> <code>.gui</code> to produce screens that render correctly.
      </p>
    </div>

    <div class="features" data-reveal="stagger">
      <div class="feature">
        <div class="feature-label">01</div>
        <div class="feature-title">Portable</div>
        <p class="feature-body">A single <code>.gui</code> file carries structure, styles, tokens, fonts, and assets. No external references needed.</p>
      </div>
      <div class="feature">
        <div class="feature-label">02</div>
        <div class="feature-title">Renderable</div>
        <p class="feature-body">Drop in <code>@dotgui/kit/render</code> to turn any <code>.gui</code> string into live DOM with one function call.</p>
      </div>
      <div class="feature">
        <div class="feature-label">03</div>
        <div class="feature-title">Figma-accurate</div>
        <p class="feature-body">1-1 mapping to Figma's layer model. Auto-layout, fills, gradients, effects, tokens — nothing is approximated.</p>
      </div>
      <div class="feature">
        <div class="feature-label">04</div>
        <div class="feature-title">AI-native</div>
        <p class="feature-body">Plain text. No proprietary decoder required. LLMs can read, write, and reason about <code>.gui</code> files directly.</p>
      </div>
    </div>
  </section>
</template>

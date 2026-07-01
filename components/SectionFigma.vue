<template>
  <section id="figma">
    <div data-reveal>
      <div class="section-label">Export</div>
      <h2>Export from Figma</h2>
      <p>
        Select any layer — a frame, a component, a group, or even a single shape — and export it as <code>.gui</code>
        with the Figma plugin. The plugin handles everything: token extraction, font mapping, image
        encoding, gradient computation.
      </p>
    </div>

    <div class="steps" data-reveal="stagger">
      <div class="step">
        <span class="step-num">01</span>
        <div class="step-content">
          <h3>Install the plugin</h3>
          <p>Add the dotgui Figma plugin from the Figma Community.</p>
        </div>
      </div>
      <div class="step">
        <span class="step-num">02</span>
        <div class="step-content">
          <h3>Select a layer</h3>
          <p>Any visible layer works — frames, components, groups, or individual shapes.</p>
        </div>
      </div>
      <div class="step">
        <span class="step-num">03</span>
        <div class="step-content">
          <h3>Export as .gui</h3>
          <p>
            Small exports produce a single inline <code>.gui</code> XML file with embedded assets.
            Larger exports download as a packaged <code>.gui</code> container with an
            <code>assets/</code> folder.
          </p>
        </div>
      </div>
      <div class="step">
        <span class="step-num">04</span>
        <div class="step-content">
          <h3>Render or process</h3>
          <p>
            Pass the file to <code>@dotgui/kit/render</code> for a live preview,
            or feed it directly to an AI agent as structured context.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

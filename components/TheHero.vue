<template>
  <section class="hero-stage">
    <img
      class="stage-art"
      src="/art/lake-george-kensett.jpg"
      alt=""
      aria-hidden="true"
    >
    <div class="stage-wash" aria-hidden="true"></div>

    <div class="stage-content">
      <p class="stage-eyebrow">The open file format for user interfaces</p>
      <h1>Design, written down.</h1>
      <p class="hero-desc">
        <strong>.gui</strong> is an open, text-based file format for user interfaces 
        what <code>.svg</code> is to graphics, <code>.gui</code> is to UI.
        Your AI agent writes it, a deterministic toolchain keeps it valid,
        and any browser, tool, or design app renders it.
      </p>
      <div class="hero-actions">
        <code class="hero-install">npm i -g @dotgui/cli</code>
        <NuxtLink class="hero-link" to="/spec">Read the spec →</NuxtLink>
      </div>

      <div class="hero-window" aria-hidden="true">
        <div class="hw-titlebar">
          <span class="hw-dots"><i></i><i></i><i></i></span>
          <span class="hw-title">portfolio.gui</span>
          <span class="hw-meta">rendered by @dotgui/kit</span>
        </div>
        <div class="hw-body">
          <div class="hw-nav">Portfolio</div>
          <div class="hw-card">
            <span class="hw-label">Balance</span>
            <span class="hw-value">$12,480</span>
          </div>
          <div class="hw-row">
            <div class="hw-stat"><span class="hw-label">Today</span><span class="hw-small up">+2.4%</span></div>
            <div class="hw-stat"><span class="hw-label">Positions</span><span class="hw-small">12</span></div>
          </div>
          <div class="hw-btn">Send money</div>
        </div>
      </div>

      <p class="stage-label">
        John Frederick Kensett, <em>Lake George</em>, 1869  The Met, public domain.
        Design used to live in paintings. Now it's a file you can read.
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero-stage {
  position: relative;
  overflow: hidden;
  background: var(--canvas);
}

.stage-art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 62%;
}

.stage-wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(247, 247, 244, 0.96) 0%,
    rgba(247, 247, 244, 0.62) 38%,
    rgba(247, 247, 244, 0.22) 70%,
    rgba(247, 247, 244, 0.45) 100%
  );
}

.stage-content {
  position: relative;
  max-width: 1120px;
  margin: 0 auto;
  padding: 88px 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stage-eyebrow {
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #5a5852;
  margin-bottom: 18px;
  animation: fadeUp 700ms var(--ease-out) both 100ms;
}

.hero-stage h1 {
  font-family: var(--display);
  font-size: clamp(44px, 6.5vw, 76px);
  font-weight: var(--display-weight);
  letter-spacing: -0.032em;
  line-height: 1.04;
  color: #26251e;
  margin: 0 0 20px;
  animation: fadeUp 900ms var(--ease-out) both 220ms;
}

.hero-desc {
  font-size: 16px;
  line-height: 1.6;
  color: #3f3d36;
  max-width: 560px;
  margin: 0 0 26px;
  animation: fadeUp 800ms var(--ease-out) both 380ms;
}
.hero-desc strong { color: #26251e; font-weight: 600; }

.hero-actions {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 54px;
  animation: fadeUp 800ms var(--ease-out) both 500ms;
}

.hero-install {
  font-family: var(--mono);
  font-size: 13.5px;
  color: #f7f7f4;
  background: #26251e;
  border-radius: 8px;
  padding: 12px 20px;
}

.hero-link {
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 500;
  color: #26251e;
  text-decoration: none;
  border-bottom: 1px solid #26251e;
  padding-bottom: 2px;
}

/* ─── the floating window ─── */
.hero-window {
  width: min(400px, 92vw);
  background: #fdfdfb;
  border: 1px solid rgba(38, 37, 30, 0.14);
  border-radius: 12px;
  overflow: hidden;
  animation: fadeUp 1000ms var(--ease-out) both 640ms;
}

.hw-titlebar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f4f3ee;
  border-bottom: 1px solid rgba(38, 37, 30, 0.1);
}
.hw-dots { display: flex; gap: 5px; }
.hw-dots i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(38, 37, 30, 0.16);
}
.hw-title {
  font-family: var(--mono);
  font-size: 11.5px;
  color: #26251e;
}
.hw-meta {
  font-size: 10.5px;
  color: #a09c92;
  margin-left: auto;
}

.hw-body { padding: 18px; text-align: left; }

.hw-nav {
  font-size: 14px;
  font-weight: 600;
  color: #26251e;
  margin-bottom: 12px;
}

.hw-card {
  background: #f7f7f4;
  border: 1px solid #efeee8;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.hw-label { font-size: 11px; color: #807d72; }
.hw-value { font-size: 22px; color: #26251e; letter-spacing: -0.02em; }

.hw-row { display: flex; gap: 10px; margin-bottom: 14px; }
.hw-stat {
  flex: 1;
  background: #f7f7f4;
  border: 1px solid #efeee8;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.hw-small { font-size: 15px; color: #26251e; }
.hw-small.up { color: #1f8a65; }

.hw-btn {
  background: #26251e;
  color: #f7f7f4;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  padding: 11px 0;
  text-align: center;
}

.stage-label {
  font-size: 11px;
  line-height: 1.6;
  color: #3f3d36;
  margin: 46px 0 0;
  max-width: 560px;
  background: rgba(247, 247, 244, 0.78);
  backdrop-filter: blur(3px);
  border-radius: var(--radius-pill);
  padding: 8px 18px;
  animation: fadeUp 900ms var(--ease-out) both 800ms;
}
.stage-label em { font-style: italic; }

@media (max-width: 640px) {
  .stage-content { padding: 64px 20px 28px; }
  .hero-actions { margin-bottom: 36px; }
  .stage-label { margin-top: 30px; }
}

@media (prefers-reduced-motion: reduce) {
  .stage-eyebrow, .hero-stage h1, .hero-desc, .hero-actions, .hero-window, .stage-label {
    animation: none;
  }
}
</style>

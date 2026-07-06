<template>
  <div class="home-v3">
    <TheNav />

    <header class="hero wrap">
      <p class="eyebrow reveal">THE OPEN FILE FORMAT FOR USER INTERFACES</p>
      <h1 class="reveal">The interface,<br>finally a file.</h1>
      <p class="sub reveal"><b>.gui</b> is an open file format for user interfaces. Text you can read, a file you can send, a design that stays a design — whoever, or whatever, made it.</p>
      <div class="cta-row reveal">
        <a class="btn-install" href="https://github.com/dotgui/core" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"/></svg>
          GitHub
        </a>
        <NuxtLink class="btn-ghost" to="/spec">Read the spec</NuxtLink>
      </div>
      <div class="herofig reveal" ref="herofigEl">
        <div class="hf-bar">
          <i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i>
          <span class="hf-name"><b>oscillate.gui</b> · one file</span>
        </div>
        <img class="hf-render" src="/samples/hero-render.webp" alt="A music-production DAW interface rendered from a .gui file" />
        <div class="hf-code"><pre v-html="heroCodeHtml"></pre></div>
        <div class="hf-handle" ref="hfHandleEl">
          <div class="hf-grip">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg>
          </div>
        </div>
        <span class="hf-tag code">reads like code</span>
        <span class="hf-tag pix">renders like a picture</span>
      </div>
      <p class="fmt-cap reveal">the same file — drag to skim between its markup and the pixels it renders. the way SVG made graphics text, .gui makes interfaces text.</p>
    </header>

    <section class="statement">
      <div class="wrap">
        <p class="fill" ref="fillEl">
          <span>Interfaces</span> <span>never</span> <span>got</span> <span>a</span> <span>format</span> <span>of</span> <span>their</span> <span>own.</span>
          <span>HTML</span> <span>is</span> <span>the</span> <span>web.</span>
          <span>Swift</span> <span>is</span> <span>a</span> <span>runtime.</span>
          <span>A</span> <span>mockup</span> <span>is</span> <span>a</span> <span>picture.</span>
          <span>Each</span> <span>one</span> <span>belongs</span> <span>to</span> <span>a</span> <span>platform</span> <span>—</span> <span>none</span> <span>of</span> <span>them</span> <span>is</span> <span>just</span> <span>the</span> <span>design,</span> <span>ready</span> <span>to</span> <span>travel.</span>
          <span class="gui">.gui</span> <span>is</span> <span>the</span> <span>first</span> <span>that</span> <span>is.</span>
        </p>
      </div>
    </section>

    <section class="gui-profiles" ref="guiProfilesEl">
      <div class="gp-shell">
        <div class="gp-head">
          <div>
            <p class="kicker reveal">WHAT DOES GUI STAND FOR?</p>
            <h2 class="reveal">Everyone reads the same file through their own lens.</h2>
          </div>
        </div>

        <div class="gp-stage reveal" style="--gp-index:0">
          <div class="gp-wordmark" aria-hidden="true">
            <span class="gp-dot"></span><span class="gp-g" ref="gpGEl">g</span><span>ui</span>
          </div>
          <div class="gp-cursor active" style="--gp-color:var(--blue);--rest-x:-270px;--rest-y:-130px;--to-x:-104px;--to-y:-72px;--float-x:14px;--float-y:-10px;--drift:6.2s;--delay:-1s">
            <i class="gp-pointer"></i><span class="gp-name">Designer</span>
          </div>
          <div class="gp-cursor" style="--gp-color:var(--orange);--rest-x:210px;--rest-y:-118px;--to-x:-94px;--to-y:-68px;--float-x:-16px;--float-y:11px;--drift:5.6s;--delay:-2.2s">
            <i class="gp-pointer"></i><span class="gp-name">AI agent</span>
          </div>
          <div class="gp-cursor" style="--gp-color:var(--green);--rest-x:-260px;--rest-y:40px;--to-x:-100px;--to-y:-66px;--float-x:12px;--float-y:14px;--drift:6.8s;--delay:-3.1s">
            <i class="gp-pointer"></i><span class="gp-name">Developer</span>
          </div>
          <div class="gp-cursor" style="--gp-color:var(--purple);--rest-x:220px;--rest-y:42px;--to-x:-86px;--to-y:-70px;--float-x:-12px;--float-y:-13px;--drift:6s;--delay:-.4s">
            <i class="gp-pointer"></i><span class="gp-name">Platform</span>
          </div>
          <div class="gp-meaning" aria-live="polite">
            <div class="gp-line">
              <span class="gp-role active">Graphical User Interface</span>
              <span class="gp-role">Generated User Interface</span>
              <span class="gp-role">Grammar User Interface</span>
              <span class="gp-role">Generic User Interface</span>
            </div>
            <p class="gp-copy">
              <span class="active">For designers, .gui preserves layout, hierarchy, spacing, and color as something visible and editable.</span>
              <span>For AI agents, .gui is a structured target they can write directly, not a screenshot or a pile of code.</span>
              <span>For developers, .gui is predictable grammar: parseable, diffable, validatable, and transformable.</span>
              <span>For platforms, .gui is one interface description that can travel across renderers and tools.</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="loop">
      <div class="wrap">
        <div class="head">
          <p class="kicker reveal">THE LOOP</p>
          <h2 class="reveal">The same file, tool to tool.</h2>
          <p class="lede reveal">Ask an agent for a screen and it writes the file. Open it in a browser. Drop it into Figma, nudge a color, send it back. Every tool reads and writes the one <b>home.gui</b> — the design moves as data, not as a fresh screenshot or rewrite at each step.</p>
        </div>

        <div class="stage reveal">
          <div class="rail"></div>
          <div class="filechip" ref="filechipEl">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M14 3v5h5M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
            home.gui
          </div>
          <div class="stations">

            <div class="station agent" ref="stAgentEl">
              <div class="st-label"><span class="dot"></span>AGENT</div>
              <div class="agent-body">
                <div class="prompt">$ "a stocks app, in gui"</div>
                <div class="ln"><span class="tag">&lt;col</span> gap="16" p="20"<span class="tag">&gt;</span></div>
                <div class="ln">&nbsp;&nbsp;<span class="tag">&lt;text&gt;</span>Balance</div>
                <div class="ln">&nbsp;&nbsp;<span class="tag">&lt;rect</span> role="button"</div>
                <div class="ln">&nbsp;&nbsp;&nbsp;&nbsp;fill="<span class="swatch"></span><span class="hexval">$brand</span>"</div>
                <div class="ln"><span class="tag">&lt;/col&gt;</span></div>
              </div>
            </div>

            <div class="station browser" ref="stBrowserEl">
              <div class="st-label"><span class="dot"></span>BROWSER</div>
              <div class="browser-chrome"><i></i><i></i><i></i></div>
              <div class="mini-ui">
                <div class="mui-title">Portfolio</div>
                <div class="mui-card"><div class="lab">Balance</div><div class="val">$12,480</div></div>
                <div class="mui-btn" ref="muiBtnEl">Send money</div>
              </div>
            </div>

            <div class="station figma" ref="stFigmaEl">
              <div class="st-label"><span class="dot"></span>FIGMA</div>
              <div class="figma-chrome"><i style="background:var(--orange)"></i><i style="background:var(--purple)"></i><i style="background:var(--green)"></i></div>
              <div class="fig-ui">
                <div class="fig-frame">
                  <span class="fig-handle tl"></span><span class="fig-handle tr"></span><span class="fig-handle bl"></span><span class="fig-handle br"></span>
                  <div style="font-size:14px;font-weight:600;margin-bottom:12px">Portfolio</div>
                  <div style="background:var(--canvas);border:1px solid var(--hairline);border-radius:10px;padding:14px;margin-bottom:0">
                    <div style="font-size:10px;color:var(--muted)">Balance</div>
                    <div style="font-size:20px;font-weight:600;letter-spacing:-.02em">$12,480</div>
                  </div>
                  <div class="fig-btn" ref="figBtnEl">Send money</div>
                </div>
                <svg class="fig-cursor" viewBox="0 0 24 24" fill="var(--ink)"><path d="M5 3l6 16 2.5-6.5L20 10z"/></svg>
              </div>
            </div>

          </div>
        </div>
        <p class="loop-caption reveal">one shared file — read and written by every tool, not re-created at each step</p>
      </div>
    </section>

    <section class="hairtop">
      <div class="wrap">
        <p class="kicker reveal">ONE FILE IN THE MIDDLE</p>
        <h2 class="reveal">Written by anything. <em>Rendered anywhere.</em></h2>
        <p class="lede reveal">The .gui file sits in the middle. Any tool or agent can author it; any platform can render or translate it. Open on both sides — nothing locked coming in, nothing rewritten going out.</p>

        <div class="hub reveal">
          <svg class="hub-lines" viewBox="0 0 1136 480" preserveAspectRatio="none" aria-hidden="true">
            <path d="M196 90 C 330 90, 360 240, 476 240" />
            <path d="M196 190 C 350 190, 400 240, 476 240" />
            <path d="M196 290 C 350 290, 400 240, 476 240" />
            <path d="M196 390 C 330 390, 360 240, 476 240" />
            <path d="M660 240 C 800 240, 810 90, 940 90" />
            <path d="M660 240 C 786 240, 810 190, 940 190" />
            <path d="M660 240 C 786 240, 810 290, 940 290" />
            <path d="M660 240 C 800 240, 810 390, 940 390" />
          </svg>

          <span class="hub-head l">AUTHORED BY</span>
          <span class="hub-head r">RENDERS &amp; TRANSLATES TO</span>

          <div class="hub-node l" style="top:68px"><span class="nd" style="background:var(--green)"></span>AI agents<span class="verb">writes</span></div>
          <div class="hub-node l" style="top:168px"><span class="nd" style="background:var(--orange)"></span>Figma<span class="verb">exports</span></div>
          <div class="hub-node l" style="top:268px"><span class="nd" style="background:var(--blue)"></span>Code editor<span class="verb">edits</span></div>
          <div class="hub-node l" style="top:368px"><span class="nd" style="background:var(--muted)"></span>A text editor<span class="verb">by hand</span></div>

          <div class="hub-center">
            <div class="hc-top"><span class="w">.gui</span></div>
            <div class="hc-file">home.gui</div>
            <div class="hc-code"><span class="t">&lt;col&gt;</span><br>&nbsp;&nbsp;<span class="t">&lt;rect</span> role="button"&gt;<br><span class="t">&lt;/col&gt;</span></div>
          </div>

          <div class="hub-node r" style="top:68px"><span class="nd" style="background:var(--blue)"></span>HTML<span class="verb">renders</span></div>
          <div class="hub-node r" style="top:168px"><span class="nd" style="background:var(--purple)"></span>SwiftUI<span class="verb">translates</span></div>
          <div class="hub-node r" style="top:268px"><span class="nd" style="background:var(--green)"></span>Compose<span class="verb">translates</span></div>
          <div class="hub-node r" style="top:368px"><span class="nd" style="background:var(--muted)"></span>Any renderer<span class="verb">reads</span></div>
        </div>
      </div>
    </section>

    <section class="band band-dark">
      <div class="wrap">
        <p class="kicker reveal" style="color:#6e6a5e">WHY TEXT, NOW</p>
        <h2 class="reveal" style="color:#fafaf7">Pixels can't keep up. Text can.</h2>
        <p class="lede reveal">An interface isn't timeless like a painting — it shifts with every OS, pattern, and framework. A picture can't follow that. A text file can, and so can the models working on it.</p>
        <div class="why-grid reveal">
          <div class="why-card">
            <div class="wn">01</div>
            <h3>Change it by asking</h3>
            <p>Editing a .gui is editing text — precise and instant. No waiting for an agent to re-render a whole screen as a pixel-perfect image and hoping the rest survived.</p>
          </div>
          <div class="why-card">
            <div class="wn">02</div>
            <h3>No model to wait for</h3>
            <p>You're not stuck until the next image model ships. Hand an agent a few .gui examples and it matches your style today — no retraining, no fine-tune.</p>
          </div>
          <div class="why-card">
            <div class="wn">03</div>
            <h3>New frameworks, same file</h3>
            <p>When a platform ships a new look, a new pattern is a new .gui snippet — written down in an afternoon, not waited on through a retrained vision model.</p>
          </div>
          <div class="why-card">
            <div class="wn">04</div>
            <h3>Every file is design knowledge</h3>
            <p>A readable corpus of real interfaces — the craft once locked inside pixels, now text a model, or a teammate, can actually learn from.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker reveal">THE TOOLCHAIN</p>
        <h2 class="reveal">Write it. Check it. Render it anywhere.</h2>
        <div class="pills reveal" style="margin-top:24px">
          <span class="pill" style="background:var(--orange)">AUTHOR</span>
          <span class="pill" style="background:var(--green)">VALIDATE</span>
          <span class="pill" style="background:var(--blue)">RENDER</span>
          <span class="pill" style="background:var(--purple)">SCORE</span>
          <span class="pill" style="background:var(--yellow);color:var(--ink)">SHIP</span>
          <span style="font-family:var(--mono);font-size:11px;color:var(--muted);align-self:center;padding-left:10px">only validate is required</span>
        </div>
        <div class="products">
          <NuxtLink class="prod reveal" to="/cli" style="background:var(--blue);color:#fff">
            <div class="top"><span class="pkg" style="color:#b9cdf5">@dotgui/cli</span><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M7 17L17 7M9 7h8v8"/></svg></div>
            <h3>Your agent writes the file</h3>
            <p style="color:#dce7fb">gui setup teaches your agents the format. The CLI lints, packs, previews. Zero AI inside the tool itself.</p>
          </NuxtLink>
          <NuxtLink class="prod reveal" to="/kit" style="background:var(--yellow);color:var(--ink)">
            <div class="top"><span class="pkg" style="color:#8a6a00">@dotgui/kit</span><svg viewBox="0 0 24 24" fill="none" stroke="#101010" stroke-width="2"><path d="M7 17L17 7M9 7h8v8"/></svg></div>
            <h3>The engine keeps it honest</h3>
            <p style="color:#4a3d08">Parse, validate, render, lint, autofix, score — one deterministic package. A low score is still a valid file.</p>
          </NuxtLink>
          <NuxtLink class="prod reveal" to="/embed" style="background:var(--green);color:#fff">
            <div class="top"><span class="pkg" style="color:#cdebd8">@dotgui/embed</span><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M7 17L17 7M9 7h8v8"/></svg></div>
            <h3>One script renders it</h3>
            <p style="color:#dcf2e4">A CDN script and a gui-embed element render any .gui on any page. The Figma plugin moves files in and out of design tools.</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="hairtop">
      <div class="wrap">
        <p class="kicker reveal">THE LIBRARY</p>
        <h2 class="reveal">The proof is in the files.</h2>
        <div class="plates">
          <div class="plate reveal">
            <div class="canvas" style="background:var(--canvas);border:1px solid var(--hairline)">
              <p style="font-size:13px;font-weight:600;margin-bottom:14px">Portfolio</p>
              <div style="display:flex;gap:8px;align-items:flex-end;height:90px">
                <i style="width:26px;height:42px;background:var(--blue);border-radius:3px"></i>
                <i style="width:26px;height:64px;background:var(--blue);border-radius:3px"></i>
                <i style="width:26px;height:50px;background:var(--blue);border-radius:3px"></i>
                <i style="width:26px;height:88px;background:var(--ink);border-radius:3px"></i>
                <i style="width:26px;height:70px;background:var(--blue);border-radius:3px"></i>
              </div>
              <p style="font-size:11px;font-weight:500;color:var(--green);margin-top:10px">+2.4% today</p>
            </div>
            <div class="cap"><span>stocks.gui</span><b>score 97</b></div>
          </div>
          <div class="plate reveal">
            <div class="canvas" style="background:var(--dark)">
              <i style="display:block;width:118px;height:118px;background:var(--purple);border-radius:9px;margin-bottom:14px"></i>
              <p style="font-size:13px;font-weight:600;color:#fafaf7">Night Drive</p>
              <p style="font-size:11px;color:#8a8578;margin-top:3px">Solar State — 3:42</p>
            </div>
            <div class="cap"><span>player.gui · dark</span><b>score 91</b></div>
          </div>
          <div class="plate reveal">
            <div class="canvas" style="background:var(--canvas);border:1px solid var(--hairline)">
              <p style="font-size:13px;font-weight:600;margin-bottom:12px">Order summary</p>
              <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--body);padding:4px 0"><span>Ceramic mug ×2</span><span style="color:var(--ink)">$36</span></div>
              <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--body);padding:4px 0;border-bottom:1px solid var(--hairline)"><span>Shipping</span><span style="color:var(--ink)">$5</span></div>
              <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;padding:8px 0"><span>Total</span><span>$41</span></div>
              <i style="display:block;width:140px;height:26px;background:var(--orange);border-radius:6px"></i>
            </div>
            <div class="cap"><span>checkout.gui</span><b>score 88</b></div>
          </div>
        </div>
      </div>
    </section>

    <div class="closing">
      <div class="wrap">
        <h2 class="reveal">Design, written down.</h2>
        <p class="mono-sub reveal">open format · deterministic toolchain · yours to keep</p>
        <NuxtLink class="btn-install reveal" to="/cli">npm i -g @dotgui/cli</NuxtLink>
      </div>
    </div>

    <footer class="v3foot">
      <div class="wrap foot-links">
        <span>.gui — the open file format for user interfaces</span>
        <span class="r">
          <NuxtLink to="/spec">spec</NuxtLink><NuxtLink to="/cli">cli</NuxtLink><NuxtLink to="/kit">kit</NuxtLink><NuxtLink to="/embed">embed</NuxtLink><NuxtLink to="/figma">figma</NuxtLink><NuxtLink to="/faq">faq</NuxtLink><a href="/llms.txt">llms.txt</a><a href="https://github.com/dotgui/core" target="_blank" rel="noopener">github</a>
        </span>
      </div>
      <p class="gridhint">these aren't pixels anymore — hover the grid and read them</p>
      <div class="gridwall" ref="gridwallEl">
        <span class="seed" style="left:150px;top:50px;background:var(--purple)"></span>
        <span class="seed" style="left:500px;top:150px;background:var(--blue)"></span>
        <span class="seed" style="left:350px;top:250px;background:var(--yellow)"></span>
        <span class="seed" style="right:250px;top:100px;background:var(--green)"></span>
        <span class="seed" style="right:450px;top:300px;background:var(--orange)"></span>
        <span class="seed" style="right:100px;top:200px;background:var(--blue)"></span>
        <span class="wordmark">.gui<i></i></span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const SITE_URL = 'https://dotgui.org'

usePageSeo({
  path: '/',
  title: '.gui — The open file format for user interfaces',
  description: '.gui is an open, text-based file format for user interfaces. AI agents write it, a deterministic toolchain validates it, and any browser, tool, or design app renders it — one portable file with markup, tokens, fonts, and assets.',
  ogTitle: '.gui — The file format for user interfaces',
  ogDescription: 'Open, text-based, AI-native. Your agent writes the file; the deterministic toolchain keeps it valid; render it anywhere.'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '.gui (dotgui)',
        url: SITE_URL,
        logo: `${SITE_URL}/og.png`,
        sameAs: ['https://github.com/dotgui']
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: '.gui',
        alternateName: 'dotgui',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web, any',
        description: '.gui is an open, text-based file format for user interfaces. A .gui file is a zip package — XML markup plus assets and a preview — that AI agents can read and write, a deterministic toolchain validates, and any browser or design tool renders.',
        url: SITE_URL,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: { '@type': 'Organization', name: '.gui (dotgui)', url: SITE_URL }
      })
    }
  ]
})

// ── hero split: real .gui markup, syntax-highlighted at build time ──
const HERO_SRC = `<gui version="0.2" name="Oscillate — Music Production">
  <tokens>
    <!-- surfaces -->
    <color name="bg"      value="#0D0E10" />
    <color name="surface" value="#131418" />
    <color name="well"    value="#08090B" />
    <!-- accents -->
    <color name="accent"  value="#FFB224" />
    <color name="green"   value="#3DD68C" />
    <!-- track colors -->
    <color name="tr-drums" value="#F2555A" />
    <color name="tr-bass"  value="#9D7BFF" />
    <color name="tr-keys"  value="#4FC1FF" />
    <number name="radius-md" value="8" />
  </tokens>

  <!-- ───────────── Title bar ───────────── -->
  <row role="top-navigation-bar" w="fill" h="46" fill="$surface" border-bottom="1 $hairline">
    <row w="20" h="20" radius="5" fill="$accent" align="middle-center">
      <img src="lucide/audio-waveform.svg" w="12" h="12" />
    </row>
    <text text-style="Brand" value="OSCILLATE" fill="$ink" letter-spacing="8%" />
  </row>

  <col role="sidebar" w="260" h="fill" fill="$surface" p="12" gap="12">
    <text text-style="Tiny" value="BROWSER" fill="$muted" />

    <instance component="comp-track-header" track-name="Drums" track-kind="Audio · Stereo"
      accent="$tr-drums" icon="lucide/drum.svg" />
    <instance component="comp-track-header" track-name="Bass" track-kind="MIDI · Moog Sub 37"
      accent="$tr-bass" icon="lucide/audio-waveform.svg" />
    <instance component="comp-track-header" track-name="Keys" track-kind="MIDI · Juno-60"
      accent="$tr-keys" icon="lucide/piano.svg" />
  </col>
</gui>`

const heroCodeHtml = HERO_SRC.trim().split('\n').map((line) => {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const c = line.match(/^(\s*)(<!--[\s\S]*?-->)\s*$/)
  if (c) return c[1] + '<span class="c">' + esc(c[2]) + '</span>'
  const e = esc(line)
    .replace(/"([^"]*)"/g, '$1')                          // stash values
    .replace(/([\w-]+)=/g, '<span class="a">$1</span>=')              // attr names
    .replace(/&lt;(\/?)([\w-]+)/g, '&lt;$1<span class="t">$2</span>') // tags
    .replace(/&lt;|\/&gt;|&gt;/g, (m) => '<span class="p">' + m + '</span>')
  return e.replace(/([^]*)/g, '<span class="v">"$1"</span>')
}).join('\n')

const herofigEl = ref<HTMLElement | null>(null)
const hfHandleEl = ref<HTMLElement | null>(null)
const fillEl = ref<HTMLElement | null>(null)
const guiProfilesEl = ref<HTMLElement | null>(null)
const gpGEl = ref<HTMLElement | null>(null)
const filechipEl = ref<HTMLElement | null>(null)
const stAgentEl = ref<HTMLElement | null>(null)
const stBrowserEl = ref<HTMLElement | null>(null)
const stFigmaEl = ref<HTMLElement | null>(null)
const muiBtnEl = ref<HTMLElement | null>(null)
const figBtnEl = ref<HTMLElement | null>(null)
const gridwallEl = ref<HTMLElement | null>(null)

onMounted(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const cleanups: Array<() => void> = []

  // ── reveal on scroll ──
  const revealIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target) }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
  document.querySelectorAll('.home-v3 .reveal').forEach(el => revealIO.observe(el))
  cleanups.push(() => revealIO.disconnect())

  // ── hero split: drag / click to skim between markup and pixels ──
  const fig = herofigEl.value
  const handle = hfHandleEl.value
  if (fig && handle) {
    let dragging = false
    const codeTag = fig.querySelector('.hf-tag.code') as HTMLElement | null
    const pixTag = fig.querySelector('.hf-tag.pix') as HTMLElement | null
    const setFromX = (clientX: number) => {
      const r = fig.getBoundingClientRect()
      const p = Math.max(9, Math.min(91, ((clientX - r.left) / r.width) * 100))
      fig.style.setProperty('--split', p.toFixed(2) + '%')
      if (codeTag) codeTag.style.opacity = p < 20 ? '0' : '1'
      if (pixTag) pixTag.style.opacity = p > 80 ? '0' : '1'
    }
    const onDown = (e: PointerEvent) => { dragging = true; handle.setPointerCapture(e.pointerId); e.preventDefault() }
    const onMove = (e: PointerEvent) => { if (dragging) setFromX(e.clientX) }
    const onUp = () => { dragging = false }
    const onFigDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('.hf-handle') && !t.closest('.hf-bar')) setFromX(e.clientX)
    }
    handle.addEventListener('pointerdown', onDown)
    handle.addEventListener('pointermove', onMove)
    handle.addEventListener('pointerup', onUp)
    fig.addEventListener('pointerdown', onFigDown)
    cleanups.push(() => {
      handle.removeEventListener('pointerdown', onDown)
      handle.removeEventListener('pointermove', onMove)
      handle.removeEventListener('pointerup', onUp)
      fig.removeEventListener('pointerdown', onFigDown)
    })
  }

  // ── statement: fill words in as the section scrolls through ──
  const fill = fillEl.value
  if (fill && !reduced) {
    const words = [...fill.querySelectorAll('span')]
    let ticking = false
    const paint = () => {
      ticking = false
      const r = fill.getBoundingClientRect()
      const vh = innerHeight
      const p = Math.max(0, Math.min(1, (vh * 0.82 - r.top) / (vh * 0.62)))
      const n = Math.round(p * words.length)
      words.forEach((w, i) => w.classList.toggle('lit', i < n))
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint) } }
    addEventListener('scroll', onScroll, { passive: true })
    cleanups.push(() => removeEventListener('scroll', onScroll))
    paint()
  } else if (fill) {
    fill.querySelectorAll('span').forEach(s => s.classList.add('lit'))
  }

  // ── what does GUI stand for: profile-driven auto meaning ──
  const sec = guiProfilesEl.value
  const g = gpGEl.value
  if (sec && g) {
    const cursors = [...sec.querySelectorAll('.gp-cursor')]
    const roles = [...sec.querySelectorAll('.gp-role')]
    const copies = [...sec.querySelectorAll('.gp-copy span')]
    const stage = sec.querySelector('.gp-stage') as HTMLElement
    const accents = ['var(--blue)', 'var(--orange)', 'var(--green)', 'var(--purple)']
    let idx = 0
    let timer: ReturnType<typeof setInterval> | null = null
    let clickTimers: Array<ReturnType<typeof setTimeout>> = []

    const clearClickTimers = () => { clickTimers.forEach(t => clearTimeout(t)); clickTimers = [] }
    const setMeaning = (next: number) => {
      idx = (next + cursors.length) % cursors.length
      stage.style.setProperty('--gp-index', String(idx))
      stage.style.setProperty('--gp-accent', accents[idx])
      roles.forEach((role, i) => role.classList.toggle('active', i === idx))
      copies.forEach((copy, i) => copy.classList.toggle('active', i === idx))
    }
    const show = (next: number, shouldClick = true) => {
      clearClickTimers()
      setMeaning(next)
      cursors.forEach((cursor, i) => {
        cursor.classList.toggle('active', i === idx)
        cursor.classList.remove('clicking')
        ;(cursor as HTMLElement).style.transform = ''
      })
      g.classList.remove('pop')
      stage.classList.remove('selecting')
      if (!shouldClick) {
        cursors.forEach(cursor => cursor.classList.remove('active'))
        return
      }
      clickTimers.push(setTimeout(() => {
        cursors[idx]?.classList.add('clicking')
        g.classList.add('pop')
        stage.classList.add('selecting')
      }, 650))
      clickTimers.push(setTimeout(() => {
        cursors[idx]?.classList.remove('clicking')
        cursors[idx]?.classList.remove('active')
        g.classList.remove('pop')
        stage.classList.remove('selecting')
      }, 980))
    }
    const start = () => { if (reduced || timer) return; timer = setInterval(() => show(idx + 1), 2200) }
    const stop = () => { if (!timer) return; clearInterval(timer); timer = null }
    cursors.forEach((cursor, i) => {
      cursor.addEventListener('click', () => { stop(); show(i, true); start() })
    })
    show(0)
    start()
    cleanups.push(() => { stop(); clearClickTimers() })
  }

  // ── the portability loop ──
  const chip = filechipEl.value
  const agent = stAgentEl.value
  const browser = stBrowserEl.value
  const figma = stFigmaEl.value
  const muiBtn = muiBtnEl.value
  if (chip && agent && browser && figma && muiBtn) {
    const stations = [agent, browser, figma]
    const centerPct = (el: HTMLElement) => {
      const stage = el.closest('.stage') as HTMLElement
      const r = el.getBoundingClientRect(), sr = stage.getBoundingClientRect()
      return ((r.left + r.width / 2 - sr.left) / sr.width) * 100
    }
    const activate = (el: HTMLElement) => stations.forEach(s => s.classList.toggle('active', s === el))
    const hop = (toEl: HTMLElement) => {
      chip.classList.remove('hop'); void chip.offsetWidth; chip.classList.add('hop')
      chip.style.left = centerPct(toEl) + '%'
    }
    const timeline: Array<() => void> = [
      () => { activate(agent); chip.style.left = centerPct(agent) + '%'; agent.classList.add('writing') },
      () => { hop(browser) },
      () => { activate(browser); browser.classList.add('built') },
      () => { hop(figma) },
      () => { activate(figma); figma.classList.add('built'); setTimeout(() => figma.classList.add('selected'), 500) },
      () => { figma.classList.add('edited'); muiBtn.style.background = 'var(--orange)' },
      () => { hop(agent) },
      () => { activate(agent); agent.classList.add('edited') },
      () => {
        figma.classList.remove('built', 'selected', 'edited')
        browser.classList.remove('built')
        agent.classList.remove('edited', 'writing')
        muiBtn.style.background = 'var(--blue)'
        chip.style.left = centerPct(agent) + '%'
      }
    ]
    let loopTimer: ReturnType<typeof setTimeout> | null = null
    const runLoop = () => {
      let i = 0
      const delays = [1500, 900, 1400, 900, 1600, 1400, 900, 1500, 700]
      const tick = () => {
        timeline[i]()
        const d = delays[i]
        i = (i + 1) % timeline.length
        loopTimer = setTimeout(tick, d)
      }
      tick()
    }
    if (reduced) {
      activate(browser); browser.classList.add('built'); figma.classList.add('built', 'selected')
      agent.classList.add('writing'); chip.style.opacity = '0'
    } else {
      const stageEl = document.querySelector('.home-v3 .stage') as HTMLElement
      const stageIO = new IntersectionObserver((es, obs) => {
        if (es[0].isIntersecting) { runLoop(); obs.disconnect() }
      }, { threshold: 0.35 })
      stageIO.observe(stageEl)
      cleanups.push(() => stageIO.disconnect())
    }
    cleanups.push(() => { if (loopTimer) clearTimeout(loopTimer) })
  }

  // ── pixel grid finale ──
  const wall = gridwallEl.value
  if (wall) {
    const CELL = 50
    const tokens = ['<col>', '<row>', '<rect>', '<text>', '<img>', '<grid>', '<frame>', '</col>', '</row>', 'gap', 'role', 'w', 'h', 'p', 'radius', 'fill', 'align', 'mode']
    const colors = ['var(--blue)', 'var(--yellow)', 'var(--orange)', 'var(--green)', 'var(--purple)']
    const buildGrid = () => {
      wall.querySelectorAll('.gridcell,.hovercell').forEach(n => n.remove())
      const cols = Math.ceil(wall.clientWidth / CELL), rows = Math.ceil(wall.clientHeight / CELL)
      const frag = document.createDocumentFragment()
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const d = document.createElement('span'); d.className = 'gridcell'
        d.style.left = (c * CELL) + 'px'; d.style.top = (r * CELL) + 'px'; frag.appendChild(d)
      }
      wall.appendChild(frag)
    }
    buildGrid()
    addEventListener('resize', buildGrid)
    cleanups.push(() => removeEventListener('resize', buildGrid))
    let last: string | null = null
    const onMove = (e: MouseEvent) => {
      const rect = wall.getBoundingClientRect()
      const c = Math.floor((e.clientX - rect.left) / CELL), r = Math.floor((e.clientY - rect.top) / CELL)
      const key = c + ',' + r; if (key === last) return; last = key
      const h = document.createElement('span'); h.className = 'hovercell'
      h.style.left = (c * CELL) + 'px'; h.style.top = (r * CELL) + 'px'
      const col = colors[Math.floor(Math.random() * colors.length)]
      h.textContent = tokens[Math.floor(Math.random() * tokens.length)]
      h.style.color = col; h.style.background = 'color-mix(in srgb, ' + col + ' 12%, transparent)'
      wall.appendChild(h)
      requestAnimationFrame(() => h.classList.add('show'))
      setTimeout(() => { h.classList.remove('show'); setTimeout(() => h.remove(), 600) }, 900)
    }
    wall.addEventListener('mousemove', onMove)
    cleanups.push(() => wall.removeEventListener('mousemove', onMove))
  }

  onBeforeUnmount(() => cleanups.forEach(fn => fn()))
})
</script>

<style scoped>
.home-v3 {
  --canvas: #fafaf7;
  --card: #ffffff;
  --ink: #101010;
  --body: #4a4a44;
  --muted: #8a867c;
  --hairline: #e8e6df;
  --dark: #0e0e0c;
  --term-green: #7ee29b;
  --blue: #2b6be4;
  --yellow: #f2b300;
  --orange: #ee5f1c;
  --green: #3ea45c;
  --purple: #9d5bea;
  --purple-soft: #c9b2f5;
  --display: "Bricolage Grotesque", "Inter", sans-serif;
  --sans: "Inter", -apple-system, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;

  background: var(--canvas);
  color: var(--ink);
  font-family: var(--sans);
}
.wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px; }

.reveal { opacity: 0; transform: translateY(24px); transition: opacity 700ms cubic-bezier(.23,1,.32,1), transform 700ms cubic-bezier(.23,1,.32,1); }
.reveal.in { opacity: 1; transform: none; }

/* hero */
.hero { text-align: center; padding: 96px 0 76px; }
.eyebrow { font-family: var(--mono); font-size: 12px; letter-spacing: .09em; color: var(--muted); }
.hero h1 { font-family: var(--display); font-size: clamp(52px, 6.8vw, 86px); font-weight: 600; line-height: 1.02; letter-spacing: -0.035em; margin: 24px auto 22px; max-width: 940px; }
.hero .sub { font-size: 17px; line-height: 1.65; color: var(--body); max-width: 620px; margin: 0 auto 30px; }
.cta-row { display: flex; gap: 14px; justify-content: center; align-items: center; }
.btn-install { display: inline-flex; align-items: center; gap: 9px; background: var(--ink); color: #fff; font-family: var(--mono); font-size: 13.5px; border-radius: 999px; padding: 13px 24px; text-decoration: none; }
.btn-install:hover { background: #2a2a26; }
.btn-install svg { width: 17px; height: 17px; fill: currentColor; }
.btn-ghost { border: 1.5px solid var(--ink); color: var(--ink); border-radius: 999px; padding: 12.5px 26px; font-size: 14px; font-weight: 500; text-decoration: none; }

/* hero — floating formats field */
/* hero — the file that is also a picture (drag-to-skim split) */
.herofig { --split: 44%; position: relative; max-width: 1000px; margin: 52px auto 16px; border-radius: 16px; overflow: hidden; border: 1px solid var(--hairline); box-shadow: 0 44px 110px -34px rgba(16,16,16,.36), 0 8px 24px rgba(16,16,16,.10); background: #0c0e10; aspect-ratio: 1440 / 900; touch-action: none; user-select: none; }
.hf-bar { position: absolute; inset: 0 0 auto 0; height: 40px; z-index: 7; display: flex; align-items: center; gap: 8px; padding: 0 15px; background: rgba(12,14,16,.72); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,.07); }
.hf-bar i { width: 11px; height: 11px; border-radius: 50%; }
.hf-name { margin-left: 8px; font-family: var(--mono); font-size: 12.5px; color: #b9c0bc; }
.hf-name b { color: #fff; font-weight: 600; }
.hf-render { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top left; }
.hf-code { position: absolute; inset: 0; clip-path: inset(0 calc(100% - var(--split)) 0 0); background: #0c0e10; padding: 54px 0 0 34px; overflow: hidden; }
.hf-code pre { margin: 0; font-family: var(--mono); font-size: 12.5px; line-height: 1.62; color: #c3ccc6; white-space: pre; text-align: left; }
.hf-code :deep(.t) { color: #6ea8fe; }
.hf-code :deep(.a) { color: #e8a765; }
.hf-code :deep(.v) { color: #7ec98a; }
.hf-code :deep(.p) { color: #5f726a; }
.hf-code :deep(.c) { color: #6f8378; font-style: italic; }
.hf-handle { position: absolute; top: 40px; bottom: 0; left: var(--split); width: 2px; transform: translateX(-1px); z-index: 6; background: linear-gradient(#3DD68C, #4FC1FF); cursor: ew-resize; box-shadow: 0 0 12px rgba(61,214,140,.5); }
.hf-grip { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; border-radius: 50%; background: rgba(12,14,16,.9); border: 1px solid rgba(255,255,255,.28); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 22px rgba(0,0,0,.5); }
.hf-grip svg { width: 20px; height: 20px; stroke: #fff; }
.hf-tag { position: absolute; bottom: 22px; z-index: 6; font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: .03em; padding: 6px 11px; border-radius: 999px; backdrop-filter: blur(6px); pointer-events: none; transition: opacity 200ms ease; }
.hf-tag.code { left: 26px; background: rgba(12,14,16,.62); color: #7ec98a; border: 1px solid rgba(126,201,138,.32); }
.hf-tag.pix { right: 26px; background: rgba(255,255,255,.88); color: var(--ink); border: 1px solid rgba(16,16,16,.1); }
.fmt-cap { text-align: center; font-family: var(--mono); font-size: 12px; color: var(--muted); margin-top: 2px; }
@media (max-width: 720px) {
  .hf-code { padding-left: 20px; }
  .hf-code pre { font-size: 9.5px; line-height: 1.6; }
}

/* the statement — huge type that fills in on scroll */
.statement { border-top: 1px solid var(--hairline); padding: 22vh 0; }
.statement .fill { font-family: var(--display); font-weight: 600; font-size: clamp(32px, 5vw, 66px); line-height: 1.16; letter-spacing: -0.03em; max-width: 1000px; }
.statement .fill span { color: #dcd9d0; transition: color 260ms ease; }
.statement .fill span.lit { color: var(--ink); }
.statement .fill span.gui.lit { color: var(--blue); }
@media (prefers-reduced-motion: reduce) { .statement .fill span { color: var(--ink); } }

/* what does GUI stand for — collaborative cursor study */
.gui-profiles { border-top: 1px solid var(--hairline); background: var(--canvas); padding: 104px 0 112px; overflow: hidden; }
.gp-shell { max-width: 1120px; margin: 0 auto; padding: 0 32px; }
.gp-head { max-width: 620px; margin-bottom: 46px; }
.gp-head h2 { max-width: 560px; }
.gp-stage { --gp-accent: var(--blue); position: relative; min-height: 500px; display: grid; place-items: center; }
.gp-wordmark { position: relative; display: flex; align-items: baseline; justify-content: center; gap: .015em; font-family: var(--display); font-size: clamp(72px, 13vw, 158px); font-weight: 700; line-height: .86; letter-spacing: -.07em; color: var(--ink); transform: translateY(-26px); }
.gp-g::before { content: ""; position: absolute; inset: -.08em -.1em -.04em -.08em; border: 1.5px solid var(--gp-accent); border-radius: 5px; opacity: 0; transform: scale(.985); transition: opacity 160ms ease, transform 180ms ease, border-color 360ms ease; pointer-events: none; }
.gp-g::after { content: ""; position: absolute; inset: -.08em -.1em -.04em -.08em; opacity: 0; transform: scale(.985); transition: opacity 160ms ease, transform 180ms ease; pointer-events: none; background:
  linear-gradient(var(--gp-accent), var(--gp-accent)) left top / 8px 8px no-repeat,
  linear-gradient(var(--gp-accent), var(--gp-accent)) right top / 8px 8px no-repeat,
  linear-gradient(var(--gp-accent), var(--gp-accent)) left bottom / 8px 8px no-repeat,
  linear-gradient(var(--gp-accent), var(--gp-accent)) right bottom / 8px 8px no-repeat; }
.gp-stage.selecting .gp-g::before,
.gp-stage.selecting .gp-g::after { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .gp-cursor { animation: none; } }
.gp-g { position: relative; display: inline-block; color: var(--gp-accent); transition: color 360ms ease, transform 180ms ease; }
.gp-g.pop { transform: translateY(-.015em) scale(1.025); }
.gp-dot { width: .12em; height: .12em; margin-left: .045em; border-radius: .025em; background: var(--gp-accent); transition: background 360ms ease; }
.gp-cursor { position: absolute; left: 50%; top: 50%; z-index: 4; display: flex; align-items: flex-start; gap: 7px; opacity: .82; transform: translate(var(--rest-x), var(--rest-y)); transition: transform 760ms cubic-bezier(.2,.8,.2,1), opacity 220ms ease; cursor: pointer; animation: gp-drift var(--drift, 5.8s) ease-in-out infinite; animation-delay: var(--delay, 0s); }
.gp-cursor.active { opacity: 1; transform: translate(var(--to-x), var(--to-y)); animation: none; pointer-events: none; }
.gp-cursor.clicking { transform: translate(var(--to-x), var(--to-y)) scale(.96); }
@keyframes gp-drift { 0%,100% { margin-left: 0; margin-top: 0; } 35% { margin-left: var(--float-x, 12px); margin-top: var(--float-y, -10px); } 70% { margin-left: calc(var(--float-x, 12px) * -.65); margin-top: calc(var(--float-y, -10px) * -.55); } }
.gp-pointer { position: relative; width: 18px; height: 22px; filter: drop-shadow(0 2px 2px rgba(16,16,16,.18)); transform: rotate(-8deg); transform-origin: 4px 4px; }
.gp-pointer::before { content: ""; position: absolute; left: 1px; top: 0; width: 15px; height: 20px; background: var(--gp-color); clip-path: polygon(0 0, 0 19px, 5px 14px, 8px 21px, 12px 19px, 9px 12px, 16px 12px); }
.gp-pointer::after { content: ""; position: absolute; left: 3px; top: 3px; width: 9px; height: 12px; background: #fff; opacity: .22; clip-path: polygon(0 0, 0 12px, 3px 9px, 6px 13px, 8px 12px, 5px 7px, 10px 7px); }
.gp-name { border-radius: 999px; background: var(--gp-color); color: #fff; font: 600 11px/1 var(--mono); letter-spacing: .02em; padding: 7px 10px; box-shadow: 0 10px 28px rgba(16,16,16,.12); white-space: nowrap; transform: translate(6px, -12px); }
.gp-meaning { position: absolute; left: 50%; bottom: 46px; transform: translateX(-50%); width: min(92%, 600px); text-align: center; }
.gp-line { position: relative; min-height: 32px; }
.gp-role { position: absolute; inset: 0; opacity: 0; transform: translateY(8px); color: var(--ink); font-family: var(--display); font-size: clamp(20px, 2.5vw, 30px); font-weight: 600; letter-spacing: -.02em; transition: opacity 320ms ease, transform 360ms ease; }
.gp-role.active { opacity: 1; transform: none; }
.gp-copy { position: relative; min-height: 46px; margin-top: 10px; }
.gp-copy span { position: absolute; inset: 0; opacity: 0; transform: translateY(8px); color: var(--body); font-size: clamp(13.5px, 1.2vw, 15.5px); line-height: 1.55; transition: opacity 320ms ease, transform 360ms ease; }
.gp-copy span.active { opacity: 1; transform: none; }
@media (max-width: 900px) {
  .gui-profiles { padding: 86px 0 94px; }
  .gp-shell { padding: 0 20px; }
  .gp-head { display: block; text-align: center; margin-bottom: 36px; }
  .gp-head h2 { margin: 0 auto; }
  .gp-stage { min-height: 440px; }
  .gp-wordmark { font-size: clamp(66px, 22vw, 112px); transform: translateY(-34px); }
  .gp-cursor { display: none; }
  .gp-meaning { bottom: 34px; }
}

/* section shell */
section { padding: 92px 0; border-top: none; }
.hairtop { border-top: 1px solid var(--hairline); }
.kicker { font-family: var(--mono); font-size: 11.5px; letter-spacing: .08em; color: var(--muted); margin-bottom: 12px; }
h2 { font-family: var(--display); font-size: clamp(32px, 3.6vw, 48px); font-weight: 600; line-height: 1.08; letter-spacing: -0.025em; }
.lede { font-size: 17px; line-height: 1.6; color: var(--body); max-width: 640px; margin-top: 16px; }

/* ── THE LOOP — hero animated moment ── */
.loop { border-top: 1px solid var(--hairline); }
.loop .head { text-align: center; margin-bottom: 12px; }
.loop .head .kicker { margin-bottom: 14px; }
.loop .head h2 { max-width: 720px; margin: 0 auto; }
.loop .head .lede { margin: 16px auto 0; text-align: center; }

.stage { position: relative; height: 470px; margin-top: 20px; }
.rail { position: absolute; left: 40px; right: 40px; top: 52px; height: 2px; background: repeating-linear-gradient(90deg, var(--hairline) 0 8px, transparent 8px 16px); }
.filechip { position: absolute; top: 38px; left: 16%; transform: translateX(-50%); display: flex; align-items: center; gap: 7px; background: var(--ink); color: #fff; font-family: var(--mono); font-size: 12px; padding: 7px 14px; border-radius: 999px; z-index: 5; transition: left 850ms cubic-bezier(.7,0,.25,1); box-shadow: 0 6px 20px rgba(16,16,16,.18); }
.filechip svg { width: 13px; height: 13px; }
.filechip.hop { animation: chiplift 850ms cubic-bezier(.7,0,.25,1); }
@keyframes chiplift { 0%,100% { top: 38px; } 50% { top: 20px; } }

.stations { position: absolute; top: 96px; left: 0; right: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; padding: 0 40px; }
.station { background: var(--card); border: 1px solid var(--hairline); border-radius: 16px; padding: 18px; height: 330px; position: relative; overflow: hidden; transition: border-color 400ms, box-shadow 400ms, transform 400ms; }
.station .st-label { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 11px; color: var(--muted); margin-bottom: 14px; }
.station .st-label .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--hairline); transition: background 400ms; }
.station.active { border-color: var(--ink); box-shadow: 0 14px 40px rgba(16,16,16,.10); transform: translateY(-3px); }
.station.active .st-label { color: var(--ink); }
.station.agent.active .dot { background: var(--term-green); }
.station.browser.active .dot { background: var(--blue); }
.station.figma.active .dot { background: var(--orange); }

/* agent station */
.station.agent { background: #151512; border-color: #2a2a24; }
.station.agent .st-label { color: #8a857a; }
.station.agent.active { border-color: var(--term-green); box-shadow: 0 14px 40px rgba(0,0,0,.35); }
.agent-body { font-family: var(--mono); font-size: 11px; line-height: 1.95; }
.agent-body .prompt { color: #8a857a; margin-bottom: 8px; }
.agent-body .ln { color: #b8b4a6; opacity: 0; transform: translateY(4px); transition: opacity 300ms, transform 300ms; }
.agent-body .ln .tag { color: var(--term-green); background: none; padding: 0; border-radius: 0; font-size: inherit; font-family: inherit; }
.agent-body .ln .swatch { display: inline-block; width: 9px; height: 9px; border-radius: 2px; vertical-align: -1px; margin-right: 3px; background: var(--blue); transition: background 500ms; }
.station.agent.writing .ln { opacity: 1; transform: none; }
.station.agent.writing .ln:nth-child(2) { transition-delay: 120ms; }
.station.agent.writing .ln:nth-child(3) { transition-delay: 240ms; }
.station.agent.writing .ln:nth-child(4) { transition-delay: 360ms; }
.station.agent.writing .ln:nth-child(5) { transition-delay: 480ms; }
.station.agent.edited .swatch { background: var(--orange); }
.station.agent.edited .hexval { color: var(--orange); }

/* browser station */
.browser-chrome { display: flex; gap: 5px; margin-bottom: 12px; }
.browser-chrome i { width: 9px; height: 9px; border-radius: 50%; background: var(--hairline); }
.mini-ui { opacity: 0; transition: opacity 500ms; }
.station.browser.built .mini-ui { opacity: 1; }
.mini-ui > * { opacity: 0; transform: translateY(8px) scale(.98); transition: opacity 450ms cubic-bezier(.23,1,.32,1), transform 450ms cubic-bezier(.23,1,.32,1); }
.station.browser.built .mini-ui > * { opacity: 1; transform: none; }
.station.browser.built .mini-ui > *:nth-child(2) { transition-delay: 120ms; }
.station.browser.built .mini-ui > *:nth-child(3) { transition-delay: 240ms; }
.mui-title { font-size: 14px; font-weight: 600; margin-bottom: 12px; }
.mui-card { background: var(--canvas); border: 1px solid var(--hairline); border-radius: 10px; padding: 14px; margin-bottom: 12px; }
.mui-card .lab { font-size: 10px; color: var(--muted); }
.mui-card .val { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
.mui-btn { background: var(--blue); color: #fff; font-size: 12px; font-weight: 500; text-align: center; border-radius: 8px; padding: 11px 0; transition: background 500ms; }

/* figma station */
.figma-chrome { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
.figma-chrome i { width: 8px; height: 8px; border-radius: 2px; }
.fig-ui { position: relative; opacity: 0; transition: opacity 500ms; }
.station.figma.built .fig-ui { opacity: 1; }
.fig-frame { border: 1px solid var(--hairline); border-radius: 10px; padding: 14px; position: relative; }
.station.figma.selected .fig-frame { outline: 2px solid var(--blue); outline-offset: 2px; transition: outline-color 400ms; }
.station.figma.edited .fig-frame { outline-color: var(--orange); }
.fig-handle { position: absolute; width: 7px; height: 7px; background: #fff; border: 1.5px solid var(--blue); border-radius: 1px; opacity: 0; transition: opacity 300ms, border-color 400ms; }
.station.figma.selected .fig-handle { opacity: 1; }
.station.figma.edited .fig-handle { border-color: var(--orange); }
.fig-handle.tl { left: -4px; top: -4px; } .fig-handle.tr { right: -4px; top: -4px; }
.fig-handle.bl { left: -4px; bottom: -4px; } .fig-handle.br { right: -4px; bottom: -4px; }
.fig-btn { background: var(--blue); color: #fff; font-size: 12px; font-weight: 500; text-align: center; border-radius: 8px; padding: 11px 0; margin-top: 10px; transition: background 500ms; }
.station.figma.edited .fig-btn { background: var(--orange); }
.fig-cursor { position: absolute; right: 30px; bottom: 44px; width: 18px; height: 18px; opacity: 0; transition: opacity 300ms; }
.station.figma.selected .fig-cursor { opacity: 1; }

.loop-caption { text-align: center; font-family: var(--mono); font-size: 11.5px; color: var(--muted); margin-top: 26px; }

/* ── imagine bands ── */
.band { padding: 100px 0; }
.band .kicker { color: inherit; opacity: .7; }
.band-purple { background: var(--purple-soft); }
.band-purple .lede { color: #3a3050; }
.band-dark { background: var(--dark); color: #fafaf7; }
.band-dark .lede { color: #a8a498; }
.band h2 em { font-style: normal; }

/* platform hub diagram */
.hub { position: relative; height: 480px; margin-top: 48px; }
.hub-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; overflow: visible; }
.hub-lines path { fill: none; stroke: #d8d5cc; stroke-width: 1.5; stroke-dasharray: 4 7; animation: hubflow 1.3s linear infinite; }
@keyframes hubflow { to { stroke-dashoffset: -22; } }
.hub-head { position: absolute; top: 8px; font-family: var(--mono); font-size: 11px; letter-spacing: .06em; color: var(--muted); z-index: 2; }
.hub-head.l { left: 2px; } .hub-head.r { right: 2px; text-align: right; }
.hub-node { position: absolute; width: 190px; display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--hairline); border-radius: 12px; padding: 11px 15px; font-size: 13.5px; color: var(--ink); z-index: 2; }
.hub-node.l { left: 0; } .hub-node.r { right: 0; }
.hub-node .nd { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.hub-node .verb { margin-left: auto; font-family: var(--mono); font-size: 10px; color: var(--muted); }
.hub-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 188px; z-index: 3; background: var(--card); border: 2px solid var(--ink); border-radius: 16px; padding: 16px; box-shadow: 0 18px 50px rgba(16,16,16,.13); }
.hub-center .hc-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.hub-center .hc-top .w { font-family: var(--display); font-weight: 700; font-size: 22px; letter-spacing: -.02em; color: var(--blue); }
.hub-center .hc-file { font-family: var(--mono); font-size: 11px; color: var(--muted); margin-bottom: 10px; }
.hub-center .hc-code { font-family: var(--mono); font-size: 10px; line-height: 1.8; color: var(--body); }
.hub-center .hc-code .t { color: var(--blue); }

/* readable band */
.why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 44px; }
.why-card { background: #17161200; border: 1px solid #2a2a24; border-radius: 16px; padding: 22px; }
.why-card .wn { font-family: var(--mono); font-size: 11px; color: var(--term-green); margin-bottom: 14px; }
.why-card h3 { font-family: var(--display); font-size: 18px; font-weight: 600; letter-spacing: -0.01em; color: #fafaf7; margin-bottom: 8px; }
.why-card p { font-size: 13.5px; line-height: 1.62; color: #9a968b; }
@media (max-width: 900px) { .why-grid { grid-template-columns: 1fr; } }

/* toolchain */
.pills { display: flex; gap: 8px; flex-wrap: wrap; }
.pill { font-family: var(--mono); font-size: 10.5px; font-weight: 500; letter-spacing: .09em; border-radius: 999px; padding: 9px 16px; color: #fff; }
.products { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 44px; }
.prod { border-radius: 16px; padding: 26px; min-height: 300px; display: flex; flex-direction: column; text-decoration: none; transition: transform 300ms cubic-bezier(.23,1,.32,1); }
.prod:hover { transform: translateY(-4px); }
.prod .top { display: flex; justify-content: space-between; align-items: flex-start; }
.prod .top .pkg { font-family: var(--mono); font-size: 12px; }
.prod .top svg { width: 22px; height: 22px; }
.prod h3 { font-family: var(--display); font-size: 20px; font-weight: 600; letter-spacing: -0.01em; margin: auto 0 10px; padding-top: 90px; }
.prod p { font-size: 13.5px; line-height: 1.65; }

/* gallery */
.plates { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 44px; }
.plate { background: var(--card); border: 1px solid var(--hairline); border-radius: 16px; padding: 14px 14px 12px; }
.plate .canvas { height: 195px; border-radius: 10px; padding: 16px; overflow: hidden; }
.plate .cap { display: flex; justify-content: space-between; font-family: var(--mono); font-size: 11px; color: var(--muted); margin-top: 12px; }
.plate .cap b { font-weight: 400; color: var(--ink); }

/* closing + grid finale */
.closing { text-align: center; padding: 120px 0 76px; border-top: 1px solid var(--hairline); }
.closing h2 { font-size: clamp(44px, 5vw, 66px); }
.closing .mono-sub { font-family: var(--mono); font-size: 12px; color: var(--muted); margin: 18px 0 26px; }
.v3foot { padding: 30px 0 0; overflow: hidden; }
.foot-links { display: flex; justify-content: space-between; align-items: center; padding-bottom: 22px; font-size: 13.5px; color: var(--body); }
.foot-links .r { display: flex; gap: 22px; }
.foot-links a { font-family: var(--mono); font-size: 12px; color: var(--muted); text-decoration: none; }
.gridhint { font-family: var(--mono); font-size: 11px; color: var(--muted); text-align: center; padding: 14px 0 10px; }
.gridwall { position: relative; height: 400px; border-top: 1px solid var(--hairline); cursor: crosshair; }
.gridwall :deep(.gridcell) { position: absolute; width: 50px; height: 50px; border-right: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline); }
.gridwall .seed { position: absolute; width: 50px; height: 50px; }
.gridwall .wordmark { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -52%); font-family: var(--display); font-weight: 700; font-size: clamp(150px, 20vw, 280px); letter-spacing: -0.05em; color: var(--ink); line-height: 1; pointer-events: none; }
.gridwall .wordmark i { display: inline-block; width: .13em; height: .13em; background: var(--orange); border-radius: .028em; font-style: normal; margin-left: .05em; }
.gridwall :deep(.hovercell) { position: absolute; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 9px; pointer-events: none; opacity: 0; transition: opacity 500ms; white-space: nowrap; z-index: 2; }
.gridwall :deep(.hovercell.show) { opacity: 1; transition: opacity 80ms; }

@media (max-width: 900px) {
  .products, .plates { grid-template-columns: 1fr; }
  .stations { grid-template-columns: 1fr; height: auto; position: static; padding: 0; }
  .stage { height: auto; }
  .rail, .filechip { display: none; }
  .station { height: auto; min-height: 200px; margin-bottom: 16px; }
  .hub { height: auto; }
  .hub-lines { display: none; }
  .hub-head { position: static; display: block; margin: 4px 0 10px; }
  .hub-node, .hub-center { position: static; width: 100%; transform: none; margin-bottom: 10px; box-shadow: none; }
  .hub-center { margin: 16px 0; }
}
</style>

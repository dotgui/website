<template>
  <section id="render">
    <div data-reveal>
      <div class="section-label">Renderer</div>
      <h2>@dotgui/kit/render</h2>
      <p>
        A standalone TypeScript library that takes a <code>.gui</code> document string and renders it
        into a live container element. It handles layout, fonts, images, shapes, gradients, effects 
        everything the format describes.
      </p>
    </div>

    <CodeBlock filename="app.ts" lang="TypeScript"><span class="tok-comment">// render a .gui document into any container</span>
<span class="tok-tag">import</span> <span class="tok-punct">{</span> render <span class="tok-punct">}</span> <span class="tok-attr">from</span> <span class="tok-str">'@dotgui/kit/render'</span>

<span class="tok-tag">const</span> setZoom <span class="tok-punct">=</span> render<span class="tok-punct">(</span>guiCode<span class="tok-punct">,</span> containerEl<span class="tok-punct">)</span>

setZoom<span class="tok-punct">?.(</span><span class="tok-val">1</span><span class="tok-punct">)</span>   <span class="tok-comment">// fit to container</span>
setZoom<span class="tok-punct">?.(</span><span class="tok-val">2</span><span class="tok-punct">)</span>   <span class="tok-comment">// 2× zoom</span></CodeBlock>

    <div data-reveal>
      <p>
        The renderer also accepts a pre-built <strong>asset map</strong>  useful when you want to
        avoid re-parsing large base64 image blobs on each render update.
      </p>
    </div>

    <CodeBlock filename="with-assets.ts" lang="TypeScript"><span class="tok-comment">// pass assets separately for faster re-renders</span>
<span class="tok-tag">const</span> assetMap <span class="tok-punct">= {</span>
  <span class="tok-str">'$img-1'</span><span class="tok-punct">:</span> <span class="tok-str">'data:image/webp;base64,AAAA...'</span><span class="tok-punct">,</span>
  <span class="tok-str">'$svg-1'</span><span class="tok-punct">:</span> <span class="tok-str">'data:image/svg+xml;base64,AAAA...'</span><span class="tok-punct">,</span>
<span class="tok-punct">}</span>

render<span class="tok-punct">(</span>guiCode<span class="tok-punct">,</span> containerEl<span class="tok-punct">,</span> assetMap<span class="tok-punct">)</span></CodeBlock>
  </section>
</template>

<template>
  <section id="format">
    <div data-reveal>
      <div class="section-label">What it is</div>
      <h2>A UI file that tools can read</h2>
      <p>
        Most design formats are binary blobs  opaque to code, invisible to AI. <strong>.gui</strong> is different:
        it's plain XML that carries your complete screen exactly as Figma drew it, in a format any tool can parse.
      </p>
      <p>
        Frames, stacks, text, images, shapes, tokens, fonts, effects  everything is in one file,
        with attributes you can read without a schema decoder.
      </p>
    </div>

    <CodeBlock filename="checkout.gui" lang="XML"><span class="tok-comment">&lt;!-- a complete mobile screen --&gt;</span>
<span class="tok-punct">&lt;</span><span class="tok-tag">gui</span> <span class="tok-attr">version</span><span class="tok-punct">="</span><span class="tok-val">0.2</span><span class="tok-punct">"</span> <span class="tok-attr">name</span><span class="tok-punct">="</span><span class="tok-val">Checkout</span><span class="tok-punct">"&gt;</span>

  <span class="tok-comment">&lt;!-- design tokens --&gt;</span>
  <span class="tok-punct">&lt;</span><span class="tok-tag">tokens</span><span class="tok-punct">&gt;</span>
    <span class="tok-punct">&lt;</span><span class="tok-tag">color</span> <span class="tok-attr">name</span><span class="tok-punct">="</span><span class="tok-val">primary</span><span class="tok-punct">"</span> <span class="tok-attr">value</span><span class="tok-punct">="</span><span class="tok-val">#007AFF</span><span class="tok-punct">" /&gt;</span>
    <span class="tok-punct">&lt;</span><span class="tok-tag">number</span> <span class="tok-attr">name</span><span class="tok-punct">="</span><span class="tok-val">radius-card</span><span class="tok-punct">"</span> <span class="tok-attr">value</span><span class="tok-punct">="</span><span class="tok-val">12</span><span class="tok-punct">" /&gt;</span>
  <span class="tok-punct">&lt;/</span><span class="tok-tag">tokens</span><span class="tok-punct">&gt;</span>

  <span class="tok-comment">&lt;!-- the screen --&gt;</span>
  <span class="tok-punct">&lt;</span><span class="tok-tag">col</span> <span class="tok-attr">fill</span><span class="tok-punct">="</span><span class="tok-val">#F2F2F7</span><span class="tok-punct">"</span> <span class="tok-attr">gap</span><span class="tok-punct">="</span><span class="tok-val">16</span><span class="tok-punct">"</span> <span class="tok-attr">p</span><span class="tok-punct">="</span><span class="tok-val">24</span><span class="tok-punct">"</span> <span class="tok-attr">w</span><span class="tok-punct">="</span><span class="tok-val">390</span><span class="tok-punct">"&gt;</span>

    <span class="tok-punct">&lt;</span><span class="tok-tag">text</span> <span class="tok-attr">value</span><span class="tok-punct">="</span><span class="tok-val">Checkout</span><span class="tok-punct">"</span>
          <span class="tok-attr">font-family</span><span class="tok-punct">="</span><span class="tok-val">Inter</span><span class="tok-punct">"</span> <span class="tok-attr">font-size</span><span class="tok-punct">="</span><span class="tok-val">28</span><span class="tok-punct">"</span>
          <span class="tok-attr">font-weight</span><span class="tok-punct">="</span><span class="tok-val">700</span><span class="tok-punct">"</span> <span class="tok-attr">fill</span><span class="tok-punct">="</span><span class="tok-val">#1C1C1E</span><span class="tok-punct">" /&gt;</span>

    <span class="tok-punct">&lt;</span><span class="tok-tag">row</span> <span class="tok-attr">fill</span><span class="tok-punct">="</span><span class="tok-val">#FFFFFF</span><span class="tok-punct">"</span> <span class="tok-attr">radius</span><span class="tok-punct">="</span><span class="tok-val">$radius-card</span><span class="tok-punct">"</span>
         <span class="tok-attr">p</span><span class="tok-punct">="</span><span class="tok-val">16</span><span class="tok-punct">"</span> <span class="tok-attr">align</span><span class="tok-punct">="</span><span class="tok-val">middle-left</span><span class="tok-punct">"</span> <span class="tok-attr">gap</span><span class="tok-punct">="</span><span class="tok-val">auto</span><span class="tok-punct">"&gt;</span>
      <span class="tok-punct">&lt;</span><span class="tok-tag">text</span> <span class="tok-attr">value</span><span class="tok-punct">="</span><span class="tok-val">Total</span><span class="tok-punct">"</span> <span class="tok-attr">font-size</span><span class="tok-punct">="</span><span class="tok-val">15</span><span class="tok-punct">"</span> <span class="tok-attr">fill</span><span class="tok-punct">="</span><span class="tok-val">#8E8E93</span><span class="tok-punct">" /&gt;</span>
      <span class="tok-punct">&lt;</span><span class="tok-tag">text</span> <span class="tok-attr">value</span><span class="tok-punct">="</span><span class="tok-val">$84.00</span><span class="tok-punct">"</span> <span class="tok-attr">font-size</span><span class="tok-punct">="</span><span class="tok-val">15</span><span class="tok-punct">"</span> <span class="tok-attr">font-weight</span><span class="tok-punct">="</span><span class="tok-val">600</span><span class="tok-punct">"</span> <span class="tok-attr">fill</span><span class="tok-punct">="</span><span class="tok-val">#1C1C1E</span><span class="tok-punct">" /&gt;</span>
    <span class="tok-punct">&lt;/</span><span class="tok-tag">row</span><span class="tok-punct">&gt;</span>

    <span class="tok-punct">&lt;</span><span class="tok-tag">rect</span>
          <span class="tok-attr">fill</span><span class="tok-punct">="</span><span class="tok-val">$primary</span><span class="tok-punct">"</span> <span class="tok-attr">radius</span><span class="tok-punct">="</span><span class="tok-val">12</span><span class="tok-punct">"</span>
          <span class="tok-attr">w</span><span class="tok-punct">="</span><span class="tok-val">fill</span><span class="tok-punct">"</span> <span class="tok-attr">h</span><span class="tok-punct">="</span><span class="tok-val">52</span><span class="tok-punct">" /&gt;</span>

  <span class="tok-punct">&lt;/</span><span class="tok-tag">col</span><span class="tok-punct">&gt;</span>
<span class="tok-punct">&lt;/</span><span class="tok-tag">gui</span><span class="tok-punct">&gt;</span></CodeBlock>

    <div class="tags" data-reveal="stagger">
      <span class="tag">&lt;frame&gt;</span>
      <span class="tag">&lt;col&gt;</span>
      <span class="tag">&lt;row&gt;</span>
      <span class="tag">&lt;text&gt;</span>
      <span class="tag">&lt;img&gt;</span>
      <span class="tag">&lt;rect&gt;</span>
      <span class="tag">&lt;ellipse&gt;</span>
      <span class="tag">&lt;tokens&gt;</span>
      <span class="tag">&lt;fonts&gt;</span>
      <span class="tag">&lt;appearance&gt;</span>
    </div>
  </section>
</template>

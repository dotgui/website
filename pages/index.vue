<template>
  <div>
    <TheNav />
    <div class="wrap">
      <TheHero />
      <SectionFormat />
      <SectionWhy />
      <SectionRenderer />
      <SectionInspect />
      <SectionFigma />
      <SectionFileContents />
    </div>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
useReveal()

const SITE_URL = 'https://dotgui.org'

useSeoMeta({
  title: '.gui — A text-based UI format for AI agents & Figma export',
  description: '.gui is an open, portable XML format that describes any user interface as plain text. Export Figma screens to a single .gui file, render it in the browser, or feed it to an LLM.',
  ogTitle: '.gui — UI as text',
  ogDescription: 'Portable, AI-native UI format. Export Figma → render anywhere → feed it to agents.',
  ogUrl: SITE_URL,
  ogImage: `${SITE_URL}/og.png`,
  twitterCard: 'summary_large_image'
})

// Structured data: helps Google rich results and lifts citation rate in
// ChatGPT / Perplexity / Claude (FAQPage is one of the strongest GEO signals).
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: '.gui',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web, any',
        description: '.gui is an open, portable XML format for describing user interfaces as plain text. Export Figma screens to a single .gui file, render it in the browser, or feed it to an AI agent.',
        url: SITE_URL,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: { '@type': 'Organization', name: '.gui', url: SITE_URL }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is .gui?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '.gui is an open, portable, text-based format for describing user interfaces. It is plain XML that carries a complete screen — frames, stacks, text, images, shapes, tokens, fonts, and effects — in a single file that any tool, browser, or AI agent can read without a proprietary decoder.'
            }
          },
          {
            '@type': 'Question',
            name: 'How do I export a Figma design to .gui?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Use the .gui Figma plugin to export any Figma screen to a single .gui file. The format is a 1:1 mapping of Figma’s layer model, so auto-layout, fills, gradients, effects, and tokens are preserved exactly rather than approximated.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can AI agents read and write .gui files?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. .gui is compact, human-readable XML that fits in a context window, so an LLM can read a .gui file to know exactly what is on screen — layout, text values, colors, spacing, and font weights — without screenshots or visual reasoning, and it can write .gui to produce screens that render correctly.'
            }
          },
          {
            '@type': 'Question',
            name: 'How do I render a .gui file?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Drop in @dotgui/kit/render to turn any .gui string into live DOM with a single function call.'
            }
          }
        ]
      })
    }
  ]
})
</script>

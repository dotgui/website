import { specSlugs } from './lib/spec-data'

const SITE_URL = 'https://dotgui.org'

// Per-element spec pages, prerendered to static HTML for SEO/GEO.
const specRoutes = specSlugs.map(slug => `/spec/${slug}`)

export default defineNuxtConfig({
  // Render real HTML so search engines and AI crawlers see content, not an
  // empty SPA shell. The homepage and spec are prerendered to static HTML;
  // the heavy interactive playground stays client-only.
  ssr: true,
  compatibilityDate: '2026-05-20',
  experimental: {
    viteEnvironmentApi: true
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/spec', ...specRoutes]
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/spec': { prerender: true },
    '/spec/**': { prerender: true },
    // CodeMirror + panzoom editor — no SEO value, keep it a client-only SPA.
    '/playground': { ssr: false }
  },
  site: { url: SITE_URL },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: '.gui — A text-based UI format for AI agents & Figma export',
      link: [
        { rel: 'canonical', href: SITE_URL }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        {
          name: 'description',
          content: '.gui is an open, portable XML format that describes any user interface as plain text. Export Figma screens to a single .gui file, render it in the browser, or feed it to an LLM.'
        },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '.gui' },
        { property: 'og:title', content: '.gui — UI as text' },
        { property: 'og:description', content: 'Portable, AI-native UI format. Export Figma → render anywhere → feed it to agents.' },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:image', content: `${SITE_URL}/og.png` },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '.gui — UI as text' },
        { name: 'twitter:description', content: 'Portable, AI-native UI format. Export Figma → render anywhere → feed it to agents.' },
        { name: 'twitter:image', content: `${SITE_URL}/og.png` }
      ]
    }
  }
})

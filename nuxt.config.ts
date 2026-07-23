import { specSlugs } from './lib/spec-data'
import { guideSlugs } from './lib/guides-data'
import { exampleSlugs, examples } from './lib/examples-data'
import { SITE_URL } from './utils/site-url'

// Per-element spec pages, prerendered to static HTML for SEO/GEO.
const specRoutes = specSlugs.map(slug => `/spec/${slug}`)
// Per-guide pages, same treatment.
const guideRoutes = guideSlugs.map(slug => `/guides/${slug}`)
// Per-example detail pages — prerendered so the .gui source is in the HTML.
const exampleRoutes = examples.map(e => `/examples/${e.slug}`)
// Raw .gui source endpoints, prerendered to static text so agents/crawlers
// (and the "View raw" button) get the source with no server round-trip.
const exampleRawRoutes = examples.map(e => `/examples/${e.slug}/raw`)

export default defineNuxtConfig({
  // Render real HTML so search engines and AI crawlers see content, not an
  // empty SPA shell. The homepage and spec are prerendered to static HTML;
  // the heavy interactive playground stays client-only.
  ssr: true,
  compatibilityDate: '2026-05-20',
  experimental: {
    viteEnvironmentApi: true,
    // Trailing-slash URLs are canonical (Netlify serves <route>/ as 200 and
    // 301s the extensionless path to it). 'append' makes every <NuxtLink>
    // render its href with a trailing slash, so internal navigation points
    // straight at the final 200 URL instead of a URL that redirects.
    defaults: {
      nuxtLink: {
        trailingSlash: 'append'
      }
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/spec', '/spec/roles', '/spec/quality', '/cli', '/kit', '/embed', '/figma', '/faq', '/guides', '/examples', ...specRoutes, ...guideRoutes, ...exampleRoutes, ...exampleRawRoutes]
    }
  },
  vue: {
    // <gui-embed> is a custom element registered client-side by @dotgui/embed;
    // tell the Vue compiler not to treat it as an unknown Vue component.
    compilerOptions: {
      isCustomElement: (tag) => tag === 'gui-embed'
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/spec': { prerender: true },
    '/spec/**': { prerender: true },
    '/cli': { prerender: true },
    '/kit': { prerender: true },
    '/embed': { prerender: true },
    '/figma': { prerender: true },
    '/faq': { prerender: true },
    '/guides': { prerender: true },
    '/guides/**': { prerender: true },
    '/examples': { prerender: true },
    '/examples/**': { prerender: true },
    // CodeMirror + panzoom editor  no SEO value, keep it a client-only SPA.
    '/playground': { ssr: false }
  },
  site: { url: SITE_URL },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: '.gui  A text-based UI format AI agents can write',
      // NOTE: no global canonical here  each page sets its own via
      // usePageSeo(); a site-wide canonical made every route claim to be
      // the homepage, which tells Google to deindex the spec pages.
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        {
          name: 'description',
          content: '.gui is an open, portable XML format that describes any user interface as plain text. An AI agent writes it directly, you render it in the browser, or feed it to an LLM. Figma export coming soon.'
        },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '.gui' },
        { property: 'og:title', content: '.gui  UI as text' },
        { property: 'og:description', content: 'Portable, AI-native UI format. Agents write it → render anywhere → feed it to agents. Figma export coming soon.' },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:image', content: `${SITE_URL}/og.png` },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '.gui  UI as text' },
        { name: 'twitter:description', content: 'Portable, AI-native UI format. Agents write it → render anywhere → feed it to agents. Figma export coming soon.' },
        { name: 'twitter:image', content: `${SITE_URL}/og.png` }
      ]
    }
  }
})

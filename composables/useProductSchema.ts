const SITE_URL = 'https://dotgui.org'

/**
 * JSON-LD for the product pages: SoftwareApplication + BreadcrumbList,
 * plus FAQPage when the page renders a FAQ (schema must mirror visible
 * content — pass the same array the template renders).
 */
export function useProductSchema(opts: {
  path: string
  name: string
  crumb: string
  description: string
  faq?: { q: string; a: string }[]
}) {
  const url = `${SITE_URL}${opts.path}`
  const scripts: { type: string; innerHTML: string }[] = [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: opts.name,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web, macOS, Linux, Windows',
        description: opts.description,
        url,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: { '@type': 'Organization', name: '.gui (dotgui)', url: SITE_URL }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '.gui', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: opts.crumb, item: url }
        ]
      })
    }
  ]
  if (opts.faq && opts.faq.length) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: opts.faq.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      })
    })
  }
  useHead({ script: scripts })
}

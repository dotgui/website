/**
 * Thin wrapper over nuxt-gtag for firing custom GA4 events. Call it in a
 * component's setup to get `track`, then invoke `track` from event handlers.
 *
 * Safe to call regardless of consent: until the user accepts cookies (see
 * CookieConsent.vue) GA is never initialized, so window.dataLayer doesn't
 * exist and the underlying gtag() call is a no-op.
 */
export function useAnalytics() {
  const { gtag } = useGtag()
  function track(event: string, params: Record<string, unknown> = {}) {
    gtag('event', event, params)
  }
  return { track }
}

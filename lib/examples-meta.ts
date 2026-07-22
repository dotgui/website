/**
 * Hand-authored, SEO-minded copy for each example, merged over the generated
 * lib/examples.json at render time (keyed by slug). Edit freely — this is the
 * prose humans read and AI search engines index. `title` overrides the name
 * derived from the .gui file; `description` should say what the screen is, its
 * theme, and its palette in 1–2 sentences.
 */
export interface ExampleMeta {
  /** Display title, overrides the generated name. */
  title: string
  /** One-line SEO/GEO description: what it is, theme, palette. */
  description: string
}

export const examplesMeta: Record<string, ExampleMeta> = {
  // ── mobile ──
  'skeuomorphic-album': {
    title: 'Skeuomorphic Album',
    description:
      'A skeuomorphic mobile album screen with a warm cream paper background and deep groove-black accents, styling track listings like the label of a spinning vinyl record.'
  },
  'skeuomorphic-music': {
    title: 'Skeuomorphic Music Player',
    description:
      'A skeuomorphic "now playing" music player for mobile — cream and near-black tones, textured dials and a record-inspired transport, evoking vintage hi-fi hardware.'
  },
  'bloom-pdp': {
    title: 'Bloom — Product Page',
    description:
      'A Material You product detail page for a plant shop, built on a soft off-white canvas with a deep forest-green primary and lime containers for a fresh, botanical feel.'
  },
  'stride-today': {
    title: 'Stride — Today',
    description:
      'A running app "today" dashboard in Material You, pairing a bright off-white background with a forest-green primary and lime accents for an energetic, outdoorsy look.'
  },
  'flight-search-results': {
    title: 'Flight Search Results — Light',
    description:
      'A mobile flight search results screen on a warm off-white background with terracotta accents, listing fares in a calm, editorial travel-app style.'
  },
  'flight-results-mobile': {
    title: 'Flight Results — Dark',
    description:
      'A dark-mode mobile flight results screen with a near-black background, soft violet primary and emerald confirmations — a modern, high-contrast travel booking UI.'
  },
  'meridian-flight-results': {
    title: 'Meridian — Flight Results',
    description:
      'Meridian, a clean flight results screen for mobile presenting airline itineraries, layovers and pricing in a minimal, legible booking layout.'
  },
  'posthog-flights': {
    title: 'PostHog — Flight Search',
    description:
      'A flight search results screen in PostHog\'s house style: a putty-grey canvas, hedgehog-yellow primary and olive text for a friendly, product-analytics aesthetic.'
  },
  'posthog-analytics': {
    title: 'PostHog — Mobile Analytics',
    description:
      'A PostHog mobile analytics dashboard with charts and metrics on a putty-grey background accented in signature hedgehog yellow — data-dense but approachable.'
  },
  'whoop-dashboard': {
    title: 'Whoop — Recovery Dashboard',
    description:
      'A WHOOP-style fitness dashboard in dark mode, using a near-black background and vivid recovery-green readouts to surface strain, sleep and recovery metrics.'
  },
  'material-expressive-fitness': {
    title: 'Pulse — Activity Rings',
    description:
      'Pulse, a Material 3 Expressive fitness screen with bold move, exercise and stand rings in electric purple, pink and teal against a bright, playful layout.'
  },
  'headspace-clone': {
    title: 'Headspace — Meditation',
    description:
      'A Headspace-inspired meditation home screen on a warm cream background with a friendly orange primary, offering calm, rounded cards for guided sessions.'
  },
  'instagram-clone': {
    title: 'Instagram — Feed',
    description:
      'An Instagram feed clone in dark mode — a pure-black background with layered grey surfaces — reproducing the stories bar, post cards and bottom tab navigation.'
  },
  'snapchat': {
    title: 'Snapchat — Camera',
    description:
      'A Snapchat camera screen with the signature bright-yellow brand color over a full-bleed camera view, glassy HUD controls and chat and stories badges.'
  },
  'spotify-playlist': {
    title: 'Spotify — Playlist',
    description:
      'A Spotify playlist screen in dark mode with a near-black background, signature Spotify green primary and a gradient header over the track list.'
  },
  'player': {
    title: 'Now Playing — Retro',
    description:
      'A retro "now playing" mobile music player in oxblood red and cream over warm dust-brown surfaces, with a tactile, analog-inspired playback layout.'
  },
  'chair': {
    title: 'Lindholm Chair — Product Page',
    description:
      'A minimalist furniture product page for the Lindholm chair, set on a soft off-white background with muted taupe accents for a calm, Scandinavian retail feel.'
  },
  'video-editor': {
    title: 'iPad Video Editor',
    description:
      'A tablet video editor interface in dark mode, using near-black panels and a violet accent to frame the preview, timeline and clip tracks of a pro editing app.'
  },

  // ── web ──
  'dotgui-landing-page': {
    title: '.gui — Landing Page',
    description:
      'A dark, high-contrast marketing landing page for the .gui format, built on a near-black canvas with subtle translucent borders and crisp typographic hierarchy.'
  },
  'spotify-desktop': {
    title: 'Spotify — Desktop',
    description:
      'A Spotify desktop app layout with the classic black sidebar, card grid and now-playing bar, accented in Spotify green — a full media-player web interface.'
  },
  'figma-clone': {
    title: 'Figma — Editor',
    description:
      'A Figma editor clone with the familiar dark-grey canvas, left layers panel, right properties inspector and blue selection accent of a design tool UI.'
  },
  'music-production-daw': {
    title: 'Oscillate — Music Production',
    description:
      'Oscillate, a digital audio workstation in dark mode with layered near-black surfaces, mixer channels and an arrangement timeline for a professional DAW interface.'
  },
  'flight-results': {
    title: 'Flight Results — Desktop',
    description:
      'A desktop flight results page in dark mode with a near-black background, violet primary and emerald confirmations, laying out fares and itineraries in wide rows.'
  },
  'design-event-booking': {
    title: 'Nexus — Event Booking',
    description:
      'Nexus, a dark, premium event booking page with a near-black background and warm gold primary, presenting sessions and ticketing in an upscale conference style.'
  },
  'echelon-atelier-events': {
    title: 'Echelon Atelier — Events',
    description:
      'Echelon Atelier, an editorial event-production agency site in cream and espresso tones with refined serif typography for a luxury, boutique-studio feel.'
  },
  'premium-baby-accessories': {
    title: 'Premium Baby Accessories',
    description:
      'An ecommerce storefront for premium baby accessories in warm beige and terracotta, with soft editorial product imagery and a gentle, boutique retail layout.'
  },
  'sundial-studio': {
    title: 'Sundial Studio',
    description:
      'Sundial Studio, a creative agency landing page on a warm cream background with a bold red-orange accent, combining editorial type with a sunlit, tactile mood.'
  },
  'drift': {
    title: 'Drift',
    description:
      'Drift, a calm editorial web layout in warm greige tones with a muted teal accent, using generous whitespace and quiet typography for a slow, considered feel.'
  },
  'farfield': {
    title: 'The Far Field',
    description:
      'The Far Field, a moody editorial site on deep forest-grey surfaces with a soft sage accent, pairing muted nature tones with restrained, literary typography.'
  }
}

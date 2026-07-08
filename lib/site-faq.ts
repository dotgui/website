/**
 * The homepage FAQ — single source for both the on-page FAQ section and the
 * FAQPage JSON-LD. Keeping them identical matters: generative engines cite
 * answers they can see rendered, and Google flags schema that doesn't match
 * visible content.
 */
export interface SiteFaq {
  q: string
  a: string
}

export const siteFaq: SiteFaq[] = [
  {
    q: 'What is a .gui file?',
    a: '.gui is an open, text-based file format for describing user interfaces. A .gui file is a zip package with three parts: design.guix — plain XML markup carrying frames, stacks, text, images, shapes, design tokens, fonts, and effects — an assets/ folder for images and SVGs, and a preview.webp thumbnail. Any tool, browser, or AI agent can read it without a proprietary decoder.'
  },
  {
    q: 'How is .gui different from HTML?',
    a: 'HTML is a runtime for applications; .gui is a file format for interface designs. Creating HTML source needs a toolchain — package manager, bundler, dev server. A .gui file is a single portable artifact you can author with a text editor, the way .svg works for graphics. The reference renderer turns it into HTML whenever you want pixels.'
  },
  {
    q: 'How is .gui different from SVG?',
    a: 'SVG describes graphics: paths and shapes, with no concept of layout systems, design tokens, components, or screens. .gui takes the same open, text-based approach but is built specifically for UI — auto-layout stacks and grids, tokens, fonts, semantic roles, and light/dark modes in one file.'
  },
  {
    q: 'Can AI agents read and write .gui files?',
    a: 'Yes — the format is designed for it. A .gui file is compact, human-readable XML that fits in a context window, so an LLM can read exactly what is on screen — layout, text values, colors, spacing, font weights — without screenshots or visual reasoning. A closed 52-role vocabulary (role="button", role="nav-bar", …) makes files self-describing, and agents can write .gui that renders correctly.'
  },
  {
    q: 'How do I create a .gui file?',
    a: 'Install the CLI with npm i -g @dotgui/cli, then run gui setup. It installs the dotgui skill into the AI agents you already use — Claude Code, Gemini CLI, Cursor — so you can ask any of them for a design "in gui": the agent writes the markup and the gui command validates, lints, and packages it. You can also write the XML by hand; only validation is required to produce a file.'
  },
  {
    q: 'How do I render a .gui file on my website?',
    a: 'Add one CDN script — @dotgui/embed — and drop a <gui-embed> element pointing at your file. It renders the design in place with zero dependencies, with optional zoom, download, copy, and light/dark mode controls. In an application, call @dotgui/kit/render to turn any .gui string into live DOM with one function call.'
  },
  {
    q: ‘How do I export a Figma design to .gui?’,
    a: ‘Use the dotgui Figma plugin. Select any layer — frame, component, group, or shape — and export it as a .gui file. The plugin provides high-fidelity export (~95% coverage) of Figma’s layer model: auto-layout, fills, gradients, effects, and tokens are preserved. Known limitations: gradient strokes are not emitted, some effect types are documented as comments, and heavily overridden instances (≥75%) are detached to inline trees.’
  },
  {
    q: 'Is .gui free and open?',
    a: 'Yes. The format specification, the @dotgui/kit engine, the @dotgui/cli toolchain, and the @dotgui/embed library are open source and free to use. The spec, its design principles, and every RFC are public — the format does not belong to any one tool.'
  }
]

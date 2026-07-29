/**
 * The homepage FAQ: single source for both the on-page FAQ section and the
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
    a: '.gui is an open, text-based file format for describing user interfaces. A .gui file is a zip package with three parts: design.guix (plain XML markup carrying frames, stacks, text, images, shapes, design tokens, fonts, and effects), an assets/ folder for images and SVGs, and a preview.webp thumbnail. Any tool, browser, or AI agent can read it without a proprietary decoder.'
  },
  {
    q: 'How is .gui different from HTML?',
    a: 'HTML is a runtime for applications; .gui is a file format for interface designs. Creating HTML source needs a toolchain: a package manager, a bundler, a dev server. A .gui file is a single portable artifact you can author with a text editor, the way .svg works for graphics. The reference renderer turns it into HTML whenever you want pixels.'
  },
  {
    q: 'How is .gui different from SVG?',
    a: 'The important part is what they share: both are standalone, viewable files rather than runtimes, so you open one and see it directly, with nothing to install or set up. .gui applies that same open, text-based, open-and-see-it idea to interfaces. The difference is scope. SVG describes graphics (paths and shapes) with no concept of layout systems, design tokens, components, or screens. .gui is built specifically for UI: auto-layout stacks and grids, tokens, fonts, semantic roles, and light and dark modes in one file.'
  },
  {
    q: 'How is .gui different from XAML, QML, or GTK .ui files?',
    a: 'They share a declarative, tag-based shape but not a purpose. XAML, QML, and GTK .ui are UI languages bound to their own runtimes (.NET, Qt, GTK), so they need that framework present to mean anything and are meant to be the app you ship. .gui has no runtime of its own: it runs no logic and isn’t a framework. It sits one layer above those languages as a portable interchange format that can be converted into XAML, SwiftUI, Compose, or HTML. You wouldn’t choose one over the other; you’d design in .gui and generate the runtime code.'
  },
  {
    q: 'Is .gui a replacement for React or Vue?',
    a: 'No. React and Vue are UI frameworks you install and ship a running app with; they hold state and logic. .gui is a static design file format that runs no logic and ships nothing, so it doesn’t compete with them. You design a screen as a .gui file, then generate React or Vue code from it, the way you’d build from a Figma file. (This site is a case in point: its pages were designed as .gui files first, then converted into a Vue app to deploy, because a live website needs a runtime and .gui deliberately isn’t one.)'
  },
  {
    q: 'Do I need to set anything up to view a .gui file, or is it a framework?',
    a: '.gui is not a framework or a runtime. It’s a self-contained file, like an image or a PDF. A .gui file carries its markup, assets, and a rendered preview in one package, so viewing it means opening it and seeing the interface, with nothing to install and no code to run. It behaves like an image precisely because it runs no logic and depends on no framework, so it has one fixed appearance any viewer can show directly. The CLI, kit, and embed library are optional tools for producing or embedding files, not a runtime the file needs in order to exist.'
  },
  {
    q: 'Does .gui require AI or an internet connection?',
    a: 'No. AI is one way to author a .gui file, not a requirement. The CLI and reference engine are 100% deterministic and make zero model calls: validating, rendering, editing, versioning, and converting a file all happen locally with no AI and no network. Once a file exists, everything you can do with it is fully offline.'
  },
  {
    q: 'Does .gui store layout intent or fixed pixel positions?',
    a: 'It stores layout intent, not absolute geometry, and that is the deliberate line that separates it from SVG. A .gui file describes stacks, grids, gaps, alignment, tokens, and semantic roles, so a renderer re-runs the layout rule per platform and screen size instead of replaying stale coordinates. Storing only fixed positions would make it a screenshot with editable text; storing intent is what lets one file mean the same design across web, iOS, and Android.'
  },
  {
    q: 'Can AI agents read and write .gui files?',
    a: 'Yes, the format is designed for it. A .gui file is compact, human-readable XML that fits in a context window, so an LLM can read exactly what is on screen (layout, text values, colors, spacing, font weights) without screenshots or visual reasoning. A closed 53-role vocabulary (role="button", role="nav-bar", and so on) makes files self-describing, and agents can write .gui that renders correctly.'
  },
  {
    q: 'How do I create a .gui file?',
    a: 'Install the CLI with npm i -g @dotgui/cli, then run gui setup. It installs the dotgui skill into the AI agents you already use (Claude Code, Gemini CLI, Cursor), so you can ask any of them for a design "in gui": the agent writes the markup and the gui command validates, lints, and packages it. You can also write the XML by hand; only validation is required to produce a file.'
  },
  {
    q: 'How do I render a .gui file on my website?',
    a: 'Add one CDN script (@dotgui/embed) and drop a <gui-embed> element pointing at your file. It renders the design in place with zero dependencies, with optional zoom, download, copy, and light and dark mode controls. In an application, call @dotgui/kit/render to turn any .gui string into live DOM with one function call.'
  },
  {
    q: "How do I export a Figma design to .gui?",
    a: "The dotgui Figma plugin is coming soon; it is currently in review with the Figma Community. Once live, you will select any layer (frame, component, group, or shape) and export it as a .gui file, with high-fidelity coverage (~95%) of Figma’s layer model: auto-layout, fills, gradients, effects, and tokens preserved. Known limitations: gradient strokes are not emitted, some effect types are documented as comments, and heavily overridden instances (≥75%) are detached to inline trees. In the meantime, an AI agent can write a .gui file directly from a prompt without any design tool."
  },
  {
    q: 'Is .gui free and open?',
    a: 'Yes. The format specification, the @dotgui/kit engine, the @dotgui/cli toolchain, and the @dotgui/embed library are open source and free to use. The spec, its design principles, and every RFC are public: the format does not belong to any one tool.'
  }
]

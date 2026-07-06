# dotgui.org — the story & homepage screenplay

Status: narrative spec — 2026-07-03
The theme every section must serve. Test for any addition:
**"Does this advance the story of the interface finally getting its file — or is it just a feature card?"**

---

## The story: The missing file

**Logline:** Every medium got an open file format. The interface never did —
it's the only artifact of modern software that still can't leave the tool it
was made in.

**The proof-table** (the story in one glance):

| Medium | Its file |
|---|---|
| Images | `.png` `.jpg` |
| Vector graphics | `.svg` |
| Documents | `.html` `.pdf` |
| 3D objects | `.gltf` `.obj` |
| Music, as notation | `.midi` |
| **Interfaces** | **— for 40 years** |

**The engine of the story is the timeline.** Every era answered "how do we
write an interface down?" — and every answer was a platform. The timeline
makes objections into exhibits: HTML/React isn't a counter-argument, it's
stop #4.

**Voice:** the curator. Calm, declarative, museum labels under everything.
Never marketing-speak. The label device (started with the Kensett hero) is
the site's signature: `mono, small, factual — artifact, year, one dry line.`

**Art policy (resolves "not full-screen"):** artifacts hang *in* the layout
as framed exhibits with labels — never as wallpaper. One classical painting
maximum, scoped to the "design as pictures" beat where it makes the argument.

---

## The timeline (hero exhibit)

Format: horizontal walk, scroll-scrubbed or stepped; each stop = a framed
artifact + museum label. Ends at a live-rendered .gui window — the only
exhibit that is alive.

| # | Era | Artifact in the frame | Label (draft copy) |
|---|---|---|---|
| 1 | ~1970 · The terminal | Green-phosphor TUI (curses-style form) | "Interfaces are characters on a grid. The file is the screen itself." |
| 2 | 1984 · The GUI | Early Mac/PARC-style window, bitmapped | "The interface becomes graphical — and stops being writable. Pixels, no file." |
| 3 | 1988–95 · The builders | NeXT `.nib` / VB form fragment | "Engineers write interfaces down at last — in dialects only their runtime can read." |
| 4 | 1995 · The web | HTML source + rendered page | "HTML answers the question — for the web. An interface written here is a web page; leaving costs a translation." |
| 5 | 2007 · The split | Same screen ×3: Android XML · iOS storyboard · HTML | "Mobile splits the world. One screen, written three times, in three dialects." |
| 6 | 2010s · The picture | Figma/Sketch artboard, framed like an archival photo | "Design tools perfect authoring — and ship pictures. The source of truth is a vendor's database." |
| 7 | 2024 · The writers | Terminal: an agent writing markup | "Machines that read and write text arrive. The missing file becomes the bottleneck." |
| 8 | Now · `.gui` | **Live `<gui-embed>` window** | "The interface, finally a file. Written by anything, checked by rules, rendered anywhere. This exhibit is alive — inspect it." |

Animation concept: the walk advances on scroll (IntersectionObserver steps,
not scroll-jacking); each frame lifts from grayscale-wash to full ink as it
becomes the active stop; stop 8's window visibly renders (markup types →
UI assembles) once, on arrival. Reduced-motion: all stops static, fully inked.

---

## Homepage screenplay

**Beat 0 — Cold open (hero).**
Eyebrow: "The open file format for user interfaces."
H1: **"The interface, finally a file."** ("Design, written down." moves to
the closing CTA band — the story's last line, not its first.)
Sub: the current answer-first definition paragraph (GEO anchor, unchanged).
Actions: `npm i -g @dotgui/cli` + "Read the spec →".
Exhibit: the proof-table, set like a museum placard.

**Beat 1 — The walk (timeline).**
The 8-stop timeline above. This section IS the pitch; it silently answers
"HTML? React? Figma?" without a defensive FAQ tone.

**Beat 2 — The file.**
Anatomy of a .gui (zip → design.guix + assets + preview) presented as a
specimen: exploded view, labeled parts. Copy from current SectionFileContents.
Label: "One file carries everything. No runtime attached."

**Beat 3 — Written by anything.**
The two lineages converge: your agent writes it (CLI + skill), Figma exports
it, a text editor suffices. Product trio: cli / figma / by-hand.
Label: "Authors, not vendors."

**Beat 4 — Checked like language.**
Grammar (validate) · proofreading (lint/autofix) · legibility grade (CCAC
score). The pastel pipeline pills live here: AUTHOR → VALIDATE → RENDER →
SCORE → SHIP. Label: "Only validation is required. Everything else is choice."

**Beat 5 — Read anywhere.**
Render/embed/translate. The platform-agnostic claim made concrete:
one .gui shown rendering to web DOM, and the same file's role/token
declarations mapped to SwiftUI/Compose snippets — translation, not scraping.
Label: "Declared, not encoded. That's why it travels."

**Beat 6 — The library.**
Gallery of real files (plates, scores, download links). Future /examples.
Label: "Every plate is a real file. Open it, read it, keep it."

**Beat 7 — Closing band.**
"Design, written down." + install CTA + the FAQ (GEO block, unchanged).

**Beats 2–7 reuse existing content-phase copy and schema wherever it fits —
the story re-frames sections; it does not require rewriting the SEO layer.**

---

## What this retires / keeps from earlier passes

- **Keep:** curator voice, museum labels, editorial type at 400, cream/ink
  Cursor-derived tokens, floating-window motif, pastel pills scoped to the
  pipeline, hero window becoming a real `<gui-embed>`.
- **Retire:** full-bleed painting hero (Kensett may survive as beat 6's
  "design as pictures" cameo — framed, small, labeled); toybox tilt/ink-border
  cards; "art history of all design" framing (overclaims vs. SVG).
- **Parking lot:** movable-type and musical-score metaphors — chapter-level
  devices if a section ever needs them, never the spine.

/**
 * Types for `@dotgui/kit/render`. Runtime is aliased to the prebuilt bundle
 * `../kit/dist/render.js` (see nuxt.config.ts); this shim mirrors the render
 * surface the landing uses without pulling the kit's source into the project.
 */
declare module '@dotgui/kit/render' {
  export interface RenderOptions {
    zoom?: boolean
    mode?: Record<string, string>
    [key: string]: unknown
  }
  export function render(
    code: string,
    container: HTMLElement,
    assetMap?: Record<string, string>,
    options?: RenderOptions,
  ): unknown
  export function renderToHTML(
    code: string,
    assetMap?: Record<string, string>,
    options?: RenderOptions,
  ): string
  export function normalizeBooleanAttrs(code: string): string
}

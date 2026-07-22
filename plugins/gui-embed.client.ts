/**
 * Register the <gui-embed> custom element (from @dotgui/embed) in the browser.
 * Client-only: custom elements are a DOM concern, and the element hydrates the
 * live .gui preview on the examples pages. Idempotent — install() no-ops if the
 * element is already defined.
 */
import { install } from '@dotgui/embed'

export default defineNuxtPlugin(() => {
  install()
})

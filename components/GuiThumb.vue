<template>
  <div
    class="gui-thumb"
    :class="[`is-${ex.category}`, { 'is-landscape': landscape }]"
    :style="{ background: frameColor(ex) }"
  >
    <img
      v-if="ex.preview"
      ref="imgEl"
      :src="ex.preview"
      :alt="`${ex.title} — .gui preview`"
      loading="lazy"
      @load="onLoad"
    />
    <span v-else class="gui-thumb-fallback" :style="fallbackStyle">{{ ex.title }}</span>
  </div>
</template>

<script setup lang="ts">
import { frameColor } from '~/utils/frame-color'
import type { Example } from '~/lib/examples-data'

const props = defineProps<{ ex: Example }>()

// Treat a preview by its real orientation, not just its category: a landscape
// "mobile" shot (e.g. an iPad screen) should float as a wide device, not shrink
// into a narrow phone with a huge empty frame around it.
const landscape = ref(false)
const imgEl = ref<HTMLImageElement | null>(null)
function measure(img: HTMLImageElement | null) {
  if (img && img.naturalWidth) landscape.value = img.naturalWidth > img.naturalHeight
}
function onLoad(e: Event) {
  measure(e.target as HTMLImageElement)
}
// Fallback for images already complete (cached) before @load can fire.
onMounted(() => measure(imgEl.value))

// Wash of the file's own token colours for the rare bundle with no preview.webp.
const fallbackStyle = computed(() => {
  const stops = (props.ex.colors || []).slice(0, 3).map((c) => c.value)
  if (stops.length < 2) return { background: stops[0] || 'var(--surface)' }
  return { background: `linear-gradient(135deg, ${stops.join(', ')})` }
})
</script>

<style scoped>
/* Uniform, Dribbble-style shot: web previews crop to their top edge, mobile
   previews float as a device centered and top-aligned on a tinted frame. */
.gui-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 263;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--hairline);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.gui-thumb.is-web { padding: 5% 5% 0; }
.gui-thumb.is-web img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  border-radius: 9px 9px 0 0;
  border: 1px solid var(--hairline);
  border-bottom: none;
  box-shadow: 0 8px 24px rgba(20, 19, 15, 0.16);
}
.gui-thumb.is-mobile img {
  width: 43%;
  height: auto;
  margin-top: 7%;
  display: block;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(20, 19, 15, 0.18);
  border: 1px solid var(--hairline);
}
/* Landscape "mobile" shot (tablet): float wide and fully visible, centered. */
.gui-thumb.is-mobile.is-landscape { align-items: center; }
.gui-thumb.is-mobile.is-landscape img {
  width: 86%;
  margin-top: 0;
}
.gui-thumb-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  font-family: var(--display);
  font-weight: 400;
  font-size: 18px;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}
</style>

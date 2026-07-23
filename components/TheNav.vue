<template>
  <nav class="site-nav" :class="{ 'is-open': open }">
    <div class="wrap">
      <NuxtLink class="nav-logo" to="/" @click="open = false">.gui</NuxtLink>
      <button
        class="nav-toggle"
        type="button"
        :aria-expanded="open"
        aria-controls="nav-links"
        aria-label="Toggle navigation menu"
        @click="open = !open"
      >
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
      </button>
      <div id="nav-links" class="nav-links" @click="open = false">
        <NuxtLink to="/spec">Spec</NuxtLink>
        <NuxtLink to="/cli">CLI</NuxtLink>
        <NuxtLink to="/kit">Kit</NuxtLink>
        <NuxtLink to="/embed">Embed</NuxtLink>
        <NuxtLink to="/figma">Figma</NuxtLink>
        <NuxtLink to="/examples">Examples</NuxtLink>
        <NuxtLink to="/guides">Guides</NuxtLink>
        <NuxtLink to="/playground">Playground</NuxtLink>
        <a class="nav-cta" href="https://github.com/dotgui/core" target="_blank" rel="noopener" aria-label="GitHub">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
          <span>GitHub</span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

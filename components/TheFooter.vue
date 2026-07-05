<template>
  <footer>
    <div class="wrap footer-grid">
      <div class="footer-brand">
        <span class="footer-logo">.gui — v{{ formatVersion }}</span>
        <span class="footer-note">The open file format for user interfaces</span>
      </div>
      <div class="footer-cols">
        <div class="footer-col">
          <p class="footer-col-label">Format</p>
          <NuxtLink to="/spec">Spec Reference</NuxtLink>
          <NuxtLink to="/spec/roles">Roles</NuxtLink>
          <NuxtLink to="/spec/quality">Quality</NuxtLink>
          <NuxtLink to="/playground">Playground</NuxtLink>
          <NuxtLink to="/faq">FAQ</NuxtLink>
        </div>
        <div class="footer-col">
          <p class="footer-col-label">Toolchain</p>
          <NuxtLink to="/cli">CLI</NuxtLink>
          <NuxtLink to="/kit">Kit</NuxtLink>
          <NuxtLink to="/embed">Embed</NuxtLink>
          <NuxtLink to="/figma">Figma plugin</NuxtLink>
        </div>
        <div class="footer-col">
          <p class="footer-col-label">Machine-readable</p>
          <a href="/llms.txt">llms.txt</a>
          <a href="/llms-full.txt">llms-full.txt</a>
          <a href="https://github.com/dotgui/core" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { formatVersion } from '~/lib/spec-data'
</script>

<style scoped>
.footer-grid {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-xl);
  flex-wrap: wrap;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-cols {
  display: flex;
  gap: var(--space-xxl);
  flex-wrap: wrap;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-col-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-soft);
  margin: 0 0 4px;
}

.footer-col a {
  font-family: var(--sans);
  font-size: 13px;
  color: var(--muted);
  text-decoration: none;
}
.footer-col a:hover { color: var(--ink); }
</style>

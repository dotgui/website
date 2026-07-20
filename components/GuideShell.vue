<template>
  <div>
    <TheNav />
    <div class="guide-layout">

      <!-- ── Persistent side navigation (mirrors the spec) ── -->
      <aside class="guide-sidebar">
        <div class="guide-sidebar-inner">
          <p class="sidebar-title">Guides</p>
          <nav>
            <NuxtLink to="/guides" class="nav-link nav-overview" :class="{ active: isIndex }">Overview</NuxtLink>
            <div v-for="group in guideGroups" :key="group.category" class="nav-group">
              <p class="nav-group-label">{{ group.label }}</p>
              <NuxtLink
                v-for="item in group.items"
                :key="item.slug"
                :to="`/guides/${item.slug}`"
                class="nav-link"
                :class="{ active: activeSlug === item.slug }"
              >{{ item.navLabel }}</NuxtLink>
            </div>
          </nav>
        </div>
      </aside>

      <!-- ── Page content ───────────────────────────────── -->
      <main class="guide-content">
        <slot />
      </main>

    </div>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { guideGroups } from '~/lib/guides-data'

const route = useRoute()
const isIndex = computed(() => isSamePath(route.path, '/guides'))
const activeSlug = computed(() => (route.params.slug as string) || '')
</script>

<style scoped>
.guide-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 61px);
}

.guide-sidebar {
  border-right: 1px solid var(--border);
  position: sticky;
  top: 61px;
  height: calc(100vh - 61px);
  overflow-y: auto;
  scrollbar-width: none;
}
.guide-sidebar::-webkit-scrollbar { display: none; }
.guide-sidebar-inner { padding: 28px 0 40px; }

.sidebar-title {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-dim);
  padding: 0 20px;
  margin-bottom: 20px;
}

.nav-group { margin-bottom: 24px; }
.nav-group-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  padding: 0 20px;
  margin-bottom: 2px;
}

.nav-link {
  display: block;
  padding: 4px 20px;
  font-size: 12.5px;
  color: var(--text-muted);
  text-decoration: none;
  font-family: var(--sans);
  transition: color 120ms var(--ease-out);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
}
.nav-link:hover { color: var(--text); }
.nav-link.active { color: var(--text); }
.nav-link.active::before { content: '›'; margin-right: 6px; color: var(--text-muted); }
.nav-overview { margin-bottom: 24px; }

.guide-content { min-width: 0; }

@media (max-width: 900px) {
  .guide-layout { grid-template-columns: 200px 1fr; }
}

@media (max-width: 700px) {
  .guide-layout { grid-template-columns: 1fr; }
  .guide-sidebar {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}
</style>

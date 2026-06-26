<template>
  <div>
    <TheNav />
    <div class="spec-layout">

      <!-- ── Persistent side navigation ─────────────────── -->
      <aside class="spec-sidebar">
        <div class="spec-sidebar-inner">
          <p class="sidebar-title">Spec Reference</p>
          <nav>
            <NuxtLink to="/spec" class="nav-link nav-overview" :class="{ active: isIndex }">Overview</NuxtLink>
            <div v-for="group in navGroups" :key="group.label" class="nav-group">
              <p class="nav-group-label">{{ group.label }}</p>
              <NuxtLink
                v-for="item in group.items"
                :key="item.slug"
                :to="`/spec/${item.slug}`"
                class="nav-link"
                :class="{ active: activeSlug === item.slug }"
              >{{ displayName(item.navLabel || item.name) }}</NuxtLink>
            </div>
          </nav>
        </div>
      </aside>

      <!-- ── Page content ───────────────────────────────── -->
      <main class="spec-content">
        <slot />
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { specEntries, specCategoryOrder, specDisplayName } from '~/lib/spec-data'

const displayName = specDisplayName
const route = useRoute()

// <stack> represents the row/col/stack family in the nav; when viewing
// /spec/row or /spec/col, highlight the <stack> entry.
const currentSlug = computed(() => (route.params.element as string) || '')
const isIndex = computed(() => route.path === '/spec')
const activeSlug = computed(() =>
  currentSlug.value === 'row' || currentSlug.value === 'col' ? 'stack' : currentSlug.value
)

const navEntries = specEntries.filter(e => e.slug !== 'row' && e.slug !== 'col')
const navGroups = specCategoryOrder.map(category => ({
  label: category,
  items: navEntries.filter(e => e.category === category)
}))
</script>

<style scoped>
.spec-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 61px);
}

.spec-sidebar {
  border-right: 1px solid var(--border);
  position: sticky;
  top: 61px;
  height: calc(100vh - 61px);
  overflow-y: auto;
  scrollbar-width: none;
}
.spec-sidebar::-webkit-scrollbar { display: none; }

.spec-sidebar-inner { padding: 28px 0 40px; }

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
  font-family: var(--mono);
  transition: color 120ms var(--ease-out);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
}
.nav-link:hover { color: var(--text); }
.nav-link.active { color: var(--text); }
.nav-link.active::before {
  content: '›';
  margin-right: 6px;
  color: var(--text-muted);
}

.nav-overview { margin-bottom: 24px; }

.spec-content { min-width: 0; }

@media (max-width: 900px) {
  .spec-layout { grid-template-columns: 200px 1fr; }
}

@media (max-width: 700px) {
  .spec-layout { grid-template-columns: 1fr; }
  .spec-sidebar {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}
</style>

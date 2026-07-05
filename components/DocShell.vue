<template>
  <div>
    <TheNav />
    <div class="doc-layout">

      <!-- ── Persistent side navigation (mirrors the spec) ── -->
      <aside class="doc-sidebar">
        <div class="doc-sidebar-inner">
          <p class="sidebar-title">{{ title }}</p>
          <nav>
            <NuxtLink :to="overview" class="nav-link nav-overview" :class="{ active: isOverview }">Overview</NuxtLink>
            <div v-for="group in groups" :key="group.label" class="nav-group">
              <p class="nav-group-label">{{ group.label }}</p>
              <a
                v-for="item in group.items"
                :key="item.to"
                :href="item.to"
                class="nav-link"
                :class="{ 'nav-mono': item.mono }"
              >{{ item.label }}</a>
            </div>
          </nav>
        </div>
      </aside>

      <!-- ── Page content ── -->
      <main class="doc-content">
        <slot />
      </main>

    </div>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
interface NavItem { label: string; to: string; mono?: boolean }
interface NavGroup { label: string; items: NavItem[] }

const props = defineProps<{
  title: string
  overview: string
  groups: NavGroup[]
}>()

const route = useRoute()
const isOverview = computed(() => route.path === props.overview)
</script>

<style scoped>
.doc-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 61px);
}

.doc-sidebar {
  border-right: 1px solid var(--border);
  position: sticky;
  top: 61px;
  height: calc(100vh - 61px);
  overflow-y: auto;
  scrollbar-width: none;
}
.doc-sidebar::-webkit-scrollbar { display: none; }
.doc-sidebar-inner { padding: 28px 0 40px; }

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
.nav-mono { font-family: var(--mono); font-size: 12px; }

.doc-content { min-width: 0; }

@media (max-width: 700px) {
  .doc-layout { grid-template-columns: 1fr; }
  .doc-sidebar {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}
</style>

<!-- global: docs pages don't scroll-reveal; keep code visible -->
<style>
.doc-content [data-reveal] { opacity: 1 !important; transform: none !important; }
</style>

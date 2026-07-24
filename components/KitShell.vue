<template>
  <div>
    <TheNav />
    <div class="kit-layout">

      <!-- ── Persistent side navigation (mirrors the spec) ── -->
      <aside class="kit-sidebar">
        <div class="kit-sidebar-inner">
          <p class="sidebar-title">The Kit</p>
          <nav>
            <NuxtLink to="/kit" class="nav-link nav-overview" :class="{ active: isIndex }">Overview</NuxtLink>
            <div class="nav-group">
              <p class="nav-group-label">Guide</p>
              <NuxtLink to="/kit#lifecycle" class="nav-link">Lifecycle</NuxtLink>
              <NuxtLink to="/kit#quality" class="nav-link">Quality</NuxtLink>
              <NuxtLink to="/kit#faq" class="nav-link">FAQ</NuxtLink>
            </div>
            <div class="nav-group">
              <p class="nav-group-label">Modules</p>
              <NuxtLink
                v-for="m in kitModules"
                :key="m.slug"
                :to="`/kit/${m.slug}`"
                class="nav-link nav-mod"
                :class="{ active: activeSlug === m.slug }"
              >{{ m.name }}</NuxtLink>
            </div>
          </nav>
        </div>
      </aside>

      <!-- ── Page content ── -->
      <main class="kit-content">
        <slot />
      </main>

    </div>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { kitModules } from '~/lib/kit-data'

const route = useRoute()
const isIndex = computed(() => isSamePath(route.path, '/kit'))
const activeSlug = computed(() => (route.params.module as string) || '')
</script>

<style scoped>
.kit-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 61px);
}

.kit-sidebar {
  border-right: 1px solid var(--border);
  position: sticky;
  top: 61px;
  height: calc(100vh - 61px);
  overflow-y: auto;
  scrollbar-width: none;
}
.kit-sidebar::-webkit-scrollbar { display: none; }
.kit-sidebar-inner { padding: 28px 0 40px; }

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
/* module names are code identifiers → mono */
.nav-mod { font-size: 12px; }

.kit-content { min-width: 0; }

@media (max-width: 700px) {
  .kit-layout { grid-template-columns: 1fr; }
  .kit-sidebar {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}
</style>

<!-- global: docs pages don't scroll-reveal; keep code blocks visible -->
<style>
.kit-content [data-reveal] { opacity: 1 !important; transform: none !important; }
</style>

<template>
  <div>
    <TheNav />
    <main class="wrap product">
      <nav class="product-breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">.gui</NuxtLink>
        <span>/</span>
        <span class="current">{{ crumb }}</span>
      </nav>
      <header>
        <p class="product-eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p class="lead"><slot name="lead" /></p>
      </header>
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  crumb: string
  eyebrow: string
  title: string
}>()

useReveal()
</script>

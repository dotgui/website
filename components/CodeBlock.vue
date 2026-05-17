<template>
  <div class="code-block" data-reveal>
    <div class="code-header">
      <span class="code-filename">{{ filename }}</span>
      <span class="code-lang">{{ lang }}</span>
    </div>
    <pre><slot /></pre>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  filename: string
  lang: string
}>()
</script>

<template>
  <div class="shared-section">
    <p class="shared-section-title">Inherited properties</p>
    <table class="attr-table">
      <thead>
        <tr><th>Attr</th><th>Type / values</th><th>Notes</th></tr>
      </thead>
      <tbody>
        <tr v-for="a in sharedAttributes" :key="a.name">
          <td>{{ a.name }}</td>
          <td>{{ value(a) }}</td>
          <td>{{ a.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { sharedAttributes, sharedAttrValue as value } from '~/lib/spec-data'
</script>

<style scoped>
.shared-section {
  margin-top: 28px;
}

.shared-section-title {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-family: var(--sans);
  font-weight: 500;
  margin: 0 0 0;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--border);
}

.attr-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0;
  font-size: 12px;
}

.attr-table thead tr {
  border-bottom: 1px solid var(--border);
}

.attr-table th {
  text-align: left;
  padding: 5px 10px 5px 0;
  color: var(--text-dim);
  font-weight: 500;
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.attr-table td {
  padding: 5px 10px 5px 0;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  vertical-align: top;
  font-family: var(--sans);
  font-size: 12.5px;
  line-height: 1.6;
}

.attr-table td:first-child {
  font-family: var(--mono);
  color: var(--text);
  font-size: 11.5px;
  white-space: nowrap;
  padding-right: 16px;
}
</style>

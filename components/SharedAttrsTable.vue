<template>
  <div class="shared-section">
    <p class="shared-section-title">Inherited properties</p>
    <table class="attr-table">
      <thead>
        <tr><th>Attr</th><th>Values</th><th>Notes</th></tr>
      </thead>
      <tbody>
        <tr><td>opacity</td><td>0–1</td><td>Omitted when 1</td></tr>
        <tr><td>blend</td><td>multiply, screen, overlay, …</td><td>Omitted when normal</td></tr>
        <tr><td>mask</td><td>boolean presence</td><td>Alpha mask for subsequent siblings</td></tr>
        <tr><td>rotation</td><td>degrees</td><td>Omitted when 0</td></tr>
        <tr><td>constraint-h / constraint-v</td><td>right, center, scale, stretch</td><td>left / top is default</td></tr>
        <tr><td>abs</td><td>boolean presence</td><td>Absolute child inside auto-layout parent</td></tr>
        <tr><td>min-width / max-width</td><td>px</td><td>Omitted when unset</td></tr>
        <tr><td>min-height / max-height</td><td>px</td><td>Omitted when unset</td></tr>
        <tr><td>border</td><td>"[w] [color] [style] [align]"</td><td>Shorthand — e.g. "2 #333 dashed inside"</td></tr>
        <tr><td>border-top / right / bottom / left</td><td>"[w] [color] [style]"</td><td>Per-side, always inside-aligned</td></tr>
      </tbody>
    </table>
  </div>
</template>

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

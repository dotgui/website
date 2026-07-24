<template>
  <Transition name="consent">
    <div v-if="visible" class="consent" role="dialog" aria-label="Cookie consent">
      <p class="consent-text">
        We use <strong>Google Analytics</strong> to understand what's useful on this site.
        No ads, no selling data — just anonymous usage. Okay to set analytics cookies?
      </p>
      <div class="consent-actions">
        <button type="button" class="consent-btn ghost" @click="decline">Decline</button>
        <button type="button" class="consent-btn solid" @click="accept">Accept</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const STORAGE_KEY = 'gtag-consent'
const { gtag, initialize } = useGtag()
const visible = ref(false)

// Load GA and flip Consent Mode to granted. Only ever called after the user
// has accepted (now, or on a past visit).
function enable() {
  gtag('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted'
  })
  initialize()
}

function accept() {
  localStorage.setItem(STORAGE_KEY, 'granted')
  visible.value = false
  enable()
}

function decline() {
  localStorage.setItem(STORAGE_KEY, 'denied')
  visible.value = false
  // GA is never initialized, so nothing is sent.
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'granted') enable()
  else if (!saved) visible.value = true
})
</script>

<style scoped>
.consent {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 100;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 20px;
  background: var(--ink);
  color: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(16, 16, 16, 0.28);
}
.consent-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.82);
}
.consent-text strong { color: #fff; font-weight: 600; }
.consent-actions { display: flex; gap: 8px; justify-content: flex-end; }
.consent-btn {
  font-size: 12.5px;
  font-weight: 500;
  border-radius: 999px;
  padding: 8px 16px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: opacity 160ms var(--ease-out), background 160ms var(--ease-out);
}
.consent-btn.ghost { background: transparent; border-color: rgba(255, 255, 255, 0.24); color: rgba(255, 255, 255, 0.82); }
.consent-btn.ghost:hover { color: #fff; border-color: rgba(255, 255, 255, 0.5); }
.consent-btn.solid { background: #fff; color: var(--ink); }
.consent-btn.solid:hover { opacity: 0.88; }

.consent-enter-active, .consent-leave-active { transition: transform 260ms var(--ease-out), opacity 260ms var(--ease-out); }
.consent-enter-from, .consent-leave-to { transform: translateY(12px); opacity: 0; }

@media (max-width: 480px) {
  .consent { left: 12px; right: 12px; bottom: 12px; max-width: none; }
}
</style>

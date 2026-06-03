<script setup lang="ts">
const mobileNavOpen = ref(false)
</script>

<template>
  <div class="app-shell">
    <button
      class="hamburger"
      aria-label="Open navigation"
      aria-expanded="false"
      @click="mobileNavOpen = true"
    >
      <span class="hamburger-bar" />
      <span class="hamburger-bar" />
      <span class="hamburger-bar" />
    </button>

    <div
      v-if="mobileNavOpen"
      class="sidebar-backdrop"
      aria-hidden="true"
      @click="mobileNavOpen = false"
    />

    <AppSidebar :mobile-open="mobileNavOpen" @close="mobileNavOpen = false" />

    <div class="page-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}

.page-content {
  flex: 1;
  padding: var(--space-8);
  overflow-y: auto;
  min-width: 0;
  background: var(--color-bg);
}

/* Hamburger — hidden on desktop */
.hamburger {
  display: none;
  position: fixed;
  top: var(--space-4);
  left: var(--space-4);
  z-index: 200;
  background: var(--color-sidebar-bg);
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-2);
  flex-direction: column;
  gap: 5px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
}

.hamburger-bar {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-sidebar-text-hover);
  border-radius: 1px;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 90;
}

@media (max-width: 640px) {
  .hamburger {
    display: flex;
  }

  .page-content {
    padding: var(--space-4);
    padding-top: 64px; /* clear hamburger button */
  }
}
</style>

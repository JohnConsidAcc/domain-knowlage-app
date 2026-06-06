<script setup lang="ts">
const mobileNavOpen = ref(false)
const { data: session } = useAuth()
const displayName = computed(() => session.value?.user?.name || session.value?.user?.email || '')
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

    <div class="main-area">
      <header class="app-header" role="banner">
        <span class="user-name">{{ displayName }}</span>
      </header>
      <div class="page-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--color-bg);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 var(--space-6);
  height: 48px;
  background: var(--color-bg-subtle);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.user-name {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.page-content {
  flex: 1;
  padding: var(--space-8);
  overflow-y: auto;
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

  .app-header {
    padding-left: 56px; /* clear hamburger button */
  }

  .page-content {
    padding: var(--space-4);
  }
}
</style>

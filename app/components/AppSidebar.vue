<script setup lang="ts">
const props = defineProps<{ mobileOpen?: boolean }>()
const emit = defineEmits<{ close: [] }>()

const expanded = ref(true)

function toggle() {
  expanded.value = !expanded.value
}

const links = [
  { to: '/', label: 'Quiz', icon: '🎯' },
  { to: '/study', label: 'Study mode', icon: '📖' },
  { to: '/questions/add', label: 'Add question', icon: '➕' },
  { to: '/questions', label: 'All questions', icon: '📋' },
  { to: '/questions/review', label: 'Review flagged', icon: '🔍' },
  { to: '/stats', label: 'My statistics', icon: '📊' },
]

const { signOut } = useAuth()
</script>

<template>
  <nav
    class="sidebar"
    :class="{ collapsed: !expanded, 'mobile-open': mobileOpen }"
    aria-label="Main navigation"
  >
    <button
      class="sidebar-toggle"
      :aria-expanded="expanded"
      :aria-label="expanded ? 'Collapse sidebar' : 'Expand sidebar'"
      @click="toggle"
    >
      <span class="toggle-icon" aria-hidden="true">{{ expanded ? '◀' : '▶' }}</span>
      <span v-if="expanded" class="toggle-label">Collapse</span>
    </button>

    <ul class="sidebar-links" role="list">
      <li v-for="link in links" :key="link.to">
        <NuxtLink :to="link.to" class="sidebar-link" active-class="active" @click="emit('close')">
          <span class="link-icon" aria-hidden="true">{{ link.icon }}</span>
          <span v-if="expanded" class="link-label">{{ link.label }}</span>
          <span v-else class="sr-only">{{ link.label }}</span>
        </NuxtLink>
      </li>
    </ul>

    <button class="sidebar-signout" aria-label="Sign out" @click="signOut({ callbackUrl: '/api/auth/signin' })">
      <span class="signout-icon" aria-hidden="true">→|</span>
      <span v-if="expanded" class="signout-label">Sign out</span>
      <span v-else class="sr-only">Sign out</span>
    </button>

    <!-- Close button shown only on mobile when open -->
    <button
      v-if="mobileOpen"
      class="sidebar-close"
      aria-label="Close navigation"
      @click="emit('close')"
    >
      ✕
    </button>
  </nav>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  min-height: 100vh;
  background: var(--color-sidebar-bg);
  color: var(--color-sidebar-text-hover);
  transition: width var(--transition-normal);
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: var(--sidebar-width-collapsed);
}

.sidebar-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) 14px;
  background: none;
  border: none;
  color: var(--color-sidebar-text);
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  width: 100%;
  text-align: left;
  transition: color var(--transition-fast);
}

.sidebar-toggle:hover {
  color: var(--color-sidebar-text-hover);
}

.toggle-icon {
  font-size: 12px;
  flex-shrink: 0;
}

.sidebar-links {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 14px;
  color: var(--color-sidebar-text);
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.sidebar-link:hover {
  background: var(--color-sidebar-hover);
  color: var(--color-sidebar-text-hover);
}

.sidebar-link.active {
  background: var(--color-sidebar-hover);
  color: var(--color-sidebar-active);
}

.link-icon {
  font-size: 18px;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.sidebar-signout {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 14px;
  background: none;
  border: none;
  color: var(--color-sidebar-text);
  font-size: 14px;
  white-space: nowrap;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.sidebar-signout:hover {
  background: var(--color-sidebar-hover);
  color: var(--color-sidebar-text-hover);
}

.signout-icon {
  font-size: 18px;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.sidebar-close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  background: none;
  border: none;
  color: var(--color-sidebar-text);
  font-size: 18px;
  padding: var(--space-1);
  line-height: 1;
}

.sidebar-close:hover {
  color: var(--color-sidebar-text-hover);
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
    width: var(--sidebar-width) !important; /* always full width on mobile */
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>

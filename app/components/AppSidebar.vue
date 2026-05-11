<script setup lang="ts">
const expanded = ref(true)

function toggle() {
  expanded.value = !expanded.value
}

const links = [
  { to: '/', label: 'Quiz', icon: '🎯' },
  { to: '/questions/add', label: 'Add question', icon: '➕' },
  { to: '/questions/review', label: 'Review flagged', icon: '🔍' },
]
</script>

<template>
  <nav class="sidebar" :class="{ collapsed: !expanded }" aria-label="Main navigation">
    <button class="sidebar-toggle" :aria-expanded="expanded" @click="toggle">
      <span class="toggle-icon">{{ expanded ? '◀' : '▶' }}</span>
      <span v-if="expanded" class="toggle-label">Collapse</span>
    </button>
    <ul class="sidebar-links">
      <li v-for="link in links" :key="link.to">
        <NuxtLink :to="link.to" class="sidebar-link" active-class="active">
          <span class="link-icon" aria-hidden="true">{{ link.icon }}</span>
          <span v-if="expanded" class="link-label">{{ link.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 200px;
  min-height: 100vh;
  background: #1e293b;
  color: #f1f5f9;
  transition: width 0.2s ease;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: 56px;
}

.sidebar-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 14px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  width: 100%;
  text-align: left;
}

.sidebar-toggle:hover {
  color: #f1f5f9;
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
  gap: 12px;
  padding: 12px 14px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}

.sidebar-link:hover {
  background: #334155;
  color: #f1f5f9;
}

.sidebar-link.active {
  background: #334155;
  color: #38bdf8;
}

.link-icon {
  font-size: 18px;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}
</style>

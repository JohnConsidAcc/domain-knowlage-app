<template>
  <div class="app-shell">
    <AppSidebar />
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
  padding: 32px;
  overflow-y: auto;
}
</style>

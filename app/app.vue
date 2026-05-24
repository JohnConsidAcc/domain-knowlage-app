<template>
  <NuxtLayout>
    <NuxtErrorBoundary>
      <NuxtPage />
      <template #error="{ error, clearError }">
        <div class="app-error">
          <h2>Something went wrong</h2>
          <p class="app-error__message">{{ error.message }}</p>
          <button class="app-error__btn" @click="clearError()">Try again</button>
        </div>
      </template>
    </NuxtErrorBoundary>
  </NuxtLayout>
</template>

<style>
.app-error {
  padding: var(--space-8);
  text-align: center;
}

.app-error__message {
  color: var(--color-text-secondary);
  margin: var(--space-4) 0;
}

.app-error__btn {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-6);
  font-size: 14px;
  font-weight: 500;
}
</style>

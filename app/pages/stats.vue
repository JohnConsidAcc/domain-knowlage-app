<script setup lang="ts">
interface PeriodStats { total: number; correct: number; accuracy: number }
interface Stats {
  today: PeriodStats
  week: PeriodStats
  month: PeriodStats
  allTime: PeriodStats
}

const { data: stats, pending, error, refresh } = useFetch<Stats>('/api/stats', { server: false })

const periods = computed(() => stats.value
  ? [
      { label: 'Today', data: stats.value.today },
      { label: 'This week', data: stats.value.week },
      { label: 'This month', data: stats.value.month },
      { label: 'All time', data: stats.value.allTime },
    ]
  : [])

const resetting = ref(false)
const resetError = ref<string | null>(null)
const resetSuccess = ref(false)

async function resetProgress() {
  const confirmed = confirm('This will permanently delete all your quiz history. Continue?')
  if (!confirmed) return

  resetting.value = true
  resetError.value = null
  resetSuccess.value = false

  try {
    await $fetch('/api/attempts', { method: 'DELETE' })
    resetSuccess.value = true
    await refresh()
    setTimeout(() => { resetSuccess.value = false }, 3000)
  }
  catch (err: unknown) {
    const fetchError = err as { data?: { message?: string }; message?: string }
    resetError.value = fetchError?.data?.message ?? fetchError?.message ?? 'Something went wrong'
  }
  finally {
    resetting.value = false
  }
}
</script>

<template>
  <main>
    <h1>My statistics</h1>
    <div v-if="pending" class="stats-grid" aria-busy="true" aria-label="Loading statistics">
      <div v-for="n in 4" :key="n" class="skel-card">
        <div class="skel-line skel-label" />
        <div class="skel-line skel-number" />
        <div class="skel-line skel-detail" />
      </div>
    </div>
    <div v-else-if="error" class="error-banner">Failed to load statistics. Please refresh the page.</div>
    <div v-else-if="!stats" class="error-banner">No statistics available.</div>
    <div v-else class="stats-grid">
      <div v-for="period in periods" :key="period.label" class="stat-card">
        <h2 class="period-label">{{ period.label }}</h2>
        <p class="accuracy">{{ period.data.accuracy }}<span class="unit">%</span></p>
        <p class="detail">{{ period.data.correct }} / {{ period.data.total }} correct</p>
      </div>
    </div>
    <div class="reset-section">
      <p v-if="resetSuccess" class="msg-success">Progress reset successfully.</p>
      <p v-if="resetError" class="msg-error">{{ resetError }}</p>
      <button class="reset-btn" :disabled="resetting" @click="resetProgress">
        {{ resetting ? 'Resetting…' : 'Reset my progress' }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-6);
}

.stat-card {
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  text-align: center;
}

.period-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 var(--space-3);
}

.accuracy {
  font-size: 48px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--space-2);
  line-height: 1;
}

.unit {
  font-size: 24px;
  color: var(--color-text-secondary);
}

.detail {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.skel-card {
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.skel-line {
  background: var(--color-border);
  border-radius: var(--radius-sm);
  animation: pulse 1.4s ease-in-out infinite;
}

.skel-label { height: 14px; width: 55%; }
.skel-number { height: 48px; width: 65%; }
.skel-detail { height: 14px; width: 75%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.error-banner {
  background: var(--color-error-bg);
  border: 1px solid var(--color-error-border);
  border-radius: var(--radius-md);
  color: var(--color-error-text);
  padding: var(--space-3) var(--space-4);
  margin-top: var(--space-6);
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
}

.reset-section {
  margin-top: var(--space-8);
}

.reset-btn {
  background: none;
  border: 1px solid var(--color-error-border);
  border-radius: var(--radius-md);
  color: var(--color-error-text);
  padding: var(--space-2) var(--space-4);
  transition: background var(--transition-fast), color var(--transition-fast);
}

.reset-btn:hover:not(:disabled) {
  background: var(--color-error-bg);
}
</style>

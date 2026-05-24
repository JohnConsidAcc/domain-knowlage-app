<script setup lang="ts">
interface PeriodStats { total: number; correct: number; accuracy: number }
interface Stats {
  today: PeriodStats
  week: PeriodStats
  month: PeriodStats
  allTime: PeriodStats
}

const { data: stats, pending, error } = useFetch<Stats>('/api/stats', { server: false })

const periods = computed(() => stats.value
  ? [
      { label: 'Today', data: stats.value.today },
      { label: 'This week', data: stats.value.week },
      { label: 'This month', data: stats.value.month },
      { label: 'All time', data: stats.value.allTime },
    ]
  : [])
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
  </main>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.stat-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.period-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 12px;
}

.accuracy {
  font-size: 48px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
  line-height: 1;
}

.unit {
  font-size: 24px;
  color: #64748b;
}

.detail {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.skel-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.skel-line {
  background: #e2e8f0;
  border-radius: 4px;
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
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #b91c1c;
  padding: 12px 16px;
  margin-top: 24px;
}
</style>

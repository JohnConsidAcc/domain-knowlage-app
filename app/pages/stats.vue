<script setup lang="ts">
interface PeriodStats { total: number; correct: number; accuracy: number }
interface Stats {
  today: PeriodStats
  week: PeriodStats
  month: PeriodStats
  allTime: PeriodStats
}

const { data: stats } = await useFetch<Stats>('/api/stats')

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
    <div v-if="stats" class="stats-grid">
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
</style>

<script setup lang="ts">
import type { QuizQuestion } from '../components/QuizWidget.vue'

const question = ref<QuizQuestion | null>(null)
const result = ref<boolean | null>(null)
const correctAnswerId = ref<string | null>(null)
const loading = ref(true)
const empty = ref(false)
const error = ref<string | null>(null)

async function loadNextQuestion() {
  loading.value = true
  result.value = null
  correctAnswerId.value = null
  question.value = null
  error.value = null
  try {
    const data = await $fetch<QuizQuestion | null>('/api/questions/next')
    if (!data) {
      empty.value = true
    } else {
      question.value = data
      empty.value = false
    }
  } catch {
    error.value = 'Failed to load question. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleAnswered(questionId: string, answerId: string) {
  error.value = null
  try {
    const data = await $fetch<{ wasCorrect: boolean; correctAnswerId: string | null }>('/api/attempts', {
      method: 'POST',
      body: { questionId, answerId },
    })
    result.value = data.wasCorrect
    correctAnswerId.value = data.correctAnswerId
  } catch {
    error.value = 'Failed to record answer. Please try again.'
  }
}

async function handleInvalidate(questionId: string) {
  error.value = null
  try {
    await $fetch(`/api/questions/${questionId}`, {
      method: 'PATCH',
      body: { action: 'invalidate' },
    })
    loadNextQuestion()
  } catch {
    error.value = 'Failed to report question. Please try again.'
  }
}

onMounted(loadNextQuestion)
</script>

<template>
  <main>
    <div v-if="loading">Loading…</div>
    <div v-else-if="error && !question" class="error-banner">
      {{ error }}
      <button @click="loadNextQuestion">Retry</button>
    </div>
    <div v-else-if="empty">No questions available.</div>
    <template v-else-if="question">
      <div v-if="error" class="error-banner">{{ error }}</div>
      <QuizWidget
        :question="question"
        :result="result"
        :correct-answer-id="correctAnswerId"
        @answered="handleAnswered"
        @next="loadNextQuestion"
        @invalidate="handleInvalidate"
      />
    </template>
  </main>
</template>

<style scoped>
.error-banner {
  background: var(--color-error-bg);
  border: 1px solid var(--color-error-border);
  border-radius: var(--radius-md);
  color: var(--color-error-text);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.error-banner button {
  margin-left: auto;
  background: var(--color-error-action);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-1) var(--space-3);
  cursor: pointer;
  font-size: 14px;
}
</style>

<script setup lang="ts">
import type { QuizQuestion } from '../components/QuizWidget.vue'

const question = ref<QuizQuestion | null>(null)
const result = ref<boolean | null>(null)
const loading = ref(true)
const empty = ref(false)

async function loadNextQuestion() {
  loading.value = true
  result.value = null
  question.value = null
  try {
    const data = await $fetch<QuizQuestion | null>('/api/questions/next')
    if (!data) {
      empty.value = true
    } else {
      question.value = data
      empty.value = false
    }
  } finally {
    loading.value = false
  }
}

async function handleAnswered(questionId: string, answerId: string) {
  const data = await $fetch<{ wasCorrect: boolean }>('/api/attempts', {
    method: 'POST',
    body: { questionId, answerId },
  })
  result.value = data.wasCorrect
}

onMounted(loadNextQuestion)
</script>

<template>
  <main>
    <div v-if="loading">Loading…</div>
    <div v-else-if="empty">No questions available.</div>
    <QuizWidget
      v-else-if="question"
      :question="question"
      :result="result"
      @answered="handleAnswered"
      @next="loadNextQuestion"
    />
  </main>
</template>

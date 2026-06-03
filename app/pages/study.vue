<script setup lang="ts">
interface StudyAnswer {
  id: string
  text: string
  isCorrect: boolean
}

interface StudyQuestion {
  id: string
  prompt: string
  answers: StudyAnswer[]
}

const { data: questions, pending, error } = useFetch<StudyQuestion[]>('/api/study/questions', { server: false })

const currentIndex = ref(0)
const selectedAnswerId = ref<string | null>(null)
const result = ref<boolean | null>(null)
const correctAnswerId = ref<string | null>(null)
const correctCount = ref(0)
const incorrectCount = ref(0)
const answerError = ref<string | null>(null)
const submitting = ref(false)

const currentQuestion = computed(() => questions.value?.[currentIndex.value] ?? null)
const total = computed(() => questions.value?.length ?? 0)
const isComplete = computed(() => questions.value !== null && total.value > 0 && currentIndex.value >= total.value)
const accuracyPercent = computed(() => {
  const answered = correctCount.value + incorrectCount.value
  if (answered === 0) return 0
  return Math.round((correctCount.value / answered) * 100)
})

async function selectAnswer(answerId: string) {
  if (result.value !== null || submitting.value) return
  selectedAnswerId.value = answerId
  submitting.value = true
  answerError.value = null
  try {
    const data = await $fetch<{ wasCorrect: boolean; correctAnswerId: string | null }>('/api/attempts', {
      method: 'POST',
      body: { questionId: currentQuestion.value!.id, answerId },
    })
    result.value = data.wasCorrect
    correctAnswerId.value = data.correctAnswerId
    if (data.wasCorrect) {
      correctCount.value++
    } else {
      incorrectCount.value++
    }
  } catch {
    answerError.value = 'Failed to record answer. Please try again.'
    selectedAnswerId.value = null
  } finally {
    submitting.value = false
  }
}

function advance() {
  currentIndex.value++
  selectedAnswerId.value = null
  result.value = null
  correctAnswerId.value = null
  answerError.value = null
}
</script>

<template>
  <main>
    <h1>Study mode</h1>

    <div v-if="pending" class="skel-container" aria-busy="true" aria-label="Loading questions">
      <div class="skel-line skel-progress" />
      <div class="skel-line skel-prompt" />
      <div class="skel-answers">
        <div v-for="n in 4" :key="n" class="skel-line skel-answer" />
      </div>
    </div>

    <div v-else-if="error" class="error-banner">Failed to load questions. Please refresh the page.</div>

    <template v-else-if="questions">
      <template v-if="isComplete">
        <div class="completion-screen">
          <h2>All done!</h2>
          <p class="score">{{ correctCount }} / {{ total }}</p>
          <p class="accuracy-label">{{ accuracyPercent }}% accuracy</p>
          <p class="tally">
            <span class="correct-count">✓ {{ correctCount }} correct</span>
            ·
            <span class="incorrect-count">✗ {{ incorrectCount }} incorrect</span>
          </p>
          <NuxtLink to="/" class="back-link">Back to quiz</NuxtLink>
        </div>
      </template>

      <template v-else-if="currentQuestion">
        <div class="progress-header" aria-label="Study progress">
          <span class="progress-label">Question {{ currentIndex + 1 }} of {{ total }}</span>
          <span class="tally">
            <span class="correct-count">✓ {{ correctCount }} correct</span>
            ·
            <span class="incorrect-count">✗ {{ incorrectCount }} incorrect</span>
          </span>
        </div>

        <div v-if="answerError" class="error-banner">{{ answerError }}</div>

        <p class="prompt">{{ currentQuestion.prompt }}</p>

        <ul class="answers" role="list" aria-label="Answer options">
          <li v-for="answer in currentQuestion.answers" :key="answer.id">
            <button
              :disabled="result !== null || submitting"
              :aria-pressed="selectedAnswerId === answer.id || undefined"
              :class="{
                selected: selectedAnswerId === answer.id,
                correct: result === false && answer.id === correctAnswerId,
                incorrect: result === false && answer.id === selectedAnswerId && answer.id !== correctAnswerId,
              }"
              @click="selectAnswer(answer.id)"
            >
              {{ answer.text }}
            </button>
          </li>
        </ul>

        <div
          v-if="result !== null"
          class="feedback"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span v-if="result" class="correct">Correct!</span>
          <span v-else class="incorrect">Incorrect</span>
          <button class="next-btn" @click="advance">Next</button>
        </div>
      </template>

      <div v-else class="error-banner">No questions available.</div>
    </template>
  </main>
</template>

<style scoped>
h1 {
  margin: 0 0 var(--space-6);
  color: var(--color-text);
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.progress-label {
  font-weight: 600;
  color: var(--color-text);
  font-size: 15px;
}

.tally {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.correct-count {
  color: var(--color-success-text);
  font-weight: 500;
}

.incorrect-count {
  color: var(--color-error-text);
  font-weight: 500;
}

.prompt {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--space-6);
  line-height: 1.4;
  max-width: 640px;
}

.answers {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 640px;
}

.answers button {
  width: 100%;
  text-align: left;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 16px;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.answers button:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: var(--color-bg-subtle);
}

.answers button.selected {
  border-color: var(--color-primary);
  background: var(--color-bg-subtle);
}

.answers button.correct {
  border-color: var(--color-success-border);
  background: var(--color-success-bg);
  color: var(--color-success-text);
}

.answers button.incorrect {
  border-color: var(--color-error-border);
  background: var(--color-error-bg);
  color: var(--color-error-text);
}

.feedback {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
  max-width: 640px;
}

.feedback .correct {
  font-weight: 600;
  color: var(--color-success-text);
  font-size: 18px;
}

.feedback .incorrect {
  font-weight: 600;
  color: var(--color-error-text);
  font-size: 18px;
}

.next-btn {
  margin-left: auto;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-4);
  font-weight: 500;
}

.next-btn:hover {
  opacity: 0.9;
}

/* ── Completion screen ── */
.completion-screen {
  max-width: 480px;
  text-align: center;
  margin-top: var(--space-6);
  padding: var(--space-8);
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.completion-screen h2 {
  margin: 0 0 var(--space-4);
  font-size: 28px;
  color: var(--color-text);
}

.score {
  font-size: 48px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--space-2);
  line-height: 1;
}

.accuracy-label {
  font-size: 20px;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-4);
}

.completion-screen .tally {
  margin-bottom: var(--space-6);
  font-size: 15px;
}

.back-link {
  display: inline-block;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-5);
  font-weight: 500;
  font-size: 15px;
}

.back-link:hover {
  opacity: 0.9;
}

/* ── Skeleton ── */
.skel-container {
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-2);
}

.skel-line {
  background: var(--color-border);
  border-radius: var(--radius-sm);
  animation: pulse 1.4s ease-in-out infinite;
}

.skel-progress { height: 48px; }
.skel-prompt { height: 32px; width: 80%; }
.skel-answers { display: flex; flex-direction: column; gap: var(--space-3); }
.skel-answer { height: 52px; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── Error banner ── */
.error-banner {
  background: var(--color-error-bg);
  border: 1px solid var(--color-error-border);
  border-radius: var(--radius-md);
  color: var(--color-error-text);
  padding: var(--space-3) var(--space-4);
  margin-top: var(--space-4);
  max-width: 640px;
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .prompt {
    font-size: 18px;
  }

  .feedback {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .next-btn {
    margin-left: 0;
    width: 100%;
    padding: var(--space-3);
    text-align: center;
  }

  .progress-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

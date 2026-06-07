<script setup lang="ts">
export interface QuizAnswer {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  answers: QuizAnswer[]
}

const props = defineProps<{
  question: QuizQuestion
  result: boolean | null
  correctAnswerId: string | null
}>()

const emit = defineEmits<{
  answered: [questionId: string, answerId: string]
  next: []
  invalidate: [questionId: string]
}>()

const selectedAnswerId = ref<string | null>(null)
const invalidating = ref(false)

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const shuffledAnswers = ref<QuizAnswer[]>(shuffleArray(props.question.answers))

watch(
  () => props.question,
  (question) => {
    shuffledAnswers.value = shuffleArray(question.answers)
    selectedAnswerId.value = null
  },
)

function selectAnswer(answerId: string) {
  /* v8 ignore next -- disabled buttons suppress click events in the test DOM */
  if (props.result !== null) return
  selectedAnswerId.value = answerId
  emit('answered', props.question.id, answerId)
}

async function handleInvalidate() {
  invalidating.value = true
  emit('invalidate', props.question.id)
}
</script>

<template>
  <div class="quiz-widget">
    <p class="prompt">{{ question.prompt }}</p>

    <ul class="answers" role="list" aria-label="Answer options">
      <li v-for="answer in shuffledAnswers" :key="answer.id">
        <button
          :disabled="result !== null"
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
      <button class="next-btn" @click="emit('next')">Next question</button>
    </div>

    <div class="actions">
      <button
        class="invalidate-btn"
        :disabled="invalidating"
        aria-label="Report this question as incorrectly worded"
        @click="handleInvalidate"
      >
        Report question as incorrect
      </button>
    </div>
  </div>
</template>

<style scoped>
.quiz-widget {
  max-width: 640px;
}

.prompt {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--space-6);
  line-height: 1.4;
}

.answers {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
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

.actions {
  margin-top: var(--space-2);
}

.invalidate-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  padding: var(--space-2) var(--space-3);
  font-size: 13px;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.invalidate-btn:hover:not(:disabled) {
  color: var(--color-error-text);
  border-color: var(--color-error-border);
}

@media (max-width: 640px) {
  .quiz-widget {
    max-width: 100%;
  }

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
}
</style>

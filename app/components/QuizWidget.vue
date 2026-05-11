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
}>()

const emit = defineEmits<{
  answered: [questionId: string, answerId: string]
  next: []
  invalidate: [questionId: string]
}>()

const selectedAnswerId = ref<string | null>(null)
const invalidating = ref(false)

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
    <ul class="answers">
      <li v-for="answer in question.answers" :key="answer.id">
        <button
          :disabled="result !== null"
          :class="{ selected: selectedAnswerId === answer.id }"
          @click="selectAnswer(answer.id)"
        >
          {{ answer.text }}
        </button>
      </li>
    </ul>
    <div v-if="result !== null" class="feedback">
      <span v-if="result" class="correct">Correct!</span>
      <span v-else class="incorrect">Incorrect</span>
      <button class="next-btn" @click="emit('next')">Next question</button>
    </div>
    <div class="actions">
      <button
        class="invalidate-btn"
        :disabled="invalidating"
        @click="handleInvalidate"
      >
        Report question as incorrect
      </button>
    </div>
  </div>
</template>

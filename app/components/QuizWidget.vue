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
}>()

const selectedAnswerId = ref<string | null>(null)

function selectAnswer(answerId: string) {
  if (props.result !== null) return
  selectedAnswerId.value = answerId
  emit('answered', props.question.id, answerId)
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
  </div>
</template>

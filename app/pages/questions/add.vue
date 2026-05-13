<script setup lang="ts">
const prompt = ref('')
const answers = ref([
  { text: '', isCorrect: false },
  { text: '', isCorrect: false },
])
const submitting = ref(false)
const success = ref(false)
const error = ref<string | null>(null)

function addAnswer() {
  answers.value.push({ text: '', isCorrect: false })
}

function removeAnswer(index: number) {
  answers.value.splice(index, 1)
}

function setCorrect(index: number) {
  answers.value.forEach((a, i) => { a.isCorrect = i === index })
}

async function submit() {
  error.value = null
  if (!prompt.value.trim()) { error.value = 'A question prompt is required.'; return }
  if (answers.value.length < 2) { error.value = 'At least 2 answers are required.'; return }
  if (!answers.value.some(a => a.isCorrect)) { error.value = 'Mark one answer as correct.'; return }
  if (answers.value.some(a => !a.text.trim())) { error.value = 'All answers must have text.'; return }

  submitting.value = true
  try {
    await $fetch('/api/questions', {
      method: 'POST',
      body: { prompt: prompt.value.trim(), answers: answers.value },
    })
    success.value = true
    prompt.value = ''
    answers.value = [{ text: '', isCorrect: false }, { text: '', isCorrect: false }]
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main>
    <h1>Add a question</h1>
    <div v-if="success" class="success">Question added successfully!</div>
    <form novalidate @submit.prevent="submit">
      <div>
        <label>Question</label>
        <textarea v-model="prompt" rows="3" required />
      </div>
      <fieldset>
        <legend>Answers <small>(select the correct one)</small></legend>
        <div v-for="(answer, i) in answers" :key="i" class="answer-row">
          <input type="radio" :name="'correct'" :checked="answer.isCorrect" @change="setCorrect(i)" />
          <input v-model="answer.text" type="text" placeholder="Answer text" required />
          <button type="button" :disabled="answers.length <= 2" @click="removeAnswer(i)">Remove</button>
        </div>
        <button type="button" @click="addAnswer">+ Add answer</button>
      </fieldset>
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Saving…' : 'Save question' }}
      </button>
    </form>
    <NuxtLink to="/">← Back to quiz</NuxtLink>
  </main>
</template>

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
    setTimeout(() => { success.value = false }, 4000)
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

    <div v-if="success" role="status" class="success msg-success">Question added successfully!</div>

    <form novalidate class="question-form" @submit.prevent="submit">
      <div class="field">
        <label for="question-prompt" class="field-label">Question prompt</label>
        <textarea
          id="question-prompt"
          v-model="prompt"
          rows="3"
          required
          placeholder="Enter the question text…"
        />
      </div>

      <fieldset class="answers-fieldset">
        <legend class="field-label">Answers <small>(select the correct one)</small></legend>
        <div v-for="(answer, i) in answers" :key="i" class="answer-row">
          <label class="radio-label">
            <input
              type="radio"
              :name="'correct'"
              :checked="answer.isCorrect"
              :aria-label="`Mark answer ${i + 1} as correct`"
              @change="setCorrect(i)"
            />
            <span class="sr-only">Correct</span>
          </label>
          <input
            :id="`answer-${i}`"
            v-model="answer.text"
            type="text"
            :placeholder="`Answer ${i + 1}`"
            :aria-label="`Answer ${i + 1} text`"
            required
          />
          <button
            type="button"
            class="btn-remove"
            :disabled="answers.length <= 2"
            :aria-label="`Remove answer ${i + 1}`"
            @click="removeAnswer(i)"
          >
            Remove
          </button>
        </div>
        <button type="button" class="btn-add-answer" @click="addAnswer">+ Add answer</button>
      </fieldset>

      <div v-if="error" role="alert" class="error msg-error">{{ error }}</div>

      <button type="submit" class="btn-submit" :disabled="submitting">
        {{ submitting ? 'Saving…' : 'Save question' }}
      </button>
    </form>

    <NuxtLink to="/" class="back-link">← Back to quiz</NuxtLink>
  </main>
</template>

<style scoped>
.question-form {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.answers-fieldset {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.answers-fieldset legend {
  padding: 0 var(--space-2);
}

.answer-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.radio-label {
  flex-shrink: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.btn-remove {
  flex-shrink: 0;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  padding: var(--space-1) var(--space-3);
  font-size: 13px;
  white-space: nowrap;
}

.btn-remove:hover:not(:disabled) {
  color: var(--color-error-text);
  border-color: var(--color-error-border);
}

.btn-add-answer {
  align-self: flex-start;
  background: none;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  padding: var(--space-2) var(--space-3);
  font-size: 13px;
}

.btn-add-answer:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-submit {
  align-self: flex-start;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-6);
  font-size: 15px;
  font-weight: 500;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.back-link {
  display: inline-block;
  margin-top: var(--space-6);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  color: var(--color-text);
}
</style>

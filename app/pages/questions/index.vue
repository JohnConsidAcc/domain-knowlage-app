<script setup lang="ts">
interface Answer { id: string; text: string; isCorrect: boolean }
interface Question { id: string; prompt: string; answers: Answer[]; isInvalidated: boolean }

const { data: questions, refresh, pending, error: fetchError } = useFetch<Question[]>('/api/questions', { server: false })

const editing = ref<string | null>(null)
const editPrompt = ref('')
const editAnswers = ref<{ text: string; isCorrect: boolean }[]>([])
const submitting = ref(false)
const error = ref<string | null>(null)
const flagError = ref<string | null>(null)

function startEdit(q: Question) {
  editing.value = q.id
  editPrompt.value = q.prompt
  editAnswers.value = q.answers.map(a => ({ text: a.text, isCorrect: a.isCorrect }))
  error.value = null
}

function cancelEdit() {
  editing.value = null
}

function setCorrect(index: number) {
  editAnswers.value.forEach((a, i) => { a.isCorrect = i === index })
}

function addAnswer() {
  editAnswers.value.push({ text: '', isCorrect: false })
}

function removeAnswer(index: number) {
  editAnswers.value.splice(index, 1)
}

async function saveEdit(id: string) {
  error.value = null
  if (!editPrompt.value.trim()) { error.value = 'Prompt is required.'; return }
  if (editAnswers.value.length < 2) { error.value = 'At least 2 answers required.'; return }
  if (!editAnswers.value.some(a => a.isCorrect)) { error.value = 'Mark one answer as correct.'; return }
  if (editAnswers.value.some(a => !a.text.trim())) { error.value = 'All answers must have text.'; return }

  submitting.value = true
  try {
    await $fetch(`/api/questions/${id}`, {
      method: 'PATCH',
      body: { action: 'correct', prompt: editPrompt.value.trim(), answers: editAnswers.value },
    })
    editing.value = null
    await refresh()
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}

async function flag(id: string) {
  flagError.value = null
  try {
    await $fetch(`/api/questions/${id}`, {
      method: 'PATCH',
      body: { action: 'invalidate' },
    })
    await refresh()
  } catch {
    flagError.value = 'Failed to flag question. Please try again.'
  }
}
</script>

<template>
  <main>
    <h1>All questions</h1>
    <div v-if="pending" class="skel-list" aria-busy="true" aria-label="Loading questions">
      <div v-for="n in 3" :key="n" class="skel-item">
        <div class="skel-line skel-prompt" />
        <div class="skel-line skel-answer" />
        <div class="skel-line skel-answer" />
      </div>
    </div>
    <div v-else-if="fetchError" class="error-banner">Failed to load questions. Please refresh the page.</div>
    <template v-else>
      <div v-if="flagError" class="error-banner">{{ flagError }}</div>
      <p v-if="!questions?.length">No questions found — add some to get started!</p>
      <ul v-else class="question-list" role="list">
        <li v-for="q in questions" :key="q.id" class="question-item">
          <template v-if="editing === q.id">
            <div class="edit-form" role="form" :aria-label="`Edit question: ${q.prompt}`">
              <label :for="`edit-prompt-${q.id}`" class="field-label">Question prompt</label>
              <textarea :id="`edit-prompt-${q.id}`" v-model="editPrompt" rows="3" />
              <fieldset class="edit-answers-fieldset">
                <legend class="field-label">Answers <small>(select the correct one)</small></legend>
                <div v-for="(a, i) in editAnswers" :key="i" class="answer-row">
                  <input
                    type="radio"
                    :name="`correct-${q.id}`"
                    :checked="a.isCorrect"
                    :aria-label="`Mark answer ${i + 1} as correct`"
                    @change="setCorrect(i)"
                  />
                  <input
                    v-model="a.text"
                    type="text"
                    :aria-label="`Answer ${i + 1} text`"
                  />
                  <button
                    type="button"
                    :disabled="editAnswers.length <= 2"
                    :aria-label="`Remove answer ${i + 1}`"
                    @click="removeAnswer(i)"
                  >
                    Remove
                  </button>
                </div>
                <button type="button" @click="addAnswer">+ Add answer</button>
              </fieldset>
              <div v-if="error" role="alert" class="error msg-error">{{ error }}</div>
              <div class="edit-actions">
                <button :disabled="submitting" @click="saveEdit(q.id)">Save</button>
                <button @click="cancelEdit">Cancel</button>
              </div>
            </div>
          </template>
          <template v-else>
            <p class="question-prompt">{{ q.prompt }}</p>
            <ul class="answer-list" role="list">
              <li v-for="a in q.answers" :key="a.id" :class="{ correct: a.isCorrect }">
                {{ a.text }}
              </li>
            </ul>
            <div class="item-actions">
              <button @click="startEdit(q)">Edit</button>
              <button class="flag-btn" @click="flag(q.id)">Flag</button>
            </div>
          </template>
        </li>
      </ul>
    </template>
    <NuxtLink to="/" class="back-link">← Back to quiz</NuxtLink>
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
}

.skel-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.skel-item {
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.skel-line {
  background: var(--color-border);
  border-radius: var(--radius-sm);
  animation: pulse 1.4s ease-in-out infinite;
}

.skel-prompt { height: 18px; width: 80%; }
.skel-answer { height: 14px; width: 50%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.question-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.question-item {
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.question-prompt {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 var(--space-3);
}

.answer-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.answer-list li {
  font-size: 14px;
  color: var(--color-text-secondary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}

.answer-list li.correct {
  color: var(--color-success-text);
  font-weight: 600;
  background: var(--color-success-bg);
}

.item-actions {
  display: flex;
  gap: var(--space-2);
}

.item-actions button {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  padding: var(--space-1) var(--space-3);
  font-size: 13px;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.item-actions button:hover {
  color: var(--color-text);
  border-color: var(--color-text);
}

.flag-btn:hover {
  color: var(--color-error-text) !important;
  border-color: var(--color-error-border) !important;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  display: block;
  margin-bottom: var(--space-2);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.edit-answers-fieldset {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.answer-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.edit-actions {
  display: flex;
  gap: var(--space-2);
}

.edit-actions button {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-4);
  font-size: 14px;
  background: none;
  color: var(--color-text-secondary);
}

.edit-actions button:first-child {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  font-weight: 500;
}

.edit-actions button:first-child:hover:not(:disabled) {
  opacity: 0.9;
}

.back-link {
  display: inline-block;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  color: var(--color-text);
}
</style>

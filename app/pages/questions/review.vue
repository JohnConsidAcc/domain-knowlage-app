<script setup lang="ts">
interface Answer { id: string; text: string; isCorrect: boolean }
interface Question { id: string; prompt: string; answers: Answer[]; isInvalidated: boolean }

const { data: questions, refresh, pending, error: fetchError } = useFetch<Question[]>('/api/questions/invalidated', { server: false })

const editing = ref<string | null>(null)
const editPrompt = ref('')
const editAnswers = ref<{ text: string; isCorrect: boolean }[]>([])
const submitting = ref(false)
const error = ref<string | null>(null)
const deleteError = ref<string | null>(null)

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

async function saveCorrection(id: string) {
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

async function remove(id: string) {
  if (!confirm('Delete this question permanently?')) return
  deleteError.value = null
  try {
    await $fetch(`/api/questions/${id}`, { method: 'DELETE' })
    await refresh()
  } catch {
    deleteError.value = 'Failed to delete question. Please try again.'
  }
}
</script>

<template>
  <main>
    <h1>Review flagged questions</h1>
    <div v-if="pending" class="skel-list" aria-busy="true" aria-label="Loading flagged questions">
      <div v-for="n in 3" :key="n" class="skel-item">
        <div class="skel-line skel-prompt" />
        <div class="skel-line skel-answer" />
        <div class="skel-line skel-answer" />
      </div>
    </div>
    <div v-else-if="fetchError" class="error-banner">Failed to load flagged questions. Please refresh the page.</div>
    <template v-else>
      <div v-if="deleteError" class="error-banner">{{ deleteError }}</div>
      <p v-if="!questions?.length">No flagged questions — everything looks good!</p>
      <ul v-else class="question-list">
        <li v-for="q in questions" :key="q.id" class="question-item">
          <template v-if="editing === q.id">
            <div class="edit-form">
              <textarea v-model="editPrompt" rows="3" />
              <div v-for="(a, i) in editAnswers" :key="i" class="answer-row">
                <input type="radio" :name="`correct-${q.id}`" :checked="a.isCorrect" @change="setCorrect(i)" />
                <input v-model="a.text" type="text" />
                <button type="button" :disabled="editAnswers.length <= 2" @click="removeAnswer(i)">Remove</button>
              </div>
              <button type="button" @click="addAnswer">+ Add answer</button>
              <div v-if="error" class="error">{{ error }}</div>
              <div class="edit-actions">
                <button :disabled="submitting" @click="saveCorrection(q.id)">Save</button>
                <button @click="cancelEdit">Cancel</button>
              </div>
            </div>
          </template>
          <template v-else>
            <p class="question-prompt">{{ q.prompt }}</p>
            <ul class="answer-list">
              <li v-for="a in q.answers" :key="a.id" :class="{ correct: a.isCorrect }">
                {{ a.text }}
              </li>
            </ul>
            <div class="item-actions">
              <button @click="startEdit(q)">Correct</button>
              <button class="delete-btn" @click="remove(q.id)">Delete</button>
            </div>
          </template>
        </li>
      </ul>
    </template>
    <NuxtLink to="/">← Back to quiz</NuxtLink>
  </main>
</template>

<style scoped>
.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #b91c1c;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.skel-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.skel-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skel-line {
  background: #e2e8f0;
  border-radius: 4px;
  animation: pulse 1.4s ease-in-out infinite;
}

.skel-prompt { height: 18px; width: 80%; }
.skel-answer { height: 14px; width: 50%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>

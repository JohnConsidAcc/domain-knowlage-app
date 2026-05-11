<script setup lang="ts">
interface Answer { id: string; text: string; isCorrect: boolean }
interface Question { id: string; prompt: string; answers: Answer[]; isInvalidated: boolean }

const { data: questions, refresh } = await useFetch<Question[]>('/api/questions/invalidated')

const editing = ref<string | null>(null)
const editPrompt = ref('')
const editAnswers = ref<{ text: string; isCorrect: boolean }[]>([])
const submitting = ref(false)
const error = ref<string | null>(null)

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
  await $fetch(`/api/questions/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <main>
    <h1>Review flagged questions</h1>
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
    <NuxtLink to="/">← Back to quiz</NuxtLink>
  </main>
</template>

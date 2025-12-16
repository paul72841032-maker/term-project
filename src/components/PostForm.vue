<template>
  <form @submit.prevent="onSubmit" class="form">
    <div class="row">
      <label class="label">카테고리</label>
      <select v-model="category" class="input" required>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div class="row">
      <label class="label">제목</label>
      <input v-model="title" class="input" placeholder="제목" required />
    </div>

    <div class="row">
      <label class="label">내용</label>
      <textarea v-model="content" class="input" placeholder="내용" rows="5" required />
    </div>

    <div class="actions">
      <button type="button" v-if="mode === 'edit'" class="btn" @click="$emit('cancel')">취소</button>
      <button type="submit" class="btn primary">{{ mode === "create" ? "등록" : "수정 저장" }}</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
    defineProps<{
      mode: "create" | "edit";
      categories?: string[];
      initialTitle?: string;
      initialContent?: string;
      initialCategory?: string;
    }>(),
    {
      categories: () => ["자유", "공지", "QnA"],
    }
);

const emit = defineEmits<{
  (e: "submit", payload: { title: string; content: string; category: string }): void;
  (e: "cancel"): void;
}>();

const title = ref(props.initialTitle ?? "");
const content = ref(props.initialContent ?? "");
const category = ref(props.initialCategory ?? props.categories[0]);

watch(
    () => [props.initialTitle, props.initialContent, props.initialCategory],
    () => {
      title.value = props.initialTitle ?? "";
      content.value = props.initialContent ?? "";
      category.value = props.initialCategory ?? props.categories[0];
    }
);

function onSubmit() {
  emit("submit", { title: title.value, content: content.value, category: category.value });

  if (props.mode === "create") {
    title.value = "";
    content.value = "";
    category.value = props.categories[0];
  }
}
</script>

<style scoped>
.form { display: grid; gap: 10px; }
.row { display: grid; gap: 6px; }
.label { font-size: 13px; color: var(--muted); }

.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--card2);
  color: var(--text);
  outline: none;
}
.input:focus { border-color: rgba(124, 58, 237, 0.6); }

.actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px; }
.btn {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.08);
  color: var(--text);
  cursor: pointer;
}
.primary {
  background: var(--accent);
  border-color: transparent;
  color: white;
  font-weight: 700;
}
</style>

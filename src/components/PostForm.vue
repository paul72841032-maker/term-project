<template>
  <form @submit.prevent="onSubmit" class="form">
    <div class="row">
      <label class="label">카테고리</label>
      <select v-model="category" class="input" required>
        <option v-for="c in categories" :key="c" :value="c">
          {{ c }}
        </option>
      </select>
    </div>

    <div class="row">
      <label class="label">제목</label>
      <input
          v-model="title"
          class="input"
          placeholder="제목"
          required
      />
    </div>

    <div class="row">
      <label class="label">내용</label>
      <textarea
          v-model="content"
          class="input textarea"
          placeholder="내용"
          rows="5"
          required
      ></textarea>
    </div>

    <div class="actions">
      <button
          type="button"
          v-if="mode === 'edit'"
          class="btn"
          @click="$emit('cancel')"
      >
        취소
      </button>

      <button type="submit" class="btn primary">
        {{ mode === "create" ? "등록" : "수정 저장" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

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

const categories = computed(() => props.categories ?? ["자유", "공지", "QnA"]);

const title = ref(props.initialTitle ?? "");
const content = ref(props.initialContent ?? "");
const category = ref(props.initialCategory ?? categories.value[0]);

watch(
    () => [props.initialTitle, props.initialContent, props.initialCategory, categories.value.join("|")],
    () => {
      title.value = props.initialTitle ?? "";
      content.value = props.initialContent ?? "";
      category.value = props.initialCategory ?? categories.value[0];
    }
);

function onSubmit() {
  emit("submit", {
    title: title.value,
    content: content.value,
    category: category.value,
  });

  if (props.mode === "create") {
    title.value = "";
    content.value = "";
    category.value = categories.value[0];
  }
}
</script>

<style scoped>
/* ---------- layout ---------- */
.form {
  display: grid;
  gap: 14px;
  width: 100%;
  padding-right: 4px; /* 오른쪽 삐져나오는 느낌 제거 */
}

.row {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.label {
  font-size: 13px;
  color: var(--muted);
}

/* ---------- input / textarea / select ---------- */
.input {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);

  background: #ffffff;
  color: #111827;
  caret-color: #111827;

  outline: none;
}

.textarea {
  resize: vertical;
}

/* focus */
.input:focus {
  border-color: rgba(124, 58, 237, 0.6);
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
}

/* placeholder */
.input::placeholder {
  color: rgba(17, 24, 39, 0.5);
}

/* select option */
.input option {
  background: #ffffff;
  color: #111827;
}

/* ---------- actions ---------- */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.btn {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  cursor: pointer;
}

.primary {
  background: var(--accent);
  border-color: transparent;
  color: #ffffff;
  font-weight: 700;
}
</style>

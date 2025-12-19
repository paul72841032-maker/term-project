<template>
  <form @submit.prevent="onSubmit" class="form">
    <div class="row">
      <label class="label">카테고리</label>

      <select
          v-model="category"
          class="w-full rounded-lg border border-white/10 bg-white/10 text-white px-3 py-2
               focus:outline-none focus:ring-2 focus:ring-violet-400"
          required
      >
        <option
            v-for="c in categories"
            :key="c"
            :value="c"
            class="text-black"
        >
          {{ c }}
        </option>
      </select>
    </div>

    <div class="row">
      <label class="label">제목</label>
      <input v-model="title" class="input" placeholder="제목" required />
    </div>

    <div class="row">
      <label class="label">내용</label>
      <textarea
          v-model="content"
          class="input"
          placeholder="내용"
          rows="5"
          required
      />
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

/**
 * PostForm은 "입력 UI + submit 이벤트 emit"만 담당
 * 실제 Firestore 저장(createPost/updatePost)은 부모(HomePage/PostDetailPage 등)에서 처리
 */

const props = withDefaults(
    defineProps<{
      mode: "create" | "edit";
      categories?: string[];         // 기본: ["자유","공지","QnA"]
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

// categories는 props가 바뀔 수도 있으니 computed로 안전하게
const categories = computed(() => props.categories ?? ["자유", "공지", "QnA"]);

const title = ref(props.initialTitle ?? "");
const content = ref(props.initialContent ?? "");
const category = ref(props.initialCategory ?? categories.value[0]);

// edit 모드에서 props가 바뀌면 폼 값도 따라가게
watch(
    () => [props.initialTitle, props.initialContent, props.initialCategory, categories.value.join("|")],
    () => {
      title.value = props.initialTitle ?? "";
      content.value = props.initialContent ?? "";
      category.value = props.initialCategory ?? categories.value[0];
    }
);

function onSubmit() {
  // ✅ 디버그: 배포/로컬에서 실제로 어떤 값이 submit되는지 확인용
  console.log("[DEBUG][PostForm] mode =", props.mode);
  console.log("[DEBUG][PostForm] initialCategory =", props.initialCategory);
  console.log("[DEBUG][PostForm] selectedCategory =", category.value);
  console.log("[DEBUG][PostForm] categories =", categories.value);

  emit("submit", {
    title: title.value,
    content: content.value,
    category: category.value,
  });

  // create면 입력값 초기화
  if (props.mode === "create") {
    title.value = "";
    content.value = "";
    category.value = categories.value[0];
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

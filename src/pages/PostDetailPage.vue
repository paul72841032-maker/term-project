<template>
  <section class="wrap">
    <div v-if="loadingPost" class="muted">불러오는 중...</div>

    <div v-else-if="!post" class="card">
      <p>없는 글입니다.</p>
      <router-link to="/">← 홈으로</router-link>
    </div>

    <div v-else class="card">
      <h2 class="title">{{ post.title }}</h2>
      <div class="meta">작성자: {{ post.authorName }}</div>

      <div v-if="!editing" class="content">
        {{ post.content }}
      </div>

      <div v-if="canEdit && !editing" class="actions">
        <button class="btn" @click="editing = true">수정</button>
        <button class="btn danger" @click="onDelete">삭제</button>
      </div>

      <div v-if="canEdit && editing" class="editbox">
        <h3 style="margin: 0 0 8px">수정</h3>
        <PostForm
            mode="edit"
            :initialTitle="post.title"
            :initialContent="post.content"
            @submit="onUpdate"
            @cancel="editing = false"
        />
      </div>

      <div class="back">
        <router-link to="/">← 목록으로</router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { usePosts, type Post } from "../composables/usePosts";
import PostForm from "../components/PostForm.vue";

const route = useRoute();
const router = useRouter();

const { user } = useAuth();
const { getPostById, updatePost, removePost } = usePosts();

const post = ref<Post | null>(null);
const loadingPost = ref(true);
const editing = ref(false);

const canEdit = computed(() => {
  return !!user.value && !!post.value && user.value.uid === post.value.authorId;
});

async function load() {
  loadingPost.value = true;
  editing.value = false;

  const id = String(route.params.id);
  try {
    post.value = await getPostById(id);
  } catch (e) {
    console.error(e);
    post.value = null;
  } finally {
    loadingPost.value = false;
  }
}

// ✅ 라우트 param(id)이 바뀌어도 항상 다시 로드
watch(
    () => route.params.id,
    () => {
      load();
    },
    { immediate: true }
);

async function onUpdate(payload: { title: string; content: string }) {
  if (!post.value) return;
  if (!canEdit.value) return;

  try {
    await updatePost(post.value.id, payload);
    post.value = { ...post.value, ...payload };
    editing.value = false;
  } catch (e) {
    console.error(e);
    alert("수정 실패 (콘솔 확인)");
  }
}

async function onDelete() {
  if (!post.value) return;
  if (!canEdit.value) return;

  if (!confirm("정말 삭제할까요?")) return;

  try {
    await removePost(post.value.id);
    router.push("/");
  } catch (e) {
    console.error(e);
    alert("삭제 실패 (콘솔 확인)");
  }
}
</script>

<style scoped>
.wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
}
.card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
}
.title {
  margin: 0 0 6px;
}
.meta,
.muted {
  color: #666;
  font-size: 14px;
}
.content {
  margin-top: 16px;
  white-space: pre-wrap;
  line-height: 1.5;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
.btn {
  border: 1px solid #ddd;
  background: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}
.btn:hover {
  background: #f6f6f6;
}
.danger {
  border-color: #f1b0b0;
}
.editbox {
  margin-top: 16px;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  background: #fafafa;
}
.back {
  margin-top: 18px;
}
</style>

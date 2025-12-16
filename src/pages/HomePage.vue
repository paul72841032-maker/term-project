<template>
  <section>
    <div class="top">
      <div>
        <h2 class="h2">커뮤니티</h2>

      </div>

      <div class="topActions">
        <select v-model="selectedCategory" class="select">
          <option value="ALL">전체</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>

        <button v-if="user" class="btnPrimary" @click="openWrite = !openWrite">
          {{ openWrite ? "닫기" : "글 작성" }}
        </button>
        <router-link v-else class="btnGhost" to="/login">로그인</router-link>
      </div>
    </div>

    <div v-if="loading" class="card">로그인 상태 확인 중...</div>

    <div v-else>
      <div v-if="user && openWrite" class="card">
        <div class="cardHeader">
          <div class="cardTitle">새 글 작성</div>
          <div class="mutedSmall">카테고리를 선택하고 등록하세요.</div>
        </div>

        <PostForm
            mode="create"
            :categories="categories"
            @submit="handleCreate"
        />
      </div>

      <PostList
          :posts="filteredPosts"
          :loading="postsLoading"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useAuth } from "../composables/useAuth";
import { usePosts } from "../composables/usePosts";
import PostForm from "../components/PostForm.vue";
import PostList from "../components/PostList.vue";

const { user, loading } = useAuth();
const { list, postsLoading, subscribePosts, createPost } = usePosts();

// ✅ 카테고리 목록(원하면 더 추가 가능)
const categories = ["자유", "공지", "QnA"] as const;

const openWrite = ref(false);
const selectedCategory = ref<"ALL" | (typeof categories)[number]>("ALL");

let unsub: null | (() => void) = null;
onMounted(() => {
  unsub = subscribePosts();
});
onUnmounted(() => {
  if (unsub) unsub();
});

const filteredPosts = computed(() => {
  const all = list.value ?? [];
  if (selectedCategory.value === "ALL") return all;
  return all.filter((p) => p.category === selectedCategory.value);
});

async function handleCreate(payload: { title: string; content: string; category: string }) {
  if (!user.value) {
    alert("로그인 후 작성 가능");
    return;
  }

  try {
    await createPost({
      title: payload.title,
      content: payload.content,
      category: payload.category,
      authorId: user.value.uid,
      authorName: user.value.displayName || user.value.email || "anonymous",
    });
    openWrite.value = false;
  } catch (e) {
    console.error(e);
    alert("등록 실패 (콘솔 확인)");
  }
}
</script>

<style scoped>
.h2 { margin: 0; font-size: 28px; letter-spacing: -0.3px; }
.sub { margin: 6px 0 0; color: var(--muted); }

.top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.topActions { display: flex; gap: 10px; align-items: center; }

.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 14px;
  backdrop-filter: blur(10px);
}

.cardHeader { margin-bottom: 10px; }
.cardTitle { font-weight: 800; }
.mutedSmall { color: var(--muted); font-size: 13px; margin-top: 4px; }

.select {
  background: var(--card2);
  border: 1px solid var(--line);
  color: var(--text);
  padding: 9px 12px;
  border-radius: 12px;
  outline: none;
}

.btnPrimary {
  background: var(--accent);
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
}
.btnPrimary:hover { filter: brightness(1.05); }

.btnGhost {
  display: inline-block;
  text-decoration: none;
  color: var(--text);
  background: var(--card2);
  border: 1px solid var(--line);
  padding: 10px 14px;
  border-radius: 12px;
}
.btnGhost:hover { background: rgba(255,255,255,0.16); }
</style>

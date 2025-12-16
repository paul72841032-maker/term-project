<template>
  <section class="list">
    <div class="listHead">
      <h3 class="h3">전체 글</h3>
      <span class="muted" v-if="!loading">{{ posts.length }}개</span>
    </div>

    <div v-if="loading" class="card">불러오는 중...</div>
    <div v-else-if="posts.length === 0" class="card muted">글이 없어요.</div>

    <ul v-else class="grid">
      <li v-for="p in posts" :key="p.id" class="postCard">
        <router-link class="link" :to="`/posts/${p.id}`">
          <div class="badge">{{ p.category }}</div>
          <div class="title">{{ p.title }}</div>
          <div class="meta">작성자: {{ p.authorName }}</div>
          <div class="preview">{{ preview(p.content) }}</div>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { Post } from "../composables/usePosts";

withDefaults(defineProps<{ posts?: Post[]; loading: boolean }>(), {
  posts: () => [],
});

function preview(text: string) {
  return text.length > 120 ? text.slice(0, 120) + "..." : text;
}
</script>

<style scoped>
.list { margin-top: 14px; }
.listHead { display:flex; align-items:center; justify-content:space-between; margin-bottom: 10px; }
.h3 { margin: 0; }
.muted { color: var(--muted); }

.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 14px;
}

.grid { list-style:none; padding:0; margin:0; display:grid; gap: 12px; }
.postCard {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
}
.link { display:block; padding: 14px; text-decoration:none; color: inherit; }
.link:hover { background: rgba(255,255,255,0.04); }

.badge {
  display:inline-block;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(124,58,237,0.25);
  border: 1px solid rgba(124,58,237,0.35);
  margin-bottom: 8px;
}
.title { font-weight: 900; font-size: 16px; }
.meta { color: var(--muted); font-size: 13px; margin-top: 4px; }
.preview { margin-top: 10px; color: rgba(255,255,255,0.82); white-space: pre-wrap; }
</style>

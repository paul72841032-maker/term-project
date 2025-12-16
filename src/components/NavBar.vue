<template>
  <header class="bar">
    <div class="inner">
      <!-- 홈 아이콘 + 배너(브랜드) -->
      <router-link class="home" to="/" aria-label="Home">
        <span class="iconWrap" aria-hidden="true">
          <!-- Home icon (SVG) -->
          <svg viewBox="0 0 24 24" class="icon">
            <path
                d="M12 3.2 3.5 10.2a1 1 0 0 0 .6 1.8H5v8a1 1 0 0 0 1 1h4.5a1 1 0 0 0 1-1v-5h1v5a1 1 0 0 0 1 1H18a1 1 0 0 0 1-1v-8h.9a1 1 0 0 0 .6-1.8L12 3.2Z"
                fill="currentColor"
            />
          </svg>
        </span>
        <span class="brand">Community</span>
      </router-link>

      <nav class="right">
        <span v-if="loading" class="muted">로딩...</span>

        <template v-else-if="user">
          <span class="user">{{ user.displayName || user.email }}</span>
          <button class="btn" @click="logout">로그아웃</button>
        </template>

        <template v-else>
          <router-link class="btn link" to="/login">로그인</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from "../composables/useAuth";
const { user, loading, logout } = useAuth();
</script>

<style scoped>
.bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(10px);
}
.inner {
  max-width: 980px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.home {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}

.iconWrap {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--line);
}
.icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.92);
}

.brand {
  font-weight: 900;
  letter-spacing: -0.2px;
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.86);
}
.muted {
  color: var(--muted);
  font-size: 14px;
}

.btn {
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.08);
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
  color: inherit;
}
.btn:hover {
  background: rgba(255, 255, 255, 0.14);
}
.link {
  text-decoration: none;
  display: inline-block;
}
</style>

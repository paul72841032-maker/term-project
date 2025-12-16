<template>
  <section style="max-width:520px; margin: 0 auto; padding: 24px 0;">
    <h2>로그인</h2>
    <p style="color:#555;">Google 계정으로 로그인합니다.</p>
    <button @click="loginWithGoogle" :disabled="loading" style="margin-top:12px;">
      Google로 로그인
    </button>
    <p v-if="user" style="margin-top:12px;">
      로그인됨: {{ user.displayName || user.email }} /
      <router-link to="/">홈으로</router-link>
    </p>
  </section>
</template>

<script setup lang="ts">
import { useAuth } from "../composables/useAuth";
const { user, loading, loginWithGoogle } = useAuth();
</script>

<style scoped>
button { padding: 10px 12px; cursor: pointer; }
</style>

<template>
  <div class="app">
    <NavBar />
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
</script>

<style>
:root {
  --bg: #0b1220;
  --card: rgba(255, 255, 255, 0.08);
  --card2: rgba(255, 255, 255, 0.12);
  --text: rgba(255, 255, 255, 0.92);
  --muted: rgba(255, 255, 255, 0.65);
  --line: rgba(255, 255, 255, 0.12);
  --accent: #7c3aed;
}

.app {
  min-height: 100vh;
  background:
      radial-gradient(1200px 600px at 10% 10%, rgba(124, 58, 237, 0.35), transparent 60%),
      radial-gradient(900px 500px at 90% 20%, rgba(59, 130, 246, 0.25), transparent 60%),
      radial-gradient(700px 500px at 50% 100%, rgba(16, 185, 129, 0.18), transparent 60%),
      var(--bg);
  color: var(--text);
}

.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 18px 16px 40px;
}
</style>

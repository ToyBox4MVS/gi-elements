<template>
  <div class="app">
    <IndexPage />
  </div>
</template>

<script setup>
import IndexPage from './pages/IndexPage.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #0f0f23;
  color: #e8d5b7;
  font-family: 'Cinzel', 'Times New Roman', serif;
  min-height: 100vh;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}
</style>

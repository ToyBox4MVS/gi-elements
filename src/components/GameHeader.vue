<template>
  <div class="game-header">
    <h1 class="title">GI Elements</h1>
    <div class="stats">
      <div class="stat">
        <span class="stat-label">Ходы</span>
        <span class="stat-value">{{ moves }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Осталось</span>
        <span class="stat-value">{{ remaining }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  moves: { type: Number, default: 0 },
  remaining: { type: Number, default: 0 },
})
</script>

<style scoped>
.game-header {
  text-align: center;
  padding: 20px;
  background: linear-gradient(180deg, #1a1a3e 0%, #0f0f23 100%);
  border-bottom: 2px solid #c9a227;
}

.title {
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-size: 2.5rem;
  color: #d4af37;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  margin: 0 0 15px 0;
  letter-spacing: 3px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.85rem;
  color: #8a7a5a;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.stat-value {
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-size: 1.8rem;
  color: #e8d5b7;
  font-weight: bold;
}
</style>

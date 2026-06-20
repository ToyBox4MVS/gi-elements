<template>
  <Transition name="overlay">
    <div v-if="show" class="overlay" @click.self="$emit('close')">
      <div class="overlay-content">
        <div class="overlay-icon">{{ won ? '🏆' : '❌' }}</div>
        <h2 class="overlay-title">{{ won ? 'Победа!' : 'Игра окончена' }}</h2>
        <p class="overlay-text">
          {{ won
            ? `Вы убрали все пары за ${moves} ходов!`
            : 'На поле не осталось возможных ходов.'
          }}
        </p>
        <div class="overlay-actions">
          <button class="btn btn-primary" @click="$emit('new-game')">
            Новая игра
          </button>
          <button v-if="!won" class="btn btn-secondary" @click="$emit('close')">
            Продолжить
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  won: { type: Boolean, default: false },
  moves: { type: Number, default: 0 },
})

defineEmits(['new-game', 'close'])
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 15, 35, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(5px);
}

.overlay-content {
  text-align: center;
  padding: 40px;
  background: linear-gradient(180deg, #1a1a3e 0%, #0f0f23 100%);
  border: 2px solid #c9a227;
  border-radius: 12px;
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.2);
  max-width: 400px;
}

.overlay-icon {
  font-size: 4rem;
  margin-bottom: 15px;
}

.overlay-title {
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-size: 2rem;
  color: #d4af37;
  margin: 0 0 10px 0;
}

.overlay-text {
  color: #e8d5b7;
  font-size: 1.1rem;
  margin: 0 0 25px 0;
  line-height: 1.5;
}

.overlay-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-size: 1rem;
  padding: 10px 24px;
  border: 2px solid;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: linear-gradient(180deg, #d4af37 0%, #b8942a 100%);
  color: #1a1a2e;
  border-color: #d4af37;
  font-weight: bold;
}

.btn-primary:hover {
  background: linear-gradient(180deg, #e8c84a 0%, #d4af37 100%);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #8a7a5a;
  border-color: #8a7a5a;
}

.btn-secondary:hover {
  color: #d4af37;
  border-color: #d4af37;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="fab-container">
    <Transition name="menu">
      <div v-if="isOpen" class="fab-menu">
        <button
          class="fab-item"
          @click="handleAction('open-settings')"
          title="Настройки"
        >
          <i class="fa-solid fa-gear"></i>
          <span class="fab-label">Настройки</span>
        </button>
      </div>
    </Transition>

    <button
      class="fab-main"
      :class="{ 'fab-open': isOpen }"
      @click="toggleMenu"
      :title="isOpen ? 'Закрыть меню' : 'Настройки'"
    >
      <i class="fa-solid fa-gear" :class="{ 'fa-spin': isOpen }"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['open-settings'])

const isOpen = ref(false)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function handleAction(action) {
  emit(action)
  isOpen.value = false
}
</script>

<style scoped>
.fab-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 50;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
  gap: 12px;
}

.fab-main {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a3e 0%, #0f0f23 100%);
  border: 2px solid #8a7a5a;
  color: #8a7a5a;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.fab-main:hover {
  color: #d4af37;
  border-color: #d4af37;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
}

.fab-main.fab-open {
  color: #d4af37;
  border-color: #d4af37;
}

.fab-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fab-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #1a1a3e 0%, #0f0f23 100%);
  border: 2px solid #c9a227;
  border-radius: 28px;
  color: #e8d5b7;
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.fab-item:hover {
  background: linear-gradient(135deg, #2a2a4e 0%, #1a1a3e 100%);
  border-color: #d4af37;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
}

.fab-item i {
  font-size: 1.1rem;
}

.fab-label {
  font-weight: 600;
}

.menu-enter-active,
.menu-leave-active {
  transition: all 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

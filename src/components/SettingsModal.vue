<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h2 class="modal-title">Настройки</h2>

        <div class="setting-group">
          <label class="setting-label">Макс. сторона поля: {{ settings.gridSize }}</label>
          <input
            type="range"
            :min="3"
            :max="9"
            v-model.number="settings.gridSize"
            class="slider"
          />
          <div class="slider-labels">
            <span>3</span>
            <span>6</span>
            <span>9</span>
          </div>
          <p class="setting-desc">Поле начинается со стороны 3 и расширяется при необходимости</p>
        </div>

        <div class="setting-group">
          <label class="setting-label">
            <span>Бездна (8-й элемент)</span>
            <label class="toggle">
              <input type="checkbox" v-model="settings.includeAbyss" />
              <span class="toggle-slider"></span>
            </label>
          </label>
          <p class="setting-desc">Универсальный элемент, совместимый с любым</p>
        </div>

        <div class="setting-group">
          <label class="setting-label">
            <span>Показывать подсказку</span>
            <label class="toggle">
              <input type="checkbox" v-model="settings.showHint" />
              <span class="toggle-slider"></span>
            </label>
          </label>
          <p class="setting-desc">Кнопка помощи при поиске пар</p>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" @click="$emit('close')">Закрыть</button>
          <button class="btn btn-primary" @click="handleApply">Применить</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useSettings } from '../composables/useSettings.js'

defineProps({
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'apply'])
const { settings } = useSettings()

function handleApply() {
  emit('apply')
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
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

.modal-content {
  background: linear-gradient(180deg, #1a1a3e 0%, #0f0f23 100%);
  border: 2px solid #c9a227;
  border-radius: 12px;
  padding: 30px;
  min-width: 360px;
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.2);
}

.modal-title {
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-size: 1.6rem;
  color: #d4af37;
  text-align: center;
  margin: 0 0 25px 0;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #e8d5b7;
  font-size: 1rem;
  margin-bottom: 8px;
}

.setting-desc {
  color: #8a7a5a;
  font-size: 0.8rem;
  margin: 4px 0 0 0;
}

.slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #2a2a4e;
  border-radius: 3px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #d4af37;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #0f0f23;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #d4af37;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #0f0f23;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  color: #8a7a5a;
  font-size: 0.75rem;
  margin-top: 4px;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #2a2a4e;
  border-radius: 12px;
  transition: 0.3s;
  border: 1px solid #8a7a5a;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background: #8a7a5a;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .toggle-slider {
  background: #d4af37;
  border-color: #d4af37;
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(24px);
  background: #1a1a3e;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
}

.btn {
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-size: 0.95rem;
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

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

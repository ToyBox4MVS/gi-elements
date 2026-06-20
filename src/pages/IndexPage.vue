<template>
  <div class="game-container">
    <div class="title-bar">
      <h1 class="title">GI Elements</h1>
      <div class="stats">
        <div class="stat">
          <span class="stat-label">Ходы</span>
          <span class="stat-value">{{ state.moves.value }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Осталось</span>
          <span class="stat-value">
            {{ state.remainingCount.value }}<span v-if="state.hiddenCount.value > 0" class="hidden-count"> ({{ state.hiddenCount.value }})</span>
          </span>
        </div>
      </div>
    </div>

    <div class="board-wrapper">
      <button class="corner-btn corner-tl" @click="handleNewGame" title="Новая игра">
        <i class="fa-solid fa-rotate-right"></i>
      </button>

      <div class="top-center-btns">
        <button
          class="corner-btn corner-tc"
          @click="showSettings = true"
          title="Настройки"
        >
          <i class="fa-solid fa-gear"></i>
        </button>
        <button
          class="corner-btn corner-tc"
          @click="showRules = true"
          title="Правила"
        >
          <i class="fa-solid fa-circle-question"></i>
        </button>
      </div>

      <button
        v-if="state.settings.showHint"
        class="corner-btn corner-tr"
        :disabled="!hasValidMoves"
        @click="handleHint"
        title="Подсказка"
      >
        <i class="fa-solid fa-lightbulb"></i>
      </button>

      <button
        class="corner-btn corner-bl"
        :disabled="state.history.value.length === 0"
        @click="handleUndo"
        title="Отмена"
      >
        <i class="fa-solid fa-rotate-left"></i>
      </button>

      <button
        class="corner-btn corner-br"
        :disabled="!canAdd"
        @click="handleAdd"
        title="Добавить"
      >
        <i class="fa-solid fa-plus"></i>
      </button>

      <div class="game-board">
        <HexGrid
          :grid="state.grid.value"
          :gridSize="state.currentSize.value"
          :selectedKey="state.selected.value"
          :highlightedKeys="reachableKeys"
          @hex-click="handleHexClick"
          @background-click="state.clearSelection()"
        />
      </div>
    </div>

    <div v-if="hintPair" class="hint-indicator">
      Подсказка: попробуйте удалить эту пару
    </div>

    <GameOverlay
      :show="state.gameOver.value"
      :won="state.gameWon.value"
      :moves="state.moves.value"
      @new-game="handleNewGame"
      @close="state.gameOver.value = false"
    />

    <SettingsModal
      :show="showSettings"
      @close="showSettings = false"
      @apply="handleNewGame"
    />

    <RulesModal
      :show="showRules"
      @close="showRules = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HexGrid from '../components/HexGrid.vue'
import GameOverlay from '../components/GameOverlay.vue'
import SettingsModal from '../components/SettingsModal.vue'
import RulesModal from '../components/RulesModal.vue'
import { useGameState } from '../composables/useGameState.js'
import { useGameLogic } from '../composables/useGameLogic.js'

const state = useGameState()
const logic = useGameLogic()

const showSettings = ref(false)
const showRules = ref(false)
const hintPair = ref(null)
const reachableKeys = ref([])

const hasValidMoves = computed(() => {
  return logic.findValidMoves(state.grid.value, state.settings.includeAbyss).length > 0
})

const canAdd = computed(() => {
  return !hasValidMoves.value && state.remainingCount.value > 1
})

function handleHexClick(key) {
  const result = state.selectHex(key)
  if (result) {
    const { first, second } = result
    if (logic.canRemove(state.grid.value, first, second, state.settings.includeAbyss)) {
      state.removePair(first, second)
      reachableKeys.value = []
      hintPair.value = null
    } else {
      state.clearSelection()
      reachableKeys.value = []
    }
  } else if (state.selected.value) {
    reachableKeys.value = logic.highlightReachable(state.grid.value, state.selected.value, state.settings.includeAbyss)
  } else {
    reachableKeys.value = []
  }
}

function handleNewGame() {
  state.initGame()
  reachableKeys.value = []
  hintPair.value = null
}

function handleUndo() {
  state.undoMove()
  reachableKeys.value = []
  hintPair.value = null
}

function handleHint() {
  const moves = logic.findValidMoves(state.grid.value, state.settings.includeAbyss)
  if (moves.length > 0) {
    const move = moves[Math.floor(Math.random() * moves.length)]
    hintPair.value = move
    state.selected.value = move.first
    reachableKeys.value = [move.second]
  }
}

function handleAdd() {
  state.addElements()
  reachableKeys.value = []
  hintPair.value = null
}

onMounted(() => {
  state.initGame()
})
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
}

.title-bar {
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

.hidden-count {
  font-size: 1rem;
  color: #8a7a5a;
  font-weight: normal;
}

.board-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 60px;
}

.game-board {
  display: flex;
  align-items: center;
  justify-content: center;
}

.corner-btn {
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a3e 0%, #0f0f23 100%);
  border: 2px solid #c9a227;
  color: #d4af37;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.corner-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2a2a4e 0%, #1a1a3e 100%);
  border-color: #d4af37;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
}

.corner-btn:hover:not(:disabled):not(.corner-tc) {
  transform: scale(1.1);
}

.top-center-btns {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.top-center-btns .corner-tc {
  position: static;
  transform: none;
}

.top-center-btns .corner-tc:hover:not(:disabled) {
  transform: scale(1.1);
}

.corner-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.corner-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.corner-tl {
  top: 15px;
  left: 15px;
}

.corner-tr {
  top: 15px;
  right: 15px;
}

.corner-bl {
  bottom: 15px;
  left: 15px;
}

.corner-br {
  bottom: 15px;
  right: 15px;
}

.hint-indicator {
  text-align: center;
  padding: 10px;
  color: #50c8b0;
  font-size: 0.9rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>

<template>
  <svg
    :viewBox="viewBox"
    class="hex-svg"
    @click.self="$emit('background-click')"
  >
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="glow-strong">
        <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <radialGradient id="hex-bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#2a2a4e" />
        <stop offset="100%" stop-color="#1a1a3e" />
      </radialGradient>
    </defs>

    <g :transform="`translate(${offsetX}, ${offsetY})`">
      <g
        v-for="hex in hexes"
        :key="hexKey(hex)"
        class="hex-group"
        :class="{
          'selected': selectedKey === hexKey(hex),
          'highlighted': highlightedKeys.includes(hexKey(hex)),
          'empty': isEmpty(hexKey(hex))
        }"
        @click.stop="$emit('hex-click', hexKey(hex))"
      >
        <polygon
          :points="hexPoints(hex)"
          :fill="getHexFill(hex)"
          :stroke="getHexStroke(hex)"
          stroke-width="2"
          :filter="selectedKey === hexKey(hex) ? 'url(#glow-strong)' : (highlightedKeys.includes(hexKey(hex)) ? 'url(#glow)' : '')"
        />
        <image
          v-if="!isEmpty(hexKey(hex))"
          :href="getElementIcon(hexKey(hex))"
          :x="hexCenter(hex).x - 16"
          :y="hexCenter(hex).y - 16"
          width="32"
          height="32"
          class="hex-icon"
        />
      </g>
    </g>
  </svg>
</template>

<script setup>
import { computed, watch } from 'vue'
import { hexToPixel, hexKey as hKey, generateHexGrid } from '../utils/hex.js'
import { ELEMENT_MAP } from '../utils/elements.js'
import { HEX_SIZE, COLORS } from '../utils/constants.js'

const props = defineProps({
  grid: { type: Map, required: true },
  gridSize: { type: Number, default: 3 },
  selectedKey: { type: String, default: null },
  highlightedKeys: { type: Array, default: () => [] },
})

defineEmits(['hex-click', 'background-click'])

const hexes = computed(() => generateHexGrid(props.gridSize))

function hexKey(hex) {
  return hKey(hex)
}

function hexCenter(hex) {
  return hexToPixel(hex.q, hex.r, HEX_SIZE)
}

function hexPoints(hex) {
  const center = hexCenter(hex)
  const points = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30)
    points.push(
      `${center.x + HEX_SIZE * Math.cos(angle)},${center.y + HEX_SIZE * Math.sin(angle)}`
    )
  }
  return points.join(' ')
}

function getHexFill(hex) {
  const key = hexKey(hex)
  if (props.selectedKey === key) return COLORS.hexSelected + '40'
  if (props.highlightedKeys.includes(key)) return COLORS.hexHighlighted + '30'
  return 'url(#hex-bg)'
}

function getHexStroke(hex) {
  const key = hexKey(hex)
  if (props.selectedKey === key) return COLORS.hexSelected
  if (props.highlightedKeys.includes(key)) return COLORS.hexHighlighted
  return COLORS.hexStroke
}

function isEmpty(key) {
  return props.grid.get(key) === null || props.grid.get(key) === undefined
}

function getElementIcon(key) {
  const elemId = props.grid.get(key)
  if (!elemId) return ''
  return ELEMENT_MAP[elemId]?.icon || ''
}

const bounds = computed(() => {
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  for (const hex of hexes.value) {
    const p = hexCenter(hex)
    minX = Math.min(minX, p.x - HEX_SIZE)
    maxX = Math.max(maxX, p.x + HEX_SIZE)
    minY = Math.min(minY, p.y - HEX_SIZE)
    maxY = Math.max(maxY, p.y + HEX_SIZE)
  }
  return { minX, maxX, minY, maxY }
})

const viewBox = computed(() => {
  const b = bounds.value
  const padding = 20
  return `${b.minX - padding} ${b.minY - padding} ${b.maxX - b.minX + padding * 2} ${b.maxY - b.minY + padding * 2}`
})

const offsetX = computed(() => 0)
const offsetY = computed(() => 0)
</script>

<style scoped>
.hex-svg {
  width: 100%;
  height: 100%;
  max-width: 700px;
  max-height: 700px;
}

.hex-group {
  cursor: pointer;
  transition: all 0.2s ease;
}

.hex-group:hover polygon {
  filter: brightness(1.3);
}

.hex-group.selected polygon {
  stroke-width: 3;
}

.hex-group.highlighted polygon {
  stroke-width: 3;
}

.hex-group.empty {
  pointer-events: none;
}

.hex-icon {
  pointer-events: none;
  user-select: none;
}
</style>

import { ref, computed } from 'vue'
import { ELEMENTS, ABYSS_ID } from '../utils/elements.js'
import { generateHexGrid, hexKey, getEmptyHexesByDistance, expandGrid, isOuterLevelEmpty, getInnerEmptyCount, shrinkGrid } from '../utils/hex.js'
import { GRID_SIZE } from '../utils/constants.js'
import { useSettings } from './useSettings.js'

export function useGameState() {
  const { settings } = useSettings()
  const grid = ref(new Map())
  const currentSize = ref(GRID_SIZE)
  const selected = ref(null)
  const moves = ref(0)
  const history = ref([])
  const gameOver = ref(false)
  const gameWon = ref(false)
  const hiddenElements = ref([])

  const remainingCount = computed(() => {
    let count = 0
    for (const val of grid.value.values()) {
      if (val !== null) count++
    }
    return count
  })

  const hiddenCount = computed(() => hiddenElements.value.length)

  const totalCount = computed(() => remainingCount.value + hiddenCount.value)

  function initGame() {
    currentSize.value = GRID_SIZE
    hiddenElements.value = []
    const hexes = generateHexGrid(currentSize.value)
    const elements = generateElementPool(hexes.length, settings.includeAbyss)

    const newGrid = new Map()
    for (let i = 0; i < hexes.length; i++) {
      const key = hexKey(hexes[i])
      newGrid.set(key, elements[i])
    }

    grid.value = newGrid
    selected.value = null
    moves.value = 0
    history.value = []
    gameOver.value = false
    gameWon.value = false
  }

  function generateElementPool(count, includeAbyss) {
    const regularElements = ELEMENTS.filter(e => e.id !== ABYSS_ID)
    const availableTypes = includeAbyss
      ? [...regularElements.map(e => e.id), ABYSS_ID]
      : regularElements.map(e => e.id)

    const maxPerType = Math.floor(count * 0.2)
    const counts = {}
    for (const type of availableTypes) {
      counts[type] = 0
    }

    const pool = []
    for (let i = 0; i < count; i++) {
      const available = availableTypes.filter(t => counts[t] < maxPerType)
      if (available.length === 0) break

      const elem = available[Math.floor(Math.random() * available.length)]
      pool.push(elem)
      counts[elem]++
    }

    while (pool.length < count) {
      pool.push(null)
    }

    shuffle(pool)
    return pool
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  function selectHex(key) {
    if (gameOver.value || gameWon.value) return
    if (grid.value.get(key) === null) return

    if (selected.value === null) {
      selected.value = key
    } else if (selected.value === key) {
      selected.value = null
    } else {
      return { first: selected.value, second: key }
    }
    return null
  }

  function clearSelection() {
    selected.value = null
  }

  function removePair(firstKey, secondKey) {
    const firstElem = grid.value.get(firstKey)
    const secondElem = grid.value.get(secondKey)
    history.value.push({
      first: firstKey,
      firstElem,
      second: secondKey,
      secondElem,
    })
    grid.value.set(firstKey, null)
    grid.value.set(secondKey, null)
    selected.value = null
    moves.value++

    if (remainingCount.value <= 1 && hiddenCount.value === 0) {
      gameOver.value = true
      gameWon.value = remainingCount.value === 1
    }
  }

  function undoMove() {
    if (history.value.length === 0) return

    const last = history.value.pop()
    grid.value.set(last.first, last.firstElem)
    grid.value.set(last.second, last.secondElem)
    moves.value--
    gameOver.value = false
    gameWon.value = false
  }

  function addElements() {
    let elementsToFill = []

    if (hiddenElements.value.length > 0) {
      elementsToFill = [...hiddenElements.value]
      hiddenElements.value = []
    } else {
      const elementsOnBoard = []
      for (const val of grid.value.values()) {
        if (val !== null) {
          elementsOnBoard.push(val)
        }
      }

      if (elementsOnBoard.length === 0) return

      shuffle(elementsToFill = elementsOnBoard)
    }

    if (elementsToFill.length === 0) return

    if (currentSize.value > GRID_SIZE &&
        isOuterLevelEmpty(grid.value, currentSize.value) &&
        getInnerEmptyCount(grid.value, currentSize.value) >= elementsToFill.length) {
      const result = shrinkGrid(grid.value, currentSize.value)
      grid.value = result.grid
      currentSize.value = result.size
    }

    let emptyHexes = getEmptyHexesByDistance(grid.value, currentSize.value)

    while (emptyHexes.length < elementsToFill.length && currentSize.value < settings.gridSize) {
      const result = expandGrid(grid.value, currentSize.value)
      grid.value = result.grid
      currentSize.value = result.size
      emptyHexes = getEmptyHexesByDistance(grid.value, currentSize.value)
    }

    const fillCount = Math.min(emptyHexes.length, elementsToFill.length)
    const newGrid = new Map(grid.value)
    for (let i = 0; i < fillCount; i++) {
      const key = hexKey(emptyHexes[i])
      newGrid.set(key, elementsToFill[i])
    }
    grid.value = newGrid

    if (elementsToFill.length > fillCount) {
      hiddenElements.value = elementsToFill.slice(fillCount)
    }
  }

  return {
    grid,
    currentSize,
    selected,
    moves,
    history,
    gameOver,
    gameWon,
    remainingCount,
    hiddenCount,
    totalCount,
    settings,
    initGame,
    selectHex,
    clearSelection,
    removePair,
    undoMove,
    addElements,
  }
}

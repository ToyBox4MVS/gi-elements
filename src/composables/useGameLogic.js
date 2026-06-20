import { ABYSS_ID } from '../utils/elements.js'
import { areOnSameAxis, getHexesBetween, keyToHex, hexKey } from '../utils/hex.js'

export function useGameLogic() {
  function canRemove(grid, firstKey, secondKey, includeAbyss = true) {
    const firstElem = grid.get(firstKey)
    const secondElem = grid.get(secondKey)

    if (firstElem === null || secondElem === null) return false

    const isSameElement = firstElem === secondElem
    const isAbyssPair = includeAbyss && (firstElem === ABYSS_ID || secondElem === ABYSS_ID)

    if (!isSameElement && !isAbyssPair) return false

    const first = keyToHex(firstKey)
    const second = keyToHex(secondKey)

    if (!areOnSameAxis(first, second)) return false

    const between = getHexesBetween(first, second)
    for (const hex of between) {
      if (grid.get(hexKey(hex)) !== null) return false
    }

    return true
  }

  function findValidMoves(grid, includeAbyss = true) {
    const moves = []
    const keys = []

    for (const [key, val] of grid.entries()) {
      if (val !== null) keys.push(key)
    }

    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        if (canRemove(grid, keys[i], keys[j], includeAbyss)) {
          moves.push({ first: keys[i], second: keys[j] })
        }
      }
    }

    return moves
  }

  function highlightReachable(grid, selectedKey, includeAbyss = true) {
    if (!selectedKey) return []
    const selectedElem = grid.get(selectedKey)
    if (selectedElem === null) return []

    const selected = keyToHex(selectedKey)
    const reachable = []

    for (const [key, val] of grid.entries()) {
      if (val === null || key === selectedKey) continue

      const isSameElement = val === selectedElem
      const isAbyss = includeAbyss && (val === ABYSS_ID || selectedElem === ABYSS_ID)

      if (!isSameElement && !isAbyss) continue

      const hex = keyToHex(key)
      if (!areOnSameAxis(selected, hex)) continue

      const between = getHexesBetween(selected, hex)
      let blocked = false
      for (const b of between) {
        if (grid.get(hexKey(b)) !== null) {
          blocked = true
          break
        }
      }

      if (!blocked) reachable.push(key)
    }

    return reachable
  }

  return { canRemove, findValidMoves, highlightReachable }
}

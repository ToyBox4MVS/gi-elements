import { GRID_SIZE } from './constants.js'

export function generateHexGrid(size = GRID_SIZE) {
  const hexes = []
  for (let q = -(size - 1); q <= size - 1; q++) {
    const r1 = Math.max(-(size - 1), -q - (size - 1))
    const r2 = Math.min(size - 1, -q + (size - 1))
    for (let r = r1; r <= r2; r++) {
      hexes.push({ q, r, s: -q - r })
    }
  }
  return hexes
}

export function hexToPixel(q, r, size) {
  const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r)
  const y = size * (1.5 * r)
  return { x, y }
}

export function hexDistance(a, b) {
  return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s))
}

export function areOnSameAxis(a, b) {
  return a.q === b.q || a.r === b.r || a.s === b.s
}

export function getAxisBetween(a, b) {
  if (a.q === b.q) return 'q'
  if (a.r === b.r) return 'r'
  if (a.s === b.s) return 's'
  return null
}

export function getHexesBetween(a, b, size = GRID_SIZE) {
  const axis = getAxisBetween(a, b)
  if (!axis) return []

  const dist = hexDistance(a, b)
  if (dist <= 1) return []

  const between = []
  for (let i = 1; i < dist; i++) {
    const t = i / dist
    let fq = a.q + (b.q - a.q) * t
    let fr = a.r + (b.r - a.r) * t
    let fs = a.s + (b.s - a.s) * t

    let rq = Math.round(fq)
    let rq_diff = Math.abs(rq - fq)

    let rr = Math.round(fr)
    let rr_diff = Math.abs(rr - fr)

    let rs = Math.round(fs)
    let rs_diff = Math.abs(rs - fs)

    if (rq_diff > rr_diff && rq_diff > rs_diff) {
      rq = -rr - rs
    } else if (rr_diff > rs_diff) {
      rr = -rq - rs
    } else {
      rs = -rq - rr
    }

    between.push({ q: rq, r: rr, s: rs })
  }
  return between
}

export function hexKey(hex) {
  return `${hex.q},${hex.r}`
}

export function keyToHex(key) {
  const [q, r] = key.split(',').map(Number)
  return { q, r, s: -q - r }
}

export function getHexNeighbors(hex) {
  const dirs = [
    { q: 1, r: 0, s: -1 },
    { q: 1, r: -1, s: 0 },
    { q: 0, r: -1, s: 1 },
    { q: -1, r: 0, s: 1 },
    { q: -1, r: 1, s: 0 },
    { q: 0, r: 1, s: -1 },
  ]
  return dirs.map(d => ({ q: hex.q + d.q, r: hex.r + d.r, s: hex.s + d.s }))
}

export function hexDistanceFromCenter(hex) {
  return Math.max(Math.abs(hex.q), Math.abs(hex.r), Math.abs(hex.s))
}

export function getEmptyHexesByDistance(grid, size) {
  const hexes = generateHexGrid(size)
  return hexes
    .filter(h => grid.get(hexKey(h)) === null || grid.get(hexKey(h)) === undefined)
    .sort((a, b) => hexDistanceFromCenter(b) - hexDistanceFromCenter(a))
}

export function expandGrid(grid, oldSize) {
  const newSize = oldSize + 1
  const newHexes = generateHexGrid(newSize)
  const expanded = new Map(grid)
  for (const hex of newHexes) {
    const key = hexKey(hex)
    if (!expanded.has(key)) {
      expanded.set(key, null)
    }
  }
  return { grid: expanded, size: newSize }
}

export function getOuterHexes(size) {
  const hexes = generateHexGrid(size)
  return hexes.filter(h => hexDistanceFromCenter(h) === size - 1)
}

export function isOuterLevelEmpty(grid, size) {
  const outerHexes = getOuterHexes(size)
  return outerHexes.every(h => {
    const val = grid.get(hexKey(h))
    return val === null || val === undefined
  })
}

export function getInnerEmptyCount(grid, size) {
  const hexes = generateHexGrid(size)
  return hexes.filter(h => {
    const isInner = hexDistanceFromCenter(h) < size - 1
    const val = grid.get(hexKey(h))
    return isInner && (val === null || val === undefined)
  }).length
}

export function shrinkGrid(grid, size) {
  const newSize = size - 1
  const newGrid = new Map()
  const newHexes = generateHexGrid(newSize)
  for (const hex of newHexes) {
    const key = hexKey(hex)
    newGrid.set(key, grid.get(key) ?? null)
  }
  return { grid: newGrid, size: newSize }
}

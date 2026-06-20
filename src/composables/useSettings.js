import { reactive, watch } from 'vue'

const STORAGE_KEY = 'gi-elements-settings'

const DEFAULTS = {
  gridSize: 5,
  includeAbyss: true,
  showHint: true,
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

const settings = reactive(loadSettings())

watch(settings, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useSettings() {
  function resetSettings() {
    Object.assign(settings, { ...DEFAULTS })
  }

  return { settings, resetSettings }
}

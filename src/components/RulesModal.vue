<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Правила игры</h2>
          <button class="close-btn" @click="$emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body" v-html="rulesHtml"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
})

defineEmits(['close'])

const rulesHtml = ref('')

watch(() => props.show, async (val) => {
  if (val && !rulesHtml.value) {
    try {
      const res = await fetch('/rules.md')
      const md = await res.text()
      rulesHtml.value = markdownToHtml(md)
    } catch {
      rulesHtml.value = '<p>Не удалось загрузить правила.</p>'
    }
  }
})

function markdownToHtml(md) {
  const lines = md.split('\n')
  let html = ''
  let inTable = false
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.match(/^\|[-| ]+\|$/)) {
      continue
    }

    if (line.match(/^\|.+\|$/)) {
      if (!inTable) {
        html += '<table>'
        inTable = true
      }
      const cells = line.split('|').filter((c, idx, arr) => idx > 0 && idx < arr.length - 1)
      const isFirstRow = !html.includes('<tr>')
      const tag = isFirstRow ? 'th' : 'td'
      html += '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>'
      continue
    }

    if (inTable) {
      html += '</table>'
      inTable = false
    }

    if (line.match(/^- .+$/)) {
      if (!inList) {
        html += '<ul>'
        inList = true
      }
      html += `<li>${line.slice(2)}</li>`
      continue
    }

    if (inList) {
      html += '</ul>'
      inList = false
    }

    if (line.match(/^### (.+)$/)) {
      html += `<h3>${line.slice(4)}</h3>`
    } else if (line.match(/^## (.+)$/)) {
      html += `<h2>${line.slice(3)}</h2>`
    } else if (line.match(/^# (.+)$/)) {
      html += `<h1>${line.slice(2)}</h1>`
    } else if (line.trim() === '') {
      html += '<br>'
    } else {
      let processed = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
      html += `<p>${processed}</p>`
    }
  }

  if (inTable) html += '</table>'
  if (inList) html += '</ul>'

  return html
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
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 25px;
  border-bottom: 1px solid #c9a227;
}

.modal-title {
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-size: 1.4rem;
  color: #d4af37;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #8a7a5a;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #d4af37;
}

.modal-body {
  padding: 25px;
  overflow-y: auto;
  color: #e8d5b7;
  font-size: 0.95rem;
  line-height: 1.6;
}

.modal-body :deep(h1) {
  font-family: 'Cinzel', 'Times New Roman', serif;
  color: #d4af37;
  font-size: 1.5rem;
  margin: 0 0 15px 0;
}

.modal-body :deep(h2) {
  font-family: 'Cinzel', 'Times New Roman', serif;
  color: #d4af37;
  font-size: 1.2rem;
  margin: 20px 0 10px 0;
  padding-bottom: 5px;
  border-bottom: 1px solid #c9a227;
}

.modal-body :deep(h3) {
  color: #50c8b0;
  font-size: 1rem;
  margin: 15px 0 8px 0;
}

.modal-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

.modal-body :deep(td) {
  padding: 8px 12px;
  border: 1px solid #2a2a4e;
}

.modal-body :deep(td:first-child) {
  color: #d4af37;
  font-weight: bold;
  white-space: nowrap;
}

.modal-body :deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
}

.modal-body :deep(li) {
  margin: 5px 0;
}

.modal-body :deep(strong) {
  color: #d4af37;
}

.modal-body :deep(em) {
  color: #50c8b0;
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

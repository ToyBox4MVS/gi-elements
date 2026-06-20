# GI-Elements — Игра "Чиселки" с элементами Genshin Impact

## Концепция

Пасьянс/головоломка на шестиугольной сетке с элементами Genshin Impact. Нужно убрать все пары элементов с поля, оставив один непарный элемент.

## Правила

- **Поле**: Шестиугольная сетка 3×3 — 9×9 (настраивается)
- **Элементы**: 7 элементов GI (Pyro, Hydro, Electro, Cryo, Anemo, Dendro, Geo) + опционально "Бездна (Abyss)"
- **Удаление**: Пары одинаковых элементов ИЛИ элемент + Бездна (если включена)
- **Связь**: Два элемента на одной прямой (перпендикулярной стороне гекса) без препятствий между ними
- **Победа**: На поле остался 1 элемент

## Изменения (обновление дизайна)

### 1. SVG-иконки элементов

Заменить эмодзи на SVG-файлы в `src/assets/elements/`:
- `pyro.svg` — символ огня
- `hydro.svg` — капля воды
- `electro.svg` — молния
- `cryo.svg` — снежинка
- `anemo.svg` — вихрь
- `dendro.svg` — лист/цветок
- `geo.svg` — кристалл
- `abyss.svg` — тёмный вихрь

### 2. Панель настроек (модальное окно)

Кнопка "Настройки" в шапке → открывает модалку:
- **Размер поля**: slider 3–9 (по умолчанию 5)
- **Бездна (8-й элемент)**: toggle (по умолчанию вкл)
- **Показывать подсказку**: toggle (по умолчанию вкл)
- Сохранение в `localStorage`

### 3. Динамическое распределение элементов

Адаптивный алгоритм в зависимости от настроек:
- Количество типов элементов: 7 (или 8 с Бездной)
- Чётность клеток: если нечётно + нет Бездной → оставить 1 пустую клетку
- Баланс: равномерное распределение пар по типам

## Стек

- Vue 3 (Composition API)
- Vite
- SVG для рендеринга гексов и иконок

## Визуальный стиль

Тёмно-золотая палитра в стиле Genshin Impact:
- **Фон**: Тёмно-коричневый/чёрный (#1a1a2e → #16213e)
- **Гексы**: Тёмные с золотой рамкой (#c9a227)
- **Элементы**: Яркие SVG-иконки на тёмном фоне
- **Шрифт**: Cinzel (serif)
- **Акценты**: Золотые (#d4af37), бирюзовые (#50c8b0)
- **Свечение**: Мягкое свечение вокруг выбранных гексов

## Структура проекта

```
GI-Elemets/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── App.vue
    ├── main.js
    ├── assets/
    │   ├── main.css
    │   └── elements/          # SVG-иконки элементов
    │       ├── pyro.svg
    │       ├── hydro.svg
    │       ├── electro.svg
    │       ├── cryo.svg
    │       ├── anemo.svg
    │       ├── dendro.svg
    │       ├── geo.svg
    │       └── abyss.svg
    ├── pages/
    │   └── IndexPage.vue
    ├── components/
    │   ├── HexGrid.vue
    │   ├── GameHeader.vue
    │   ├── GameOverlay.vue
    │   └── SettingsModal.vue  # НОВЫЙ: модалка настроек
    ├── composables/
    │   ├── useGameState.js
    │   ├── useGameLogic.js
    │   └── useSettings.js     # НОВЫЙ: управление настройками
    └── utils/
        ├── hex.js
        ├── elements.js
        └── constants.js
```

## Детали реализации

### 1. SVG-иконки элементов

Создать 8 SVG-файлов в `src/assets/elements/`. Каждый файл — упрощённый символ элемента:
- Pyro: пламя (красный #EF4444)
- Hydro: капля (синий #3B82F6)
- Electro: молния (фиолетовый #A855F7)
- Cryo: снежинка (голубой #67E8F9)
- Anemo: вихрь (зелёный #6EE7B7)
- Dendro: лист (зелёный #22C55E)
- Geo: кристалл (жёлтый #F59E0B)
- Abyss: тёмный вихрь (индиго #7C3AED)

### 2. Хранение иконок в elements.js

Импорт файлов с заглавной буквы (пользовательские файлы):
```js
import PyroIcon from '../assets/elements/Pyro.svg'
import HydroIcon from '../assets/elements/Hydro.svg'
import ElectroIcon from '../assets/elements/Electro.svg'
import CryoIcon from '../assets/elements/Cryo.svg'
import AnemoIcon from '../assets/elements/Anemo.svg'
import DendroIcon from '../assets/elements/Dendro.svg'
import GeoIcon from '../assets/elements/Geo.svg'
import AbyssIcon from '../assets/elements/Abyss.svg'

const ELEMENTS = [
  { id: 'pyro', name: 'Pyro', color: '#EF4444', icon: PyroIcon },
  // ...
]
```

### 3. Компонент SettingsModal.vue

Модальное окно с:
- Slider для размера поля (3–9)
- Toggle для Бездны
- Toggle для кнопки "Подсказка"
- Кнопка "Применить" → сохраняет в localStorage, перезапускает игру

### 4. Composable useSettings.js

```js
function useSettings() {
  const settings = reactive(loadSettings())

  function loadSettings() {
    const saved = localStorage.getItem('gi-elements-settings')
    return saved ? JSON.parse(saved) : defaults
  }

  function save() {
    localStorage.setItem('gi-elements-settings', JSON.stringify(settings))
  }

  return { settings, save }
}
```

### 5. Адаптивное распределение элементов (useGameState.js)

```js
function generateElementPool(count, includeAbyss) {
  const regularElements = ELEMENTS.filter(e => e.id !== ABYSS_ID)
  const typesCount = includeAbyss ? 8 : 7
  const pool = []

  const pairsCount = Math.floor(count / 2)
  for (let i = 0; i < pairsCount; i++) {
    const elem = regularElements[i % regularElements.length]
    pool.push(elem.id, elem.id)
  }

  if (count % 2 === 1) {
    if (includeAbyss) {
      pool.push(ABYSS_ID)
    } else {
      // Нечётное количество без Бездны → оставляем пустую клетку
      pool.push(null)
    }
  }

  shuffle(pool)
  return pool
}
```

### 6. HexGrid.vue — SVG-иконки вместо текста

Заменить `<text>` на `<image>`:
```vue
<image
  v-if="!isEmpty(hexKey(hex))"
  :href="getElementIcon(hexKey(hex))"
  :x="hexCenter(hex).x - 15"
  :y="hexCenter(hex).y - 15"
  width="30"
  height="30"
/>
```

### 7. GameHeader.vue — кнопка "Настройки"

Добавить кнопку "⚙️ Настройки" рядом с "Новая игра":
```vue
<button class="btn btn-settings" @click="$emit('open-settings')">
  ⚙️ Настройки
</button>
```

## Файлы для изменения

### Новые файлы
- `src/assets/elements/pyro.svg`
- `src/assets/elements/hydro.svg`
- `src/assets/elements/electro.svg`
- `src/assets/elements/cryo.svg`
- `src/assets/elements/anemo.svg`
- `src/assets/elements/dendro.svg`
- `src/assets/elements/geo.svg`
- `src/assets/elements/abyss.svg`
- `src/components/SettingsModal.vue`
- `src/composables/useSettings.js`

### Изменяемые файлы
- `src/utils/elements.js` — импорт SVG, поле `icon` вместо `symbol`
- `src/utils/constants.js` — добавить `DEFAULT_SETTINGS`
- `src/composables/useGameState.js` — принимать settings, адаптивный pool
- `src/composables/useGameLogic.js` — учитывать включена ли Бездна
- `src/components/HexGrid.vue` — `<image>` вместо `<text>`
- `src/components/GameHeader.vue` — кнопка "Настройки"
- `src/pages/IndexPage.vue` — интеграция настроек, передача в компоненты

## Кнопки по углам игрового поля

### Расположение кнопок (по углам `.game-board`)

```
┌─────────────────────────────────┐
│ [🔄 Новая]        [💡 Подсказка]│
│                                 │
│         ИГРОВОЕ ПОЛЕ            │
│          (HexGrid)              │
│                                 │
│ [↩️ Отмена]         [➕ Добавить]│
└─────────────────────────────────┘
```

| Угол | Кнопка | Иконка | Действие |
|------|--------|--------|----------|
| Левый верхний | Новая игра | 🔄 | Перезапуск игры |
| Правый верхний | Подсказка | 💡 | Подсветка доступной пары |
| Левый нижний | Отмена | ↩️ | Отмена последнего хода |
| Правый нижний | Добавить | ➕ | Заготовка (будущая фича) |

FAB (⚙️ Настройки) остаётся без изменений в фиксированной позиции.

### Реализация

1. **IndexPage.vue** — обернуть `game-board` в `.board-wrapper` (position: relative)
   - 4 кнопки-иконки绝对定位 в углах
   - Кнопки круглые, только иконки без текста
   - Стиль: прозрачный фон, золотая рамка, свечение при hover

2. **GameFAB.vue** — оставить как есть (⚙️ Настройки)

3. **Удалить**: `GameHeader.vue` больше не нужен (перенести заголовок + статистику прямо в IndexPage)

### Иконки кнопок (FontAwesome)

Подключение: CDN в `index.html` или `npm i @fortawesome/fontawesome-free`

| Кнопка | FontAwesome класс | CSS класс |
|--------|-------------------|-----------|
| Новая игра | `fa-solid fa-rotate-right` | `fa-solid fa-rotate-right` |
| Подсказка | `fa-solid fa-lightbulb` | `fa-solid fa-lightbulb` |
| Отмена | `fa-solid fa-rotate-left` | `fa-solid fa-rotate-left` |
| Добавить | `fa-solid fa-plus` | `fa-solid fa-plus` |
| Настройки (FAB) | `fa-solid fa-gear` | `fa-solid fa-gear` |

Использование в шаблоне:
```html
<i class="fa-solid fa-rotate-right"></i>
```

## Верификация

1. `npm run dev` → открыть http://localhost:5173
2. Проверить 4 кнопки по углам игрового поля
3. Кнопка "Новая игра" перезапускает игру
4. Кнопка "Подсказка" подсвечивает доступную пару
5. Кнопка "Отмена" отменяет последний ход
6. Кнопка "Добавить" пока ничего не делает (placeholder)
7. FAB с Настройками работает как раньше

---

## Новая игровая механика: динамическое поле

### Правила
1. Игра начинается с поля размером **3** (19 клеток)
2. Клетки заполняются случайными элементами
3. Игрок снимает элементы парами (как ранее)
4. Когда нет возможности снять ни одну пару → кнопка "Добавить" становится активной
5. При нажатии "Добавить":
   - Берём элементы, уже имеющиеся на доске
   - Формируем из них пары
   - Заполняем пустые клетки, начиная с внешнего уровня
   - Если пустых клеток недостаточно → увеличиваем размер поля на 1
6. Размер поля в настройках = **максимальный** размер

### Изменения в файлах

#### 1. `src/utils/constants.js`
- `GRID_SIZE = 3` (стартовый размер)
- `DEFAULT_SETTINGS.gridSize = 9` (максимальный размер)

#### 2. `src/utils/hex.js`
Добавить функции:
```js
// Гекс по расстоянию от центра
function hexDistanceFromCenter(hex) {
  return Math.max(Math.abs(hex.q), Math.abs(hex.r), Math.abs(hex.s))
}

// Получить пустые клетки, отсортированные по расстоянию от центра (внешние первые)
export function getEmptyHexesByDistance(grid, size) {
  const hexes = generateHexGrid(size)
  return hexes
    .filter(h => grid.get(hexKey(h)) === null || grid.get(hexKey(h)) === undefined)
    .sort((a, b) => hexDistanceFromCenter(b) - hexDistanceFromCenter(a))
}

// Расширить сетку на 1 уровень
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
```

#### 3. `src/composables/useGameState.js`
Ключевые изменения:
- **`currentSize`** ref — текущий размер поля (старт 3)
- **`initGame()`** — инициализация с `currentSize = 3`
- **`addElements()`** — новая функция:
  1. Собрать все элементы с доски (не null), **без создания пар**
  2. Перемешать массив элементов
  3. Получить пустые клетки (внешние первые)
  4. Если пустых клеток 0 → expandGrid (если currentSize < max), получить новые пустые клетки
  5. Заполнить пустые клетки элементами из перемешанного массива (по одному)
  6. Обновить grid

#### 4. `src/components/HexGrid.vue`
- Принимать prop `gridSize` (вместо константы)
- Динамически генерировать `hexes` через computed
- Пересчитывать `bounds` и `viewBox` при изменении размера

#### 5. `src/pages/IndexPage.vue`
- Кнопка "Добавить" активируется когда `!hasValidMoves && remainingCount > 1`
- Вызывать `state.addElements()` при нажатии
- Передавать `state.currentSize.value` в HexGrid

## Верификация новой механики

1. Игра начинается с поля 3×3 (19 клеток)
2. Убирать пары работает как раньше
3. Когда нет ходов → кнопка "Добавить" активируется (подсвечивается)
4. Нажатие "Добавить" заполняет пустые клетки элементами с доски
5. Если клеток недостаточно → поле расширяется на 1 уровень
6. Поле не расширяется за пределы максимального размера из настроек

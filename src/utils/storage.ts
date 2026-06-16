import { SearchHistoryItem, WasteItem, CategoryType, CustomWasteItemForm } from '../types'

const HISTORY_KEY = 'waste_search_history'
const THEME_KEY = 'waste_theme'
const CUSTOM_ITEMS_KEY = 'waste_custom_items'
const MAX_HISTORY = 20

export const getHistory = (): SearchHistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SearchHistoryItem[]
  } catch {
    return []
  }
}

export const addHistory = (keyword: string): SearchHistoryItem[] => {
  const trimmed = keyword.trim()
  if (!trimmed) return getHistory()
  const history = getHistory().filter(h => h.keyword !== trimmed)
  history.unshift({ keyword: trimmed, timestamp: Date.now() })
  const trimmedHistory = history.slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory))
  return trimmedHistory
}

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY)
}

export const getTheme = (): 'light' | 'dark' => {
  const t = localStorage.getItem(THEME_KEY)
  if (t === 'dark' || t === 'light') return t
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const setTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme)
  document.documentElement.setAttribute('data-theme', theme)
}

export const getCustomItems = (): WasteItem[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_ITEMS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as WasteItem[]
  } catch {
    return []
  }
}

export const saveCustomItems = (items: WasteItem[]): void => {
  localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(items))
}

const generateCustomId = (): string => {
  return 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

export const addCustomItem = (form: CustomWasteItemForm): WasteItem => {
  const now = Date.now()
  const newItem: WasteItem = {
    id: generateCustomId(),
    name: form.name.trim(),
    category: form.category,
    description: form.description.trim() || '用户自定义添加的垃圾物品。',
    disposal: form.disposal.trim() || '按照对应分类的要求进行投放。',
    commonMistakes: form.commonMistakes.filter(m => m.trim().length > 0),
    keywords: form.keywords.filter(k => k.trim().length > 0),
    isCustom: true,
    createdAt: now,
    updatedAt: now,
  }
  if (!newItem.keywords.includes(newItem.name)) {
    newItem.keywords.unshift(newItem.name)
  }
  const items = getCustomItems()
  items.unshift(newItem)
  saveCustomItems(items)
  return newItem
}

export const updateCustomItem = (id: string, form: CustomWasteItemForm): WasteItem | null => {
  const items = getCustomItems()
  const index = items.findIndex(item => item.id === id)
  if (index === -1) return null
  
  const keywords = form.keywords.filter(k => k.trim().length > 0)
  if (!keywords.includes(form.name.trim())) {
    keywords.unshift(form.name.trim())
  }
  
  items[index] = {
    ...items[index],
    name: form.name.trim(),
    category: form.category,
    description: form.description.trim() || '用户自定义添加的垃圾物品。',
    disposal: form.disposal.trim() || '按照对应分类的要求进行投放。',
    commonMistakes: form.commonMistakes.filter(m => m.trim().length > 0),
    keywords,
    updatedAt: Date.now(),
  }
  saveCustomItems(items)
  return items[index]
}

export const deleteCustomItem = (id: string): boolean => {
  const items = getCustomItems()
  const newItems = items.filter(item => item.id !== id)
  if (newItems.length === items.length) return false
  saveCustomItems(newItems)
  return true
}

export const getCustomItemById = (id: string): WasteItem | undefined => {
  return getCustomItems().find(item => item.id === id)
}

export const getCustomItemsByCategory = (category: CategoryType): WasteItem[] => {
  return getCustomItems().filter(item => item.category === category)
}

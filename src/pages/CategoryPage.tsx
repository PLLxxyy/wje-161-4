import React from 'react'
import { CategoryType, CustomWasteItemForm } from '../types'
import { getItemsByCategory, categoryMap } from '../data/items'
import { deleteCustomItem, addCustomItem, updateCustomItem } from '../utils/storage'
import CustomItemForm from './CustomItemForm'

interface Props {
  categoryType: CategoryType
  onDetailClick: (id: string) => void
  onBack: () => void
}

const CategoryPage: React.FC<Props> = ({ categoryType, onDetailClick, onBack }) => {
  const [filter, setFilter] = React.useState('')
  const [refreshKey, setRefreshKey] = React.useState(0)
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null)
  const [items, setItems] = React.useState(() => getItemsByCategory(categoryType))

  React.useEffect(() => {
    setItems(getItemsByCategory(categoryType))
  }, [categoryType, refreshKey])

  const cat = categoryMap[categoryType]

  const refreshItems = () => {
    setRefreshKey(k => k + 1)
  }

  const filtered = filter.trim()
    ? items.filter(it => it.name.includes(filter) || it.keywords.some(k => k.includes(filter)))
    : items

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('确定要删除这个自定义条目吗？')) {
      deleteCustomItem(id)
      refreshItems()
    }
  }

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setEditingItemId(id)
  }

  const editingItem = editingItemId ? items.find(i => i.id === editingItemId) : undefined

  if (!cat) {
    return (
      <div className="container fade-in">
        <button className="btn-back" onClick={onBack}>← 返回</button>
        <div className="empty-state">
          <div className="icon">😕</div>
          <p>未找到该分类信息</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container fade-in">
      <button className="btn-back" onClick={onBack}>← 返回</button>

      <div className={`detail-card ${cat.bgClass}`} style={{ borderLeft: `4px solid ${cat.color}` }}>
        <div className="detail-header">
          <div className="detail-emoji">{cat.emoji}</div>
          <div>
            <div className="detail-title">{cat.name}</div>
            <div className="detail-subtitle" style={{ color: cat.color }}>
              {cat.description}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, margin: '16px 0 12px' }}>
        <div className="search-box" style={{ margin: 0, flex: 1 }}>
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder={`在${cat.name}中搜索...`}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          {filter && (
            <button className="search-clear" onClick={() => setFilter('')}>✕</button>
          )}
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          ➕
        </button>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
        共 {filtered.length} 种物品
      </p>

      <div className="result-list">
        {filtered.map(item => (
          <div
            key={item.id}
            className={`result-item ${cat.borderClass}`}
            onClick={() => onDetailClick(item.id)}
          >
            <div className="info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="name">{item.name}</div>
                {item.isCustom && (
                  <span className="custom-badge" title="用户自定义">自定义</span>
                )}
              </div>
              <div className="tip">{item.disposal.slice(0, 50)}...</div>
            </div>
            {item.isCustom && (
              <div className="item-actions" onClick={e => e.stopPropagation()}>
                <button
                  className="icon-btn"
                  title="编辑"
                  onClick={e => handleEdit(e, item.id)}
                >
                  ✏️
                </button>
                <button
                  className="icon-btn"
                  title="删除"
                  onClick={e => handleDelete(e, item.id)}
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="icon">😕</div>
          <p>没有找到匹配的物品</p>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(true)}>
              ➕ 添加到{cat.name}
            </button>
          </div>
        </div>
      )}

      {showAddForm && (
        <CustomItemForm
          onSubmit={form => {
            addCustomItem({ ...form, category: categoryType })
            setShowAddForm(false)
            refreshItems()
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingItem && (
        <CustomItemForm
          initialData={editingItem}
          onSubmit={form => {
            updateCustomItem(editingItem.id, form)
            setEditingItemId(null)
            refreshItems()
          }}
          onCancel={() => setEditingItemId(null)}
        />
      )}
    </div>
  )
}

export default CategoryPage

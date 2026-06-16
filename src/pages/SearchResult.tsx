import React from 'react'
import { CategoryType, CustomWasteItemForm } from '../types'
import { categories } from '../data/items'
import { searchItems, highlightText } from '../utils/search'
import { deleteCustomItem, addCustomItem, updateCustomItem } from '../utils/storage'
import CustomItemForm from './CustomItemForm'

interface Props {
  searchText: string
  onDetailClick: (id: string) => void
  onBack: () => void
}

const SearchResult: React.FC<Props> = ({ searchText, onDetailClick, onBack }) => {
  const [results, setResults] = React.useState(() => searchItems(searchText))
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null)

  React.useEffect(() => {
    setResults(searchItems(searchText))
  }, [searchText])

  const refreshResults = () => {
    setResults(searchItems(searchText))
  }

  const getCategoryInfo = (type: CategoryType) => categories.find(c => c.type === type)

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('确定要删除这个自定义条目吗？')) {
      deleteCustomItem(id)
      refreshResults()
    }
  }

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setEditingItemId(id)
  }

  const editingItem = editingItemId ? results.find(r => r.item.id === editingItemId)?.item : undefined

  return (
    <div className="container fade-in">
      <button className="btn-back" onClick={onBack}>← 返回</button>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
        搜索结果：「{searchText}」
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
        共找到 {results.length} 个匹配项
      </p>

      {results.length === 0 ? (
        <div className="empty-state">
          <div className="icon">😕</div>
          <p>没有找到「{searchText}」相关物品</p>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              ➕ 添加「{searchText}」到数据库
            </button>
          </div>
        </div>
      ) : (
        <div className="result-list">
          {results.map(r => {
            const cat = getCategoryInfo(r.item.category)
            return (
              <div
                key={r.item.id}
                className={`result-item ${cat?.borderClass}`}
                onClick={() => onDetailClick(r.item.id)}
              >
                <div className="info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      className="name"
                      dangerouslySetInnerHTML={{ __html: highlightText(r.item.name, searchText) }}
                    />
                    {r.item.isCustom && (
                      <span className="custom-badge" title="用户自定义">自定义</span>
                    )}
                  </div>
                  <div className="tip">{r.item.description.slice(0, 50)}...</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`tag ${cat?.tagClass}`}>{cat?.name}</span>
                  {r.item.isCustom && (
                    <div className="item-actions" onClick={e => e.stopPropagation()}>
                      <button
                        className="icon-btn"
                        title="编辑"
                        onClick={e => handleEdit(e, r.item.id)}
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn"
                        title="删除"
                        onClick={e => handleDelete(e, r.item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAddForm && (
        <CustomItemForm
          defaultName={searchText}
          onSubmit={form => {
            addCustomItem(form)
            setShowAddForm(false)
            refreshResults()
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
            refreshResults()
          }}
          onCancel={() => setEditingItemId(null)}
        />
      )}
    </div>
  )
}

export default SearchResult

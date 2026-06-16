import React from 'react'
import { CategoryType, CustomWasteItemForm } from '../types'
import { getItemById, categoryMap } from '../data/items'
import { deleteCustomItem, updateCustomItem } from '../utils/storage'
import CustomItemForm from './CustomItemForm'

interface Props {
  itemId: string
  onBack: () => void
}

const infoBoxClassMap: Record<CategoryType, string> = {
  recycle: 'info-box-blue',
  harmful: 'info-box-red',
  kitchen: 'info-box-green',
  other: 'info-box-gray',
}

const ItemDetail: React.FC<Props> = ({ itemId, onBack }) => {
  const [item, setItem] = React.useState(() => getItemById(itemId))
  const [showEditForm, setShowEditForm] = React.useState(false)

  const refreshItem = () => {
    setItem(getItemById(itemId))
  }

  const handleDelete = () => {
    if (item?.isCustom && confirm('确定要删除这个自定义条目吗？')) {
      deleteCustomItem(item.id)
      onBack()
    }
  }

  if (!item) {
    return (
      <div className="container fade-in">
        <button className="btn-back" onClick={onBack}>← 返回</button>
        <div className="empty-state">
          <div className="icon">😕</div>
          <p>未找到该物品信息</p>
        </div>
      </div>
    )
  }

  const cat = categoryMap[item.category]

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-back" onClick={onBack}>← 返回</button>
        {item.isCustom && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setShowEditForm(true)}
            >
              ✏️ 编辑
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
            >
              🗑️ 删除
            </button>
          </div>
        )}
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-emoji">{cat.emoji}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="detail-title">{item.name}</div>
              {item.isCustom && (
                <span className="custom-badge" title="用户自定义">自定义</span>
              )}
            </div>
            <div className="detail-subtitle">
              <span className={`tag ${cat.tagClass}`}>{cat.name}</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          {item.description}
        </p>

        <div className="section-title">📋 分类归属</div>
        <div className={`info-box ${infoBoxClassMap[item.category]}`}>
          该物品属于<strong>{cat.name}</strong>。{cat.description}
        </div>

        <div className="section-title">🗑️ 投放要求</div>
        <div className={`info-box ${infoBoxClassMap[item.category]}`}>
          {item.disposal}
        </div>

        {item.commonMistakes.length > 0 && (
          <>
            <div className="section-title">⚠️ 常见错误</div>
            <ul className="error-list">
              {item.commonMistakes.map((m, i) => (
                <li key={i}>
                  <span style={{ color: 'var(--harmful)', fontWeight: 700 }}>✗</span>
                  {m}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {showEditForm && item.isCustom && (
        <CustomItemForm
          initialData={item}
          onSubmit={form => {
            updateCustomItem(item.id, form)
            setShowEditForm(false)
            refreshItem()
          }}
          onCancel={() => setShowEditForm(false)}
        />
      )}
    </div>
  )
}

export default ItemDetail

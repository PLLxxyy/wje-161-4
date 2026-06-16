import React from 'react'
import { CategoryType, CustomWasteItemForm, WasteItem } from '../types'
import { categories } from '../data/items'

interface Props {
  initialData?: WasteItem
  defaultName?: string
  onSubmit: (form: CustomWasteItemForm) => void
  onCancel: () => void
}

const CustomItemForm: React.FC<Props> = ({ initialData, defaultName, onSubmit, onCancel }) => {
  const [name, setName] = React.useState(initialData?.name || defaultName || '')
  const [category, setCategory] = React.useState<CategoryType>(initialData?.category || 'other')
  const [description, setDescription] = React.useState(initialData?.description || '')
  const [disposal, setDisposal] = React.useState(initialData?.disposal || '')
  const [commonMistakesStr, setCommonMistakesStr] = React.useState(
    initialData?.commonMistakes.join('\n') || ''
  )
  const [keywordsStr, setKeywordsStr] = React.useState(
    initialData?.keywords.filter(k => k !== initialData.name).join(', ') || ''
  )
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = '请输入物品名称'
    if (!category) newErrors.category = '请选择分类'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const form: CustomWasteItemForm = {
      name: name.trim(),
      category,
      description: description.trim(),
      disposal: disposal.trim(),
      commonMistakes: commonMistakesStr
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0),
      keywords: keywordsStr
        .split(/[,，]/)
        .map(s => s.trim())
        .filter(s => s.length > 0),
    }
    onSubmit(form)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData ? '编辑垃圾信息' : '添加自定义垃圾'}</h3>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="custom-form">
          <div className="form-group">
            <label>
              物品名称 <span className="required">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例如：奶茶杯"
              className={`form-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label>
              所属分类 <span className="required">*</span>
            </label>
            <div className="category-select">
              {categories.map(cat => (
                <div
                  key={cat.type}
                  className={`category-option ${cat.bgClass} ${category === cat.type ? 'selected' : ''}`}
                  onClick={() => setCategory(cat.type)}
                >
                  <div className="emoji">{cat.emoji}</div>
                  <div className="name">{cat.name}</div>
                </div>
              ))}
            </div>
            {errors.category && <div className="form-error">{errors.category}</div>}
          </div>

          <div className="form-group">
            <label>物品描述</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="简要描述这个物品是什么..."
              className="form-textarea"
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>投放要求</label>
            <textarea
              value={disposal}
              onChange={e => setDisposal(e.target.value)}
              placeholder="描述正确的投放方式..."
              className="form-textarea"
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>常见错误（每行一条）</label>
            <textarea
              value={commonMistakesStr}
              onChange={e => setCommonMistakesStr(e.target.value)}
              placeholder={'不要连汤一起倒\n避免混入其他垃圾'}
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>搜索关键词（用逗号分隔）</label>
            <input
              type="text"
              value={keywordsStr}
              onChange={e => setKeywordsStr(e.target.value)}
              placeholder="例如：奶茶, 饮料杯, 塑料杯"
              className="form-input"
            />
            <div className="form-hint">物品名称会自动加入关键词</div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? '保存修改' : '确认添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomItemForm

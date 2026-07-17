import { useState, useEffect } from 'react'
import { getMenu, createOrder, createDish, deleteDish, updateDish } from '../api/api'
import './Menu.css'

function Menu() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDishes, setSelectedDishes] = useState([])
  const [orderResult, setOrderResult] = useState(null)
  const [orderError, setOrderError] = useState(null)
  const [activeCategoryForAdd, setActiveCategoryForAdd] = useState(null)
  const [newDish, setNewDish] = useState({ name: '', price: '', weight_grams: '' })
  const [editingDishId, setEditingDishId] = useState(null)
  const [editFormData, setEditFormData] = useState({ name: '', price: '', weight_grams: '' })
  
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await getMenu()
        setCategories(response.data)
        setLoading(false)
      } catch (err) {
        setError(err.message || 'Не удалось загрузить меню')
        setLoading(false)
      }
    }
    fetchMenu()
  }, [])

  const toggleDish = (dishId) => {
    setSelectedDishes(prev =>
      prev.includes(dishId)
        ? prev.filter(id => id !== dishId)
        : [...prev, dishId]
    )
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    setOrderResult(null)
    setOrderError(null)

    if (selectedDishes.length === 0) {
      setOrderError('Выберите хотя бы одно блюдо')
      return
    }

    try {
      const response = await createOrder(selectedDishes)
      setOrderResult(response.data)
      setSelectedDishes([])
    } catch (err) {
      setOrderError(err.response?.data?.error || 'Ошибка при оформлении заказа')
    }
  }
  const handleAddDishChange = (e) => {
    setNewDish({ ...newDish, [e.target.name]: e.target.value })
  }

  const handleAddDishSubmit = async (e, categoryId) => {
    e.preventDefault()
    if (!newDish.name.trim() || !newDish.price || !newDish.weight_grams) return

    setActionLoading(`add-${categoryId}`)
    try {
      const payload = {
        name: newDish.name.trim(),
        price: parseFloat(newDish.price),
        weight_grams: parseInt(newDish.weight_grams),
        category_id: categoryId 
      }

      const response = await createDish(payload)
      const createdDish = response.data.data || response.data

      setCategories(prev => prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, dishes: [...(cat.dishes || []), createdDish] }
          : cat
      ))

      setNewDish({ name: '', price: '', weight_grams: '' })
      setActiveCategoryForAdd(null)
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Не удалось добавить блюдо')
    } finally {
      setActionLoading(null)
    }
  }
  const handleDeleteDish = async (categoryId, dishId) => {
    if (!window.confirm('Вы уверены, что хотите удалить это блюдо?')) return

    setActionLoading(`delete-${dishId}`)
    try {
      await deleteDish(dishId)

      setCategories(prev => prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, dishes: (cat.dishes || []).filter(d => d.id !== dishId) }
          : cat
      ))

      setSelectedDishes(prev => prev.filter(id => id !== dishId))
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Не удалось удалить блюдо')
    } finally {
      setActionLoading(null)
    }
  }
  const startEditDish = (dish) => {
    setEditingDishId(dish.id)
    setEditFormData({
      name: dish.name,
      price: dish.price,
      weight_grams: dish.weight_grams
    })
  }
  const cancelEditDish = () => {
    setEditingDishId(null)
    setEditFormData({ name: '', price: '', weight_grams: '' })
  }
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  }
  const handleEditSubmit = async (e, dishId, categoryId) => {
    e.preventDefault()
    if (!editFormData.name.trim() || !editFormData.price || !editFormData.weight_grams) return

    setActionLoading(`edit-${dishId}`)
    try {
      const payload = {
        name: editFormData.name.trim(),
        price: parseFloat(editFormData.price),
        weight_grams: parseInt(editFormData.weight_grams)
      }

      const response = await updateDish(dishId, payload)
      const updatedDish = response.data.data || response.data

      setCategories(prev => prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              dishes: (cat.dishes || []).map(d =>
                d.id === dishId ? { ...d, ...updatedDish } : d
              )
            }
          : cat
      ))

      cancelEditDish()
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Не удалось обновить блюдо')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="loading">Загрузка меню...</div>
  if (error) return <div className="error">Ошибка: {error}</div>

  return (
    <div className="menu-page">
      <h1>Меню</h1>
      <div className="menu-container">
        {categories.map(category => (
          <div key={category.id} className="category-section">
            <div className="category-header">
              <h2>{category.name}</h2>
              <button 
                className="btn-add-dish"
                onClick={() => setActiveCategoryForAdd(activeCategoryForAdd === category.id ? null : category.id)}
              >
                {activeCategoryForAdd === category.id ? '❌ Отмена' : '➕ Добавить блюдо'}
              </button>
            </div>

          
            {activeCategoryForAdd === category.id && (
              <form 
                className="add-dish-form" 
                onSubmit={(e) => handleAddDishSubmit(e, category.id)}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Название блюда"
                  value={newDish.name}
                  onChange={handleAddDishChange}
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Цена (₽)"
                  value={newDish.price}
                  onChange={handleAddDishChange}
                  min="0"
                  step="0.01"
                  required
                />
                <input
                  type="number"
                  name="weight_grams"
                  placeholder="Вес (г)"
                  value={newDish.weight_grams}
                  onChange={handleAddDishChange}
                  min="1"
                  step="1"
                  required
                />
                <button 
                  type="submit" 
                  className="btn-submit-dish"
                  disabled={actionLoading === `add-${category.id}`}
                >
                  {actionLoading === `add-${category.id}` ? 'Сохранение...' : 'Сохранить'}
                </button>
              </form>
            )}

            {category.dishes && category.dishes.length > 0 ? (
              <div className="dishes-grid">
                {category.dishes.map(dish => (
                  <div
                    key={dish.id}
                    className={`dish-card ${selectedDishes.includes(dish.id) ? 'selected' : ''} ${editingDishId === dish.id ? 'editing' : ''}`}
                  >
                    {/* 🟡 Форма редактирования */}
                    {editingDishId === dish.id ? (
                      <form 
                        className="edit-dish-form"
                        onSubmit={(e) => handleEditSubmit(e, dish.id, category.id)}
                      >
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditChange}
                          placeholder="Название"
                          required
                        />
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price}
                          onChange={handleEditChange}
                          placeholder="Цена"
                          min="0"
                          step="0.01"
                          required
                        />
                        <input
                          type="number"
                          name="weight_grams"
                          value={editFormData.weight_grams}
                          onChange={handleEditChange}
                          placeholder="Вес"
                          min="1"
                          step="1"
                          required
                        />
                        <div className="edit-actions">
                          <button 
                            type="submit" 
                            className="btn-save-edit"
                            disabled={actionLoading === `edit-${dish.id}`}
                          >
                            {actionLoading === `edit-${dish.id}` ? '...' : '✓'}
                          </button>
                          <button 
                            type="button" 
                            className="btn-cancel-edit"
                            onClick={cancelEditDish}
                            disabled={actionLoading === `edit-${dish.id}`}
                          >
                            ✕
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="dish-info" onClick={() => toggleDish(dish.id)}>
                          <h3>{dish.name}</h3>
                          <div className="dish-details">
                            <span className="price">{dish.price} ₽</span>
                            <span className="weight">{dish.weight_grams} г</span>
                          </div>
                        </div>
                        <div className="dish-actions">
                          <button
                            className="btn-edit-dish"
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditDish(dish)
                            }}
                            title="Редактировать блюдо"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-delete-dish"
                            onClick={(e) => {
                              e.stopPropagation() 
                              handleDeleteDish(category.id, dish.id)
                            }}
                            disabled={actionLoading === `delete-${dish.id}`}
                            title="Удалить блюдо"
                          >
                            {actionLoading === `delete-${dish.id}` ? '⏳' : '🗑️'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : 
               (
              <p className="no-dishes">В этой категории пока нет блюд</p>
            )}
            
          </div>
        ))}
      </div>

      <div className="order-section">
        <h2>Оформить заказ</h2>
        <p className="selected-count">Выбрано блюд: {selectedDishes.length}</p>

        {orderResult && (
          <div className="order-success">
            <p>{orderResult.message}</p>
            {orderResult.items && (
              <ul>
                {orderResult.items.map(item => (
                  <li key={item.id}>{item.name} — {item.price} ₽</li>
                ))}
              </ul>
            )}
            <p><strong>Итого: {orderResult.total} ₽</strong></p>
          </div>
        )}

        {orderError && <div className="order-error">{orderError}</div>}

        <form onSubmit={handleSubmitOrder}>
          <button type="submit" className="btn-order" disabled={selectedDishes.length === 0}>
            Заказать
          </button>
        </form>
      </div>
    </div>
  )
}

export default Menu
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Food & Beverages']

const CATEGORY_COLORS = {
  'Electronics': 'bg-blue-100 text-blue-700',
  'Clothing': 'bg-purple-100 text-purple-700',
  'Home & Garden': 'bg-green-100 text-green-700',
  'Food & Beverages': 'bg-orange-100 text-orange-700',
}

const CATEGORY_ICONS = {
  'Electronics': '🔌',
  'Clothing': '👕',
  'Home & Garden': '🏡',
  'Food & Beverages': '🛒',
}

const EMPTY_FORM = { name: '', sku: '', category: 'Electronics', price: '', quantity: '', description: '' }

function StatsCard({ label, value, icon, color }) {
  return (
    <div className={`rounded-2xl p-5 shadow-sm border border-gray-100 bg-white flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

function ProductCard({ product, onEdit, onDelete, onQuantityChange }) {
  const catColor = CATEGORY_COLORS[product.category] || 'bg-gray-100 text-gray-700'
  const catIcon = CATEGORY_ICONS[product.category] || '📦'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${catColor.replace('text-', 'bg-').split(' ')[0]} bg-opacity-20`}>
          {catIcon}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catColor}`}>{product.category}</span>
      </div>

      <div>
        <h3 className="font-bold text-gray-800 text-base leading-tight">{product.name}</h3>
        <p className="text-xs text-gray-400 mt-0.5 font-mono">SKU: {product.sku}</p>
      </div>

      {product.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <span className="text-lg font-bold text-indigo-600">${Number(product.price).toFixed(2)}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onQuantityChange(product, -1)}
            disabled={product.quantity <= 0}
            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-600 font-bold text-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >−</button>
          <span className={`w-10 text-center font-semibold text-sm ${product.quantity === 0 ? 'text-red-500' : product.quantity < 10 ? 'text-amber-600' : 'text-gray-700'}`}>
            {product.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(product, 1)}
            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-600 font-bold text-lg flex items-center justify-center transition-colors"
          >+</button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
        >✏️ Edit</button>
        <button
          onClick={() => onDelete(product)}
          className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
        >🗑️ Delete</button>
      </div>
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ProductForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.sku.trim()) e.sku = 'SKU is required'
    if (!form.category) e.category = 'Category is required'
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Valid price required'
    if (form.quantity === '' || isNaN(Number(form.quantity)) || Number(form.quantity) < 0 || !Number.isInteger(Number(form.quantity))) e.quantity = 'Valid whole number required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSave({ ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) })
  }

  const field = (id, label, type = 'text', opts = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[id]}
        onChange={e => set(id, e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors[id] ? 'border-red-400' : 'border-gray-200'}`}
        {...opts}
      />
      {errors[id] && <p className="text-xs text-red-500 mt-1">{errors[id]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        {field('name', 'Product Name', 'text', { placeholder: 'e.g. Wireless Headphones' })}
        {field('sku', 'SKU', 'text', { placeholder: 'e.g. ELEC-001' })}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {field('price', 'Price ($)', 'number', { placeholder: '0.00', min: '0', step: '0.01' })}
      </div>
      {field('quantity', 'Quantity', 'number', { placeholder: '0', min: '0', step: '1' })}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          placeholder="Optional product description..."
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors">
          {loading ? 'Saving…' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteProduct, setDeleteProduct] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/products')
      setProducts(data)
      setError(null)
    } catch {
      setError('Failed to load products. Make sure the backend is running on port 3001.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter
    return matchSearch && matchCat
  })

  const totalProducts = products.length
  const totalItems = products.reduce((s, p) => s + p.quantity, 0)
  const totalValue = products.reduce((s, p) => s + p.price * p.quantity, 0)
  const lowStock = products.filter(p => p.quantity < 10).length

  const handleAdd = async (form) => {
    setSaving(true)
    try {
      await axios.post('/api/products', form)
      await fetchProducts()
      setShowAddModal(false)
      showToast('Product added successfully!')
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to add product', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (form) => {
    setSaving(true)
    try {
      await axios.put(`/api/products/${editProduct.id}`, form)
      await fetchProducts()
      setEditProduct(null)
      showToast('Product updated successfully!')
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update product', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/products/${deleteProduct.id}`)
      await fetchProducts()
      setDeleteProduct(null)
      showToast('Product deleted.')
    } catch {
      showToast('Failed to delete product', 'error')
    }
  }

  const handleQuantityChange = async (product, delta) => {
    const newQty = product.quantity + delta
    if (newQty < 0) return
    try {
      await axios.put(`/api/products/${product.id}`, { quantity: newQty })
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, quantity: newQty } : p))
    } catch {
      showToast('Failed to update quantity', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">📦</div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Inventory Manager</h1>
              <p className="text-xs text-gray-400 leading-none">Track, manage, and optimize your stock</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <span className="text-base">+</span> Add Product
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Products" value={totalProducts} icon="🗂️" color="bg-indigo-50" />
          <StatsCard label="Total Items" value={totalItems.toLocaleString()} icon="📊" color="bg-blue-50" />
          <StatsCard label="Inventory Value" value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon="💰" color="bg-green-50" />
          <StatsCard label="Low Stock" value={lowStock} icon="⚠️" color="bg-amber-50" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name, SKU, or category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of <span className="font-semibold text-gray-700">{totalProducts}</span> products
        </p>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4 animate-bounce">📦</div>
            <p className="text-lg font-medium">Loading inventory…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onEdit={setEditProduct}
                onDelete={setDeleteProduct}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add New Product" onClose={() => setShowAddModal(false)}>
          <ProductForm onSave={handleAdd} onCancel={() => setShowAddModal(false)} loading={saving} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <Modal title="Edit Product" onClose={() => setEditProduct(null)}>
          <ProductForm
            initial={{ ...editProduct, price: String(editProduct.price), quantity: String(editProduct.quantity) }}
            onSave={handleEdit}
            onCancel={() => setEditProduct(null)}
            loading={saving}
          />
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteProduct && (
        <Modal title="Delete Product" onClose={() => setDeleteProduct(null)}>
          <div className="px-6 py-5">
            <p className="text-gray-600 text-sm">Are you sure you want to delete <span className="font-bold text-gray-800">{deleteProduct.name}</span>? This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteProduct(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
                🗑️ Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 transition-all ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { getProducts, getCollections, createProduct, updateProduct, deleteProduct, uploadImage } from '@/lib/api'
import SaveButton from '@/components/admin/SaveButton'
import Toast from '@/components/admin/Toast'

interface Product {
  _id: string
  name: string
  price: number
  salePrice: number | null
  soldOut: boolean
  collection: string
  image: string
  description: string
}

interface Collection {
  id: string
  name: string
}

const emptyForm = {
  name: '',
  price: '',
  salePrice: '',
  soldOut: false,
  collection: '',
  image: '',
  description: '',
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([getProducts(), getCollections()])
      setProducts(p)
      setCollections(c)
    } catch {
      setToast({ message: 'Failed to load data', type: 'error' })
    } finally {
      setFetching(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function openAdd() {
    setEditId(null)
    setForm(emptyForm)
    setImageFile(null)
    setShowForm(true)
  }

  function openEdit(product: Product) {
    setEditId(product._id)
    setForm({
      name: product.name,
      price: String(product.price),
      salePrice: product.salePrice ? String(product.salePrice) : '',
      soldOut: product.soldOut,
      collection: product.collection,
      image: product.image || '',
      description: product.description || '',
    })
    setImageFile(null)
    setShowForm(true)
  }

  async function handleImageUpload() {
    if (!imageFile) return
    setUploadingImage(true)
    try {
      const token = localStorage.getItem('adminToken') || ''
      const result = await uploadImage(imageFile, token)
      setForm(prev => ({ ...prev, image: result.url }))
      setToast({ message: 'Image uploaded!', type: 'success' })
    } catch (err: any) {
      setToast({ message: err.message || 'Upload failed', type: 'error' })
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken') || ''
      const payload = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
      }
      if (editId) {
        await updateProduct(editId, payload, token)
        setToast({ message: 'Product updated!', type: 'success' })
      } else {
        await createProduct(payload, token)
        setToast({ message: 'Product created!', type: 'success' })
      }
      setShowForm(false)
      setEditId(null)
      await fetchData()
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const token = localStorage.getItem('adminToken') || ''
      await deleteProduct(id, token)
      setToast({ message: 'Product deleted', type: 'success' })
      setDeleteConfirm(null)
      await fetchData()
    } catch (err: any) {
      setToast({ message: err.message || 'Delete failed', type: 'error' })
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm font-medium rounded hover:bg-secondary transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 text-lg">{editId ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Heritage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection *</label>
                <select
                  required
                  value={form.collection}
                  onChange={e => setForm(p => ({ ...p, collection: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select collection...</option>
                  {collections.map(c => (
                    <option key={c._id} value={c.slug ?? c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.price}
                  onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="5250"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (Rs.) <span className="text-gray-400 font-normal">optional</span></label>
                <input
                  type="number"
                  min="0"
                  value={form.salePrice}
                  onChange={e => setForm(p => ({ ...p, salePrice: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Leave blank for no sale"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Short product description..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-primary file:text-white file:cursor-pointer"
                  />
                  {form.image && (
                    <p className="text-xs text-green-600 mt-1 truncate">Current: {form.image}</p>
                  )}
                </div>
                {imageFile && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploadingImage}
                    className="flex items-center gap-2 bg-accent text-white px-4 py-2 text-xs font-medium rounded hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </button>
                )}
              </div>
            </div>

            {/* Sold Out Toggle */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form.soldOut}
                    onChange={e => setForm(p => ({ ...p, soldOut: e.target.checked }))}
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${form.soldOut ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.soldOut ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Mark as Sold Out</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <SaveButton loading={loading} label={editId ? 'Update Product' : 'Create Product'} />
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Collection</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Price</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Sale Price</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No products yet. Click &ldquo;Add Product&rdquo; to create one.
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{product.collection}</td>
                    <td className="px-4 py-3 text-gray-700">Rs. {product.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {product.salePrice ? <span className="text-accent font-medium">Rs. {product.salePrice.toLocaleString()}</span> : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {product.soldOut ? (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">Sold Out</span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded font-medium">Available</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="text-primary hover:text-secondary text-xs font-medium px-2 py-1 rounded hover:bg-primary/5"
                        >
                          Edit
                        </button>
                        {deleteConfirm === product._id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product._id)}
                            className="text-red-400 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-red-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

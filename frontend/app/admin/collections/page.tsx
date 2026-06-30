'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCollections, createCollection, updateCollection, deleteCollection } from '@/lib/api'
import SaveButton from '@/components/admin/SaveButton'
import Toast from '@/components/admin/Toast'

interface Collection {
  _id: string
  slug: string
  name: string
  description: string
  visible: boolean
}

const emptyForm = { slug: '', name: '', description: '', visible: true }

export default function CollectionsAdmin() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const data = await getCollections()
      setCollections(data)
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
    setShowForm(true)
  }

  function openEdit(col: Collection) {
    setEditId(col._id)
    setForm({ slug: col.slug, name: col.name, description: col.description, visible: col.visible })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken') || ''
      if (editId) {
        await updateCollection(editId, { name: form.name, description: form.description, visible: form.visible }, token)
        setToast({ message: 'Collection updated!', type: 'success' })
      } else {
        const slug = form.slug.trim().toLowerCase().replace(/\s+/g, '-') || form.name.toLowerCase().replace(/\s+/g, '-')
        await createCollection({ slug, name: form.name, description: form.description, visible: form.visible }, token)
        setToast({ message: 'Collection created!', type: 'success' })
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
      await deleteCollection(id, token)
      setToast({ message: 'Collection deleted', type: 'success' })
      setDeleteConfirm(null)
      await fetchData()
    } catch (err: any) {
      setToast({ message: err.message || 'Delete failed', type: 'error' })
    }
  }

  async function toggleVisible(col: Collection) {
    try {
      const token = localStorage.getItem('adminToken') || ''
      await updateCollection(col._id, { visible: !col.visible }, token)
      setToast({ message: `Collection ${!col.visible ? 'shown' : 'hidden'}`, type: 'success' })
      await fetchData()
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update', type: 'error' })
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
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Collections</h1>
          <p className="text-gray-500 text-sm mt-1">{collections.length} collections</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm font-medium rounded hover:bg-secondary transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Collection
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">{editId ? 'Edit Collection' : 'Add New Collection'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!editId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-gray-400 font-normal">(e.g. &ldquo;blended&rdquo; — auto-generated if empty)</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="e.g., linen"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Linen Collection"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Short description..."
              />
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={form.visible} onChange={e => setForm(p => ({ ...p, visible: e.target.checked }))} />
                  <div className={`w-11 h-6 rounded-full transition-colors ${form.visible ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.visible ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Visible on storefront</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <SaveButton loading={loading} label={editId ? 'Update Collection' : 'Create Collection'} />
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {collections.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 p-12 text-center text-gray-400">
            No collections yet.
          </div>
        ) : (
          collections.map(col => (
            <div key={col._id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleVisible(col)}
                    className={`w-11 h-6 rounded-full relative transition-colors flex-shrink-0 ${col.visible ? 'bg-primary' : 'bg-gray-300'}`}
                    title={col.visible ? 'Click to hide' : 'Click to show'}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${col.visible ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                  <div>
                    <p className="font-medium text-gray-900">{col.name}</p>
                    <p className="text-xs text-gray-400 font-mono">slug: {col.slug}</p>
                    {col.description && <p className="text-xs text-gray-500 mt-0.5">{col.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${col.visible ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {col.visible ? 'Visible' : 'Hidden'}
                  </span>
                  <button onClick={() => openEdit(col)} className="text-primary hover:text-secondary text-xs font-medium px-2 py-1 rounded hover:bg-primary/5">
                    Edit
                  </button>
                  {deleteConfirm === col._id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(col._id)} className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded">Confirm</button>
                      <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 px-2 py-1 rounded hover:bg-gray-100">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(col._id)} className="text-red-400 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-red-50">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

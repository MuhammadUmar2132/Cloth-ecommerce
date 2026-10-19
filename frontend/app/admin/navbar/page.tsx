'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSiteData, updateSiteSection } from '@/lib/api'
import SaveButton from '@/components/admin/SaveButton'
import Toast from '@/components/admin/Toast'

interface NavLink {
  id: string
  label: string
  href: string
}

export default function NavbarAdmin() {
  const [logo, setLogo] = useState('CAVENRO')
  const [links, setLinks] = useState<NavLink[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const data = await getSiteData()
      setLogo(data.navbar?.logo || 'CAVENRO')
      // Only show top-level links (no nested dropdown editing here for simplicity)
      const topLinks = (data.navbar?.links || []).map((l: any) => ({
        id: l.id || Date.now().toString(),
        label: l.label,
        href: l.href,
      }))
      setLinks(topLinks)
    } catch {
      setToast({ message: 'Failed to load data', type: 'error' })
    } finally {
      setFetching(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function updateLink(index: number, field: keyof NavLink, value: string) {
    setLinks(prev => prev.map((l, i) => i === index ? { ...l, [field]: value } : l))
  }

  function addLink() {
    setLinks(prev => [...prev, { id: Date.now().toString(), label: 'New Link', href: '/' }])
  }

  function removeLink(index: number) {
    setLinks(prev => prev.filter((_, i) => i !== index))
  }

  function moveLink(index: number, direction: 'up' | 'down') {
    const newLinks = [...links]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newLinks.length) return
    ;[newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]]
    setLinks(newLinks)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken') || ''
      await updateSiteSection('navbar', { logo, links }, token)
      setToast({ message: 'Navbar updated successfully!', type: 'success' })
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save', type: 'error' })
    } finally {
      setLoading(false)
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
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Navbar Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the navigation bar logo and links</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Brand Logo</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo Text</label>
            <input
              type="text"
              value={logo}
              onChange={e => setLogo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-2 p-3 bg-gray-50 rounded border">
              <span className="font-serif font-bold text-2xl text-primary tracking-[0.3em] uppercase">{logo}</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Navigation Links</h2>
          <div className="space-y-3">
            {links.map((link, index) => (
              <div key={link.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => moveLink(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-20 p-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => moveLink(index, 'down')} disabled={index === links.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-20 p-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  value={link.label}
                  onChange={e => updateLink(index, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={e => updateLink(index, 'href', e.target.value)}
                  placeholder="/path"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addLink}
            className="mt-4 w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Link
          </button>
        </div>

        <SaveButton loading={loading} />
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

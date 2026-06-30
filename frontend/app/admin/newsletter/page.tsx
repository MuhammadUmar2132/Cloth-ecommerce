'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSiteData, updateSiteSection } from '@/lib/api'
import SaveButton from '@/components/admin/SaveButton'
import Toast from '@/components/admin/Toast'

export default function NewsletterAdmin() {
  const [heading, setHeading] = useState('')
  const [subheading, setSubheading] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [bgColor, setBgColor] = useState('#1a1a2e')
  const [textColor, setTextColor] = useState('#ffffff')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const data = await getSiteData()
      const n = data.newsletter || {}
      setHeading(n.heading || '')
      setSubheading(n.subheading || '')
      setButtonText(n.buttonText || 'Subscribe')
      setBgColor(n.bgColor || '#1a1a2e')
      setTextColor(n.textColor || '#ffffff')
    } catch {
      setToast({ message: 'Failed to load data', type: 'error' })
    } finally {
      setFetching(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken') || ''
      await updateSiteSection('newsletter', { heading, subheading, buttonText, bgColor, textColor }, token)
      setToast({ message: 'Newsletter section updated!', type: 'success' })
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
        <h1 className="text-2xl font-serif font-bold text-gray-900">Newsletter Section</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the newsletter signup section at the bottom of the homepage</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={e => setHeading(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Join our mailing list"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
            <input
              type="text"
              value={subheading}
              onChange={e => setSubheading(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="for the latest product info & more"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={buttonText}
              onChange={e => setButtonText(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Subscribe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <div className="flex gap-2">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-9 border border-gray-300 rounded cursor-pointer p-0.5" />
                <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <div className="flex gap-2">
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-10 h-9 border border-gray-300 rounded cursor-pointer p-0.5" />
                <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)} className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
            <div
              className="rounded p-8 text-center"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              <h2 className="font-serif text-2xl font-bold mb-1">{heading || 'Heading'}</h2>
              <p className="text-sm opacity-80 mb-4">{subheading || 'Subheading'}</p>
              <div className="flex gap-2 max-w-xs mx-auto">
                <div className="flex-1 h-9 bg-white/10 border border-white/30 rounded"></div>
                <div className="bg-yellow-500 text-white text-xs font-bold px-4 flex items-center rounded">
                  {buttonText || 'Subscribe'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <SaveButton loading={loading} />
          </div>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

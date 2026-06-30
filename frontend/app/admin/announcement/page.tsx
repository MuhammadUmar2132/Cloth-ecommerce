'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSiteData, updateSiteSection } from '@/lib/api'
import SaveButton from '@/components/admin/SaveButton'
import Toast from '@/components/admin/Toast'

export default function AnnouncementAdmin() {
  const [announcement, setAnnouncement] = useState('')
  const [visible, setVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const data = await getSiteData()
      setAnnouncement(data.announcement || '')
      setVisible(data.announcementVisible !== false)
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
      await updateSiteSection('announcement', { announcement, announcementVisible: visible }, token)
      setToast({ message: 'Announcement updated successfully!', type: 'success' })
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
        <h1 className="text-2xl font-serif font-bold text-gray-900">Announcement Bar</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the announcement bar displayed at the top of the site</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Announcement Message
            </label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter announcement text..."
            />
            <p className="text-xs text-gray-400 mt-1">This message will be shown in uppercase in the announcement bar</p>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${visible ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${visible ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
              <span className="text-sm font-medium text-gray-700">Show announcement bar</span>
            </label>
            <p className="text-xs text-gray-400 mt-1 ml-14">Toggle to show or hide the announcement bar sitewide</p>
          </div>

          {/* Preview */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
            <div className={`py-2 px-4 text-center text-xs text-white uppercase tracking-widest transition-opacity ${visible ? 'bg-primary opacity-100' : 'bg-gray-400 opacity-50'}`}>
              {announcement || 'Your announcement message here'}
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

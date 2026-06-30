'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSiteData, updateSiteSection } from '@/lib/api'
import SaveButton from '@/components/admin/SaveButton'
import Toast from '@/components/admin/Toast'

interface FooterLink {
  label: string
  href: string
}

export default function FooterAdmin() {
  const [companyName, setCompanyName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [facebook, setFacebook] = useState('')
  const [instagram, setInstagram] = useState('')
  const [copyright, setCopyright] = useState('')
  const [quickLinks, setQuickLinks] = useState<FooterLink[]>([])
  const [infoLinks, setInfoLinks] = useState<FooterLink[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const data = await getSiteData()
      const f = data.footer || {}
      setCompanyName(f.companyName || '')
      setAddress(f.address || '')
      setPhone(f.phone || '')
      setEmail(f.email || '')
      setFacebook(f.social?.facebook || '')
      setInstagram(f.social?.instagram || '')
      setCopyright(f.copyright || '')
      setQuickLinks(f.quickLinks || [])
      setInfoLinks(f.infoLinks || [])
    } catch {
      setToast({ message: 'Failed to load data', type: 'error' })
    } finally {
      setFetching(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function updateLinkList(list: FooterLink[], setList: (v: FooterLink[]) => void, index: number, field: keyof FooterLink, value: string) {
    setList(list.map((l, i) => i === index ? { ...l, [field]: value } : l))
  }

  function addLink(list: FooterLink[], setList: (v: FooterLink[]) => void) {
    setList([...list, { label: '', href: '/' }])
  }

  function removeLink(list: FooterLink[], setList: (v: FooterLink[]) => void, index: number) {
    setList(list.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken') || ''
      await updateSiteSection('footer', {
        companyName,
        address,
        phone,
        email,
        social: { facebook, instagram },
        copyright,
        quickLinks,
        infoLinks,
      }, token)
      setToast({ message: 'Footer updated successfully!', type: 'success' })
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
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Footer Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage footer content, links, and contact details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input type="url" value={facebook} onChange={e => setFacebook(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input type="url" value={instagram} onChange={e => setInstagram(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://instagram.com/..." />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="space-y-2">
            {quickLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  value={link.label}
                  onChange={e => updateLinkList(quickLinks, setQuickLinks, i, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={e => updateLinkList(quickLinks, setQuickLinks, i, 'href', e.target.value)}
                  placeholder="/path"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
                <button type="button" onClick={() => removeLink(quickLinks, setQuickLinks, i)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addLink(quickLinks, setQuickLinks)} className="mt-3 text-sm text-primary hover:text-secondary flex items-center gap-1 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Quick Link
          </button>
        </div>

        {/* Info Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Information Links</h2>
          <div className="space-y-2">
            {infoLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  value={link.label}
                  onChange={e => updateLinkList(infoLinks, setInfoLinks, i, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={e => updateLinkList(infoLinks, setInfoLinks, i, 'href', e.target.value)}
                  placeholder="/path"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
                <button type="button" onClick={() => removeLink(infoLinks, setInfoLinks, i)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addLink(infoLinks, setInfoLinks)} className="mt-3 text-sm text-primary hover:text-secondary flex items-center gap-1 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Info Link
          </button>
        </div>

        {/* Copyright */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Copyright</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
            <input type="text" value={copyright} onChange={e => setCopyright(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <SaveButton loading={loading} />
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSiteData, updateSiteSection } from '@/lib/api'
import SaveButton from '@/components/admin/SaveButton'
import Toast from '@/components/admin/Toast'

interface SeoData {
  siteTitle: string
  titleTemplate: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterCard: string
  canonical: string
  robots: string
  googleVerification: string
}

const defaultSeo: SeoData = {
  siteTitle: 'ZEPHYR | Premium Pakistani Menswear Fabrics',
  titleTemplate: '%s | ZEPHYR',
  description: '',
  keywords: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  twitterCard: 'summary_large_image',
  canonical: 'https://yourdomain.com',
  robots: 'index, follow',
  googleVerification: '',
}

const charCount = (str: string, max: number) => {
  const len = str.length
  const color = len > max ? 'text-red-500' : len > max * 0.85 ? 'text-yellow-500' : 'text-gray-400'
  return <span className={`text-xs ${color}`}>{len}/{max}</span>
}

export default function SeoAdmin() {
  const [form, setForm] = useState<SeoData>(defaultSeo)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const data = await getSiteData()
      if (data?.seo) setForm({ ...defaultSeo, ...data.seo })
    } catch {
      setToast({ message: 'Failed to load SEO data', type: 'error' })
    } finally {
      setFetching(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const set = (field: keyof SeoData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken') || ''
      await updateSiteSection('seo', form, token)
      setToast({ message: 'SEO settings saved!', type: 'success' })
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">SEO Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Control how your site appears in search engines and social media</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic SEO */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Basic SEO</h2>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Site Title</label>
              {charCount(form.siteTitle, 60)}
            </div>
            <input
              type="text"
              value={form.siteTitle}
              onChange={e => set('siteTitle', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="ZEPHYR | Premium Pakistani Menswear Fabrics"
            />
            <p className="text-xs text-gray-400 mt-1">Shown in browser tab and search results. Keep under 60 characters.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title Template</label>
            <input
              type="text"
              value={form.titleTemplate}
              onChange={e => set('titleTemplate', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              placeholder="%s | ZEPHYR"
            />
            <p className="text-xs text-gray-400 mt-1"><code className="bg-gray-100 px-1 rounded">%s</code> is replaced with the page title (e.g. &ldquo;Heritage | ZEPHYR&rdquo;)</p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Meta Description</label>
              {charCount(form.description, 160)}
            </div>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Discover premium quality menswear fabrics..."
            />
            <p className="text-xs text-gray-400 mt-1">Shown in search results below the title. Keep under 160 characters.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
            <input
              type="text"
              value={form.keywords}
              onChange={e => set('keywords', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="menswear fabric, Pakistani fabric, blended fabric..."
            />
            <p className="text-xs text-gray-400 mt-1">Comma-separated keywords.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL (your domain)</label>
            <input
              type="url"
              value={form.canonical}
              onChange={e => set('canonical', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              placeholder="https://yourdomain.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Robots</label>
            <select
              value={form.robots}
              onChange={e => set('robots', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="index, follow">index, follow (recommended — visible to search engines)</option>
              <option value="noindex, follow">noindex, follow (hidden from search results)</option>
              <option value="index, nofollow">index, nofollow (indexed but links not followed)</option>
              <option value="noindex, nofollow">noindex, nofollow (completely hidden)</option>
            </select>
          </div>
        </div>

        {/* Open Graph */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-semibold text-gray-900">Open Graph (Social Sharing)</h2>
            <p className="text-xs text-gray-400 mt-1">Controls how your site looks when shared on Facebook, WhatsApp, LinkedIn etc.</p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">OG Title</label>
              {charCount(form.ogTitle, 70)}
            </div>
            <input
              type="text"
              value={form.ogTitle}
              onChange={e => set('ogTitle', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="ZEPHYR | Premium Pakistani Menswear Fabrics"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">OG Description</label>
              {charCount(form.ogDescription, 200)}
            </div>
            <textarea
              value={form.ogDescription}
              onChange={e => set('ogDescription', e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Shop the finest menswear fabrics in Pakistan..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
            <input
              type="text"
              value={form.ogImage}
              onChange={e => set('ogImage', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              placeholder="/uploads/og-image.jpg  or  https://..."
            />
            <p className="text-xs text-gray-400 mt-1">Recommended size: 1200×630 px. Upload via Products &gt; image upload, then paste the URL here.</p>
            {form.ogImage && (
              <div className="mt-2 rounded border border-gray-200 overflow-hidden w-48">
                <img src={form.ogImage.startsWith('http') ? form.ogImage : `http://localhost:5000${form.ogImage}`} alt="OG preview" className="w-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>
        </div>

        {/* Twitter Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-semibold text-gray-900">Twitter / X Card</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
            <select
              value={form.twitterCard}
              onChange={e => set('twitterCard', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="summary_large_image">summary_large_image (large image preview — recommended)</option>
              <option value="summary">summary (small square image)</option>
            </select>
          </div>
        </div>

        {/* Google Verification */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-semibold text-gray-900">Google Search Console</h2>
            <p className="text-xs text-gray-400 mt-1">Paste your verification code from Google Search Console to verify site ownership.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Verification Code</label>
            <input
              type="text"
              value={form.googleVerification}
              onChange={e => set('googleVerification', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              placeholder="e.g. abc123xyz456..."
            />
            <p className="text-xs text-gray-400 mt-1">Found in Google Search Console → Settings → Ownership verification → HTML tag. Copy only the content value.</p>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">Search Result Preview</h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-xs text-gray-400 mb-1 font-mono">{form.canonical || 'https://yourdomain.com'}</p>
            <p className="text-blue-700 text-lg font-medium leading-tight hover:underline cursor-default truncate">
              {form.siteTitle || 'ZEPHYR | Premium Pakistani Menswear Fabrics'}
            </p>
            <p className="text-gray-600 text-sm mt-1 leading-snug line-clamp-2">
              {form.description || 'Your meta description will appear here...'}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">Approximate preview — actual appearance may vary by search engine.</p>
        </div>

        <SaveButton loading={loading} label="Save SEO Settings" />
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

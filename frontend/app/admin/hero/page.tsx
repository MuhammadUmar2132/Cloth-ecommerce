'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSiteData, updateSiteSection } from '@/lib/api'
import SaveButton from '@/components/admin/SaveButton'
import Toast from '@/components/admin/Toast'

interface Slide {
  id: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  bgColor: string
  textColor: string
}

export default function HeroAdmin() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [autoplay, setAutoplay] = useState(true)
  const [interval, setIntervalVal] = useState(4000)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const data = await getSiteData()
      setSlides(data.hero?.slides || [])
      setAutoplay(data.hero?.autoplay !== false)
      setIntervalVal(data.hero?.interval || 4000)
    } catch {
      setToast({ message: 'Failed to load data', type: 'error' })
    } finally {
      setFetching(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function updateSlide(index: number, field: keyof Slide, value: string) {
    setSlides(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  function addSlide() {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: 'New Collection',
      subtitle: 'Discover our latest fabrics',
      buttonText: 'Shop Now',
      buttonLink: '/collections',
      bgColor: '#1a1a2e',
      textColor: '#ffffff'
    }
    setSlides(prev => [...prev, newSlide])
  }

  function removeSlide(index: number) {
    setSlides(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken') || ''
      await updateSiteSection('hero', { slides, autoplay, interval }, token)
      setToast({ message: 'Hero slider updated successfully!', type: 'success' })
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
        <h1 className="text-2xl font-serif font-bold text-gray-900">Hero Slider</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the homepage hero slides</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Slider Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={autoplay} onChange={e => setAutoplay(e.target.checked)} />
                  <div className={`w-11 h-6 rounded-full transition-colors ${autoplay ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoplay ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Autoplay</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interval (ms)</label>
              <input
                type="number"
                value={interval}
                onChange={e => setIntervalVal(Number(e.target.value))}
                min="1000"
                max="10000"
                step="500"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Slides */}
        {slides.map((slide, index) => (
          <div key={slide.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Slide {index + 1}</h2>
              {slides.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlide(index)}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              )}
            </div>

            {/* Preview */}
            <div
              className="w-full h-24 flex items-center justify-center rounded mb-4 text-center px-4"
              style={{ backgroundColor: slide.bgColor, color: slide.textColor }}
            >
              <div>
                <p className="font-serif font-bold text-lg leading-tight">{slide.title || 'Title'}</p>
                <p className="text-xs opacity-80">{slide.subtitle || 'Subtitle'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={e => updateSlide(index, 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={slide.subtitle}
                  onChange={e => updateSlide(index, 'subtitle', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={slide.buttonText}
                  onChange={e => updateSlide(index, 'buttonText', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                <input
                  type="text"
                  value={slide.buttonLink}
                  onChange={e => updateSlide(index, 'buttonLink', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={slide.bgColor}
                    onChange={e => updateSlide(index, 'bgColor', e.target.value)}
                    className="w-10 h-9 border border-gray-300 rounded cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={slide.bgColor}
                    onChange={e => updateSlide(index, 'bgColor', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={slide.textColor}
                    onChange={e => updateSlide(index, 'textColor', e.target.value)}
                    className="w-10 h-9 border border-gray-300 rounded cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={slide.textColor}
                    onChange={e => updateSlide(index, 'textColor', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Slide Button */}
        <button
          type="button"
          onClick={addSlide}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          Add New Slide
        </button>

        <SaveButton loading={loading} />
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

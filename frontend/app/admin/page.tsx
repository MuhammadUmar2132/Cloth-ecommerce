'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getProducts, getCollections } from '@/lib/api'

interface StatCard {
  label: string
  value: string | number
  href: string
  icon: string
  color: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getCollections()])
      .then(([p, c]) => {
        setProducts(p)
        setCollections(c)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats: StatCard[] = [
    {
      label: 'Total Products',
      value: loading ? '...' : products.length,
      href: '/admin/products',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Collections',
      value: loading ? '...' : collections.length,
      href: '/admin/collections',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      color: 'bg-green-50 text-green-600'
    },
    {
      label: 'Sold Out',
      value: loading ? '...' : products.filter((p: any) => p.soldOut).length,
      href: '/admin/products',
      icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
      color: 'bg-red-50 text-red-600'
    },
    {
      label: 'On Sale',
      value: loading ? '...' : products.filter((p: any) => p.salePrice).length,
      href: '/admin/products',
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      color: 'bg-yellow-50 text-yellow-600'
    },
  ]

  const quickActions = [
    { href: '/admin/announcement', label: 'Edit Announcement', desc: 'Update the top announcement bar' },
    { href: '/admin/hero', label: 'Edit Hero Slider', desc: 'Manage homepage slides' },
    { href: '/admin/navbar', label: 'Edit Navigation', desc: 'Update navbar links and logo' },
    { href: '/admin/products', label: 'Add Product', desc: 'Create a new product listing' },
    { href: '/admin/newsletter', label: 'Edit Newsletter', desc: 'Update newsletter section' },
    { href: '/admin/footer', label: 'Edit Footer', desc: 'Update footer content' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to the Zephyr admin panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-2.5 rounded-lg ${stat.color} mb-3`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{action.label}</h3>
              <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
              <div className="mt-3 text-primary text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Go to section
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      {!loading && products.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
            <Link href="/admin/products" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Collection</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Price</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.slice(0, 5).map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{product.collection}</td>
                    <td className="px-4 py-3 text-gray-700">Rs. {product.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {product.soldOut ? (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Sold Out</span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

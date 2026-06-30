'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/authContext'
import { updateUserProfile, getUserOrders } from '@/lib/api'

interface OrderItem {
  productId: string
  name: string
  price: number
  salePrice: number | null
  quantity: number
  image: string
}

interface Order {
  _id: string
  orderNumber: string
  items: OrderItem[]
  total: number
  name: string
  phone: string
  address: string
  city: string
  notes: string
  status: string
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

export default function ProfileClient() {
  const { user, token, logout, updateUser, isLoading } = useAuth()
  const router = useRouter()

  const [orders, setOrders]       = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [editing, setEditing]     = useState(false)
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveOk, setSaveOk]       = useState(false)
  const [slipOrder, setSlipOrder] = useState<Order | null>(null)

  const [editForm, setEditForm] = useState({ name: '', phone: '', address: '', city: '' })

  useEffect(() => {
    if (!isLoading && !user) router.replace('/signin?redirect=/profile')
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name, phone: user.phone, address: user.address, city: user.city })
    }
  }, [user])

  useEffect(() => {
    if (token) {
      setOrdersLoading(true)
      getUserOrders(token)
        .then(data => setOrders(data))
        .catch(() => {})
        .finally(() => setOrdersLoading(false))
    }
  }, [token])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setSaving(true); setSaveError(''); setSaveOk(false)
    try {
      const updated = await updateUserProfile(editForm, token)
      updateUser(updated)
      setSaveOk(true)
      setEditing(false)
      setTimeout(() => setSaveOk(false), 3000)
    } catch (err: any) {
      setSaveError(err.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Order Slip Modal */}
      {slipOrder && <OrderSlip order={slipOrder} onClose={() => setSlipOrder(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg tracking-wider">
            {initials}
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-primary uppercase tracking-wide">{user.name}</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); router.push('/') }}
          className="text-xs tracking-wider uppercase text-gray-400 hover:text-red-400 transition-colors border border-gray-200 hover:border-red-300 px-3 py-1.5"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-base font-bold text-primary uppercase tracking-wide">Profile</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs tracking-wider uppercase text-primary underline"
                >
                  Edit
                </button>
              )}
            </div>

            {saveOk && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-xs px-3 py-2 mb-4">
                Profile updated!
              </div>
            )}

            {editing ? (
              <form onSubmit={handleSave} className="space-y-3">
                {saveError && (
                  <p className="text-red-400 text-xs">{saveError}</p>
                )}
                {[
                  ['name',    'Full Name',   'text'],
                  ['phone',   'Phone',       'tel'],
                  ['city',    'City',        'text'],
                  ['address', 'Address',     'text'],
                ].map(([key, label, type]) => (
                  <div key={key}>
                    <label className="block text-xs tracking-wider uppercase text-gray-400 mb-1">{label}</label>
                    <input
                      type={type}
                      value={editForm[key as keyof typeof editForm]}
                      onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2 bg-primary text-white text-xs tracking-wider uppercase font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setSaveError('') }}
                    className="flex-1 py-2 border border-gray-200 text-xs tracking-wider uppercase text-gray-500 hover:border-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-sm">
                {[
                  ['Email',   user.email],
                  ['Phone',   user.phone   || '—'],
                  ['City',    user.city    || '—'],
                  ['Address', user.address || '—'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs tracking-wider uppercase text-gray-400">{label}</p>
                    <p className="text-gray-700 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders */}
        <div className="md:col-span-2">
          <h2 className="font-serif text-base font-bold text-primary uppercase tracking-wide mb-5">Order History</h2>

          {ordersLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-gray-100 p-10 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-400 text-sm">No orders yet</p>
              <Link href="/" className="text-primary text-sm underline mt-2 inline-block">Start shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                      <p className="font-mono text-sm font-semibold text-primary">{order.orderNumber}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-0.5 mb-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.name} × {item.quantity}</span>
                        <span>Rs. {((item.salePrice ?? item.price) * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <p className="font-bold text-primary">Total: Rs. {order.total.toLocaleString()}</p>
                    <button
                      onClick={() => setSlipOrder(order)}
                      className="text-xs tracking-wider uppercase text-primary border border-primary px-3 py-1.5 hover:bg-primary hover:text-white transition-colors"
                    >
                      View Slip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OrderSlip({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-sm max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Slip Header */}
        <div className="bg-primary text-white text-center py-5 px-6">
          <p className="font-serif text-lg font-bold tracking-[0.3em] uppercase">ZEPHYR</p>
          <p className="text-xs text-white/70 mt-1 tracking-wider uppercase">Order Receipt</p>
        </div>

        <div className="p-6">
          {/* Order Info */}
          <div className="flex justify-between text-xs text-gray-500 mb-5">
            <div>
              <p className="text-gray-400 uppercase tracking-wider mb-0.5">Order No.</p>
              <p className="font-mono font-semibold text-primary text-sm">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
              <p className="font-semibold text-gray-700">
                {new Date(order.createdAt).toLocaleDateString('en-PK', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className={`inline-flex text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-5 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
            {order.status}
          </div>

          {/* Items */}
          <div className="border-t border-dashed border-gray-200 pt-4 mb-4">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Items</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                  <span className="font-medium">Rs. {((item.salePrice ?? item.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-dashed border-gray-200 pt-3 mb-5">
            <div className="flex justify-between font-bold text-primary">
              <span>Total</span>
              <span>Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Delivery */}
          <div className="border-t border-dashed border-gray-200 pt-4 text-sm">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Delivery Details</p>
            <div className="space-y-1 text-gray-700">
              <p><span className="text-gray-400">Name: </span>{order.name}</p>
              <p><span className="text-gray-400">Phone: </span>{order.phone}</p>
              <p><span className="text-gray-400">City: </span>{order.city}</p>
              <p><span className="text-gray-400">Address: </span>{order.address}</p>
              {order.notes && <p><span className="text-gray-400">Notes: </span>{order.notes}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-dashed border-gray-200 mt-5 pt-4 text-center text-xs text-gray-400">
            <p>Thank you for shopping with ZEPHYR</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex border-t border-gray-100">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 text-xs tracking-wider uppercase font-bold text-primary hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 text-xs tracking-wider uppercase font-bold text-gray-500 hover:bg-gray-50 transition-colors border-l border-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

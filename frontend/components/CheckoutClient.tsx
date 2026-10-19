'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cartContext'
import { useAuth } from '@/lib/authContext'
import { createOrder } from '@/lib/api'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function getImageSrc(image?: string | null) {
  if (!image) return null
  if (image.startsWith('http://') || image.startsWith('https://')) return image
  if (image.startsWith('/')) return image
  return `${API.replace(/\/$/, '')}/uploads/${image}`
}

interface Form { name: string; phone: string; address: string; city: string; notes: string }

interface OrderResult { orderNumber: string; total: number; items: any[]; name: string; city: string }

export default function CheckoutClient({ whatsapp }: { whatsapp: string }) {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user, token, isLoading }          = useAuth()
  const router                              = useRouter()

  const [form, setForm]   = useState<Form>({ name: '', phone: '', address: '', city: '', notes: '' })
  const [errors, setErrors] = useState<Partial<Form>>({})
  const [placing, setPlacing]   = useState(false)
  const [orderError, setOrderError] = useState('')
  const [success, setSuccess]   = useState<OrderResult | null>(null)

  // Pre-fill from user profile
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name:    f.name    || user.name,
        phone:   f.phone   || user.phone,
        address: f.address || user.address,
        city:    f.city    || user.city,
      }))
    }
  }, [user])

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) router.replace('/signin?redirect=%2Fcheckout')
  }, [user, isLoading, router])

  // Redirect if cart is empty (and not on success screen)
  useEffect(() => {
    if (!isLoading && cartItems.length === 0 && !success) router.replace('/cart')
  }, [cartItems, isLoading, success, router])

  const validate = () => {
    const e: Partial<Form> = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.phone.trim())   e.phone   = 'Phone is required'
    else if (!/^[0-9+\s\-]{10,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid number'
    if (!form.city.trim())    e.city    = 'City is required'
    if (!form.address.trim()) e.address = 'Address is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePurchase = async () => {
    if (!validate() || !token || cartItems.length === 0) return
    setPlacing(true); setOrderError('')

    try {
      // 1. Save order to database
      const saved = await createOrder({
        items: cartItems.map(i => ({
          productId: i.id,
          name:      i.name,
          price:     i.price,
          salePrice: i.salePrice,
          image:     i.image,
          quantity:  i.quantity,
        })),
        total:   cartTotal,
        name:    form.name,
        phone:   form.phone,
        address: form.address,
        city:    form.city,
        notes:   form.notes,
      }, token)

      // 2. Send order details to WhatsApp
      const itemLines = cartItems
        .map(i => `• ${i.name} ×${i.quantity} — Rs. ${((i.salePrice ?? i.price) * i.quantity).toLocaleString()}`)
        .join('\n')

      const msg = [
        `🛒 *New Order — CAVENRO*`,
        `Order No: *${saved.orderNumber}*`,
        '',
        itemLines,
        '',
        `*Total: Rs. ${cartTotal.toLocaleString()}*`,
        '',
        `📦 *Delivery Details*`,
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        `City: ${form.city}`,
        `Address: ${form.address}`,
        form.notes ? `Notes: ${form.notes}` : '',
      ].filter(Boolean).join('\n')

      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')

      // 3. Show success, clear cart
      setSuccess({ orderNumber: saved.orderNumber, total: cartTotal, items: cartItems, name: form.name, city: form.city })
      clearCart()
    } catch (err: any) {
      setOrderError(err.message || 'Order failed. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Order Success ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center py-16">
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="font-serif text-2xl font-bold text-primary uppercase tracking-wide mb-2">Order Confirmed!</h2>
        <p className="text-sm text-gray-400 mb-1">Your order has been saved and sent to WhatsApp.</p>
        <p className="text-sm text-gray-500 mb-5">
          Order No: <span className="font-mono font-bold text-primary">{success.orderNumber}</span>
        </p>

        {/* Mini receipt */}
        <div className="w-full max-w-sm border border-gray-100 p-5 text-left mb-8">
          <div className="space-y-1.5 text-sm text-gray-600 mb-3">
            {success.items.map((i: any, idx: number) => (
              <div key={idx} className="flex justify-between">
                <span>{i.name} × {i.quantity}</span>
                <span>Rs. {((i.salePrice ?? i.price) * i.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-primary">
            <span>Total</span>
            <span>Rs. {success.total.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Delivering to: {success.name}, {success.city}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link href="/" className="flex-1 py-3 bg-primary text-white text-sm font-bold tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors text-center">
            Continue Shopping
          </Link>
          <Link href="/profile" className="flex-1 py-3 border border-primary text-primary text-sm font-bold tracking-[0.2em] uppercase hover:bg-primary/5 transition-colors text-center">
            My Orders
          </Link>
        </div>
      </div>
    )
  }

  // ── Checkout Form ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="text-xs tracking-wider uppercase text-gray-400 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <span>/</span>
        <span className="text-gray-600">Checkout</span>
      </nav>

      <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary uppercase tracking-wide mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* ── Delivery Form ─────────────────────────────────────────────── */}
        <div className="lg:col-span-3">
          <h2 className="font-serif text-base font-bold text-primary uppercase tracking-wide mb-5">Delivery Details</h2>

          {/* Signed-in user badge */}
          <div className="flex items-center gap-2 mb-5 p-3 bg-gray-50 border border-gray-100">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold text-primary">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1">Full Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Receiver's full name"
                className={`w-full border px-3 py-3 text-sm outline-none focus:border-primary transition-colors ${errors.name ? 'border-red-300' : 'border-gray-200'}`} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1">Phone Number *</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="03XX-XXXXXXX"
                className={`w-full border px-3 py-3 text-sm outline-none focus:border-primary transition-colors ${errors.phone ? 'border-red-300' : 'border-gray-200'}`} />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1">City *</label>
              <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Lahore, Karachi, Islamabad"
                className={`w-full border px-3 py-3 text-sm outline-none focus:border-primary transition-colors ${errors.city ? 'border-red-300' : 'border-gray-200'}`} />
              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1">Complete Address *</label>
              <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="House No. / Street / Area" rows={3}
                className={`w-full border px-3 py-3 text-sm outline-none focus:border-primary transition-colors resize-none ${errors.address ? 'border-red-300' : 'border-gray-200'}`} />
              {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1">Order Notes (optional)</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any special instructions or size preferences…" rows={2}
                className="w-full border border-gray-200 px-3 py-3 text-sm outline-none focus:border-primary transition-colors resize-none" />
            </div>
          </div>
        </div>

        {/* ── Order Summary + Purchase Button ───────────────────────────── */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-base font-bold text-primary uppercase tracking-wide mb-5">Order Summary</h2>

          {/* Items */}
          <div className="border border-gray-100 p-5 mb-4 space-y-3">
            {cartItems.map(item => {
              const imgSrc = getImageSrc(item.image)
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="shrink-0 w-12 h-14 relative bg-gray-100 overflow-hidden">
                    {imgSrc
                      ? <Image src={imgSrc} alt={item.name} fill className="object-cover" sizes="48px" />
                      : <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 shrink-0">
                    Rs. {((item.salePrice ?? item.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Total */}
          <div className="border border-gray-100 p-4 mb-5">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-3">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Calculated via WhatsApp</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-primary text-base">
              <span>Order Total</span>
              <span>Rs. {cartTotal.toLocaleString()}</span>
            </div>
          </div>

          {orderError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-4">
              {orderError}
            </div>
          )}

          {/* THE PURCHASE BUTTON — saves to DB + opens WhatsApp */}
          <button
            onClick={handlePurchase}
            disabled={placing}
            className="w-full py-4 bg-primary text-white text-sm font-bold tracking-[0.2em] uppercase hover:bg-primary/90 disabled:opacity-60 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {placing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Placing Order…
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm Purchase
              </>
            )}
          </button>

          {/* What happens explainer */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">What happens next:</p>
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">1</span>
              <span>Your order is saved on our website with a unique order number</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <span className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">2</span>
              <span>WhatsApp opens automatically with your complete order details</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">3</span>
              <span>We confirm your order and arrange delivery</span>
            </div>
          </div>

          <Link href="/cart" className="block text-center text-xs text-gray-400 hover:text-primary transition-colors mt-4">
            ← Edit Cart
          </Link>
        </div>
      </div>
    </div>
  )
}

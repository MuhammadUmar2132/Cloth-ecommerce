'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  salePrice: number | null
  image: string
  collection: string
}

export interface CartEntry extends CartItem {
  quantity: number
}

interface CartContextType {
  cartItems: CartEntry[]
  wishlist: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  addToWishlist: (item: CartItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  cartCount: number
  cartTotal: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartEntry[]>([])
  const [wishlist, setWishlist] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zephyr_cart')
      if (saved) setCartItems(JSON.parse(saved))
      const savedWish = localStorage.getItem('zephyr_wishlist')
      if (savedWish) setWishlist(JSON.parse(savedWish))
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) localStorage.setItem('zephyr_cart', JSON.stringify(cartItems))
  }, [cartItems, ready])

  useEffect(() => {
    if (ready) localStorage.setItem('zephyr_wishlist', JSON.stringify(wishlist))
  }, [wishlist, ready])

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => setCartItems(prev => prev.filter(i => i.id !== id))

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) { removeFromCart(id); return }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => setCartItems([])

  const addToWishlist = (item: CartItem) => {
    setWishlist(prev => prev.find(i => i.id === item.id) ? prev : [...prev, item])
  }

  const removeFromWishlist = (id: string) => setWishlist(prev => prev.filter(i => i.id !== id))

  const isInWishlist = (id: string) => wishlist.some(i => i.id === id)

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cartItems.reduce((s, i) => s + (i.salePrice ?? i.price) * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      cartItems, wishlist,
      addToCart, removeFromCart, updateQuantity, clearCart,
      addToWishlist, removeFromWishlist, isInWishlist,
      cartCount, cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

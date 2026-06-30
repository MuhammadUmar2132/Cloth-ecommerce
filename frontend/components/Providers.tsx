'use client'

import { CartProvider } from '@/lib/cartContext'
import { AuthProvider } from '@/lib/authContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  )
}

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (u: AuthUser) => void
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  city?: string
}

const AuthContext = createContext<AuthContextType | null>(null)
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null)
  const [token, setToken]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const t = localStorage.getItem('cavenro_token') || localStorage.getItem('zephyr_token')
      const u = localStorage.getItem('cavenro_user') || localStorage.getItem('zephyr_user')
      if (t && u) { setToken(t); setUser(JSON.parse(u)) }
    } catch {}
    setIsLoading(false)
  }, [])

  const persist = (t: string, u: AuthUser) => {
    localStorage.setItem('cavenro_token', t)
    localStorage.setItem('cavenro_user', JSON.stringify(u))
    setToken(t); setUser(u)
  }

  const login = async (email: string, password: string) => {
    const res  = await fetch(`${API}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed')
    persist(data.token, data.user)
  }

  const register = async (form: RegisterData) => {
    const res  = await fetch(`${API}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Registration failed')
    persist(data.token, data.user)
  }

  const logout = () => {
    localStorage.removeItem('cavenro_token')
    localStorage.removeItem('cavenro_user')
    localStorage.removeItem('zephyr_token')
    localStorage.removeItem('zephyr_user')
    setToken(null); setUser(null)
  }

  const updateUser = (u: AuthUser) => {
    setUser(u)
    localStorage.setItem('cavenro_user', JSON.stringify(u))
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

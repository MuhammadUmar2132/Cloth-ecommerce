'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/authContext'

export default function SignInForm() {
  const { login } = useAuth()
  const router     = useRouter()
  const params     = useSearchParams()
  const redirect    = params.get('redirect') || '/profile'
  const registered  = params.get('registered') === '1'

  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      router.push(redirect)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold text-primary uppercase tracking-[0.2em]">Sign In</h1>
          <p className="text-gray-400 text-sm mt-2">{registered ? 'Account created! Please sign in.' : 'Welcome back'}</p>
        </div>

        <form onSubmit={handle} className="border border-gray-100 p-8 space-y-5">
          {registered && !error && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
              Account created successfully! Sign in to continue.
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-white text-sm font-bold tracking-[0.2em] uppercase hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an account?{' '}
          <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} className="text-primary underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

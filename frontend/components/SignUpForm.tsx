'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/authContext'

export default function SignUpForm() {
  const { register } = useAuth()
  const router   = useRouter()
  const params   = useSearchParams()
  const redirect = params.get('redirect') || '/checkout'

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', phone: '', city: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim())     e.name     = 'Name is required'
    if (!form.email.trim())    e.email    = 'Email is required'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone, city: form.city })
      // After creating account, go to signin so they explicitly log in
      const signinUrl = redirect !== '/checkout'
        ? `/signin?redirect=${encodeURIComponent(redirect)}&registered=1`
        : `/signin?redirect=%2Fcheckout&registered=1`
      router.push(signinUrl)
    } catch (err: any) {
      setServerError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const field = (
    id: keyof typeof form,
    label: string,
    type = 'text',
    placeholder = '',
    required = false
  ) => (
    <div>
      <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1">
        {label}{required && ' *'}
      </label>
      <input
        type={type}
        value={form[id]}
        onChange={f(id)}
        placeholder={placeholder}
        className={`w-full border px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors ${errors[id] ? 'border-red-300' : 'border-gray-200'}`}
      />
      {errors[id] && <p className="text-red-400 text-xs mt-1">{errors[id]}</p>}
    </div>
  )

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold text-primary uppercase tracking-[0.2em]">Create Account</h1>
          <p className="text-gray-400 text-sm mt-2">Join ZEPHYR today</p>
        </div>

        <form onSubmit={handle} className="border border-gray-100 p-8 space-y-4">
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
              {serverError}
            </div>
          )}

          {field('name',     'Full Name',        'text',     'Your full name',     true)}
          {field('email',    'Email',            'email',    'you@example.com',    true)}
          {field('password', 'Password',         'password', '••••••••',           true)}
          {field('confirm',  'Confirm Password', 'password', '••••••••',           true)}
          {field('phone',    'Phone (optional)', 'tel',      '03XX-XXXXXXX')}
          {field('city',     'City (optional)',  'text',     'e.g. Lahore')}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-white text-sm font-bold tracking-[0.2em] uppercase hover:bg-primary/90 disabled:opacity-60 transition-colors mt-2"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link href={`/signin?redirect=${encodeURIComponent(redirect)}`} className="text-primary underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

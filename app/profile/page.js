'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import toast from 'react-hot-toast'
import { User, Save, Package } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', street: '', city: '', state: '', zip: '', country: 'US' })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status])

  useEffect(() => {
    if (session?.user) {
      setForm(prev => ({ ...prev, name: session.user.name || '' }))
    }
  }, [session])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Profile updated!')
        await update({ name: form.name })
      } else {
        toast.error('Failed to update profile')
      }
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading') return (
    <MainLayout><div className="max-w-2xl mx-auto px-4 py-20 text-center text-ink-400">Loading...</div></MainLayout>
  )

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
            <span className="text-brand-700 font-display font-bold text-2xl">
              {session?.user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900">{session?.user?.name}</h1>
            <p className="text-ink-500">{session?.user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-3">
            <div className="card p-4">
              <nav className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium">
                  <User className="w-4 h-4" /> Profile
                </div>
                <Link href="/orders" className="flex items-center gap-2 px-3 py-2 text-ink-600 hover:bg-ink-50 rounded-lg text-sm transition-colors">
                  <Package className="w-4 h-4" /> My Orders
                </Link>
              </nav>
            </div>
            {session?.user?.role === 'admin' && (
              <Link href="/admin" className="card p-4 block text-center text-sm font-semibold text-brand-600 hover:bg-brand-50 transition-colors">
                ⚙️ Admin Panel
              </Link>
            )}
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSave} className="card p-6 space-y-5">
              <h2 className="font-display text-xl font-bold text-ink-900">Personal Information</h2>
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input className="input bg-ink-50" value={session?.user?.email || ''} disabled />
                <p className="text-xs text-ink-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 555 000 0000" />
              </div>

              <hr className="border-ink-100" />
              <h3 className="font-semibold text-ink-900">Default Shipping Address</h3>

              <div>
                <label className="label">Street Address</label>
                <input className="input" value={form.street} onChange={e => setForm(p => ({ ...p, street: e.target.value }))} placeholder="123 Main St" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City</label>
                  <input className="input" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="New York" />
                </div>
                <div>
                  <label className="label">State</label>
                  <input className="input" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} placeholder="NY" />
                </div>
                <div>
                  <label className="label">ZIP Code</label>
                  <input className="input" value={form.zip} onChange={e => setForm(p => ({ ...p, zip: e.target.value }))} placeholder="10001" />
                </div>
                <div>
                  <label className="label">Country</label>
                  <select className="input" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="IN">India</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

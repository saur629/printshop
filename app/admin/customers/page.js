'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDate, formatPrice } from '@/lib/utils'
import { Search, Users, Mail, Phone } from 'lucide-react'
import { AdminSidebar } from '@/app/admin/page'

export default function AdminCustomersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/')
  }, [status, session])

  useEffect(() => {
    if (status !== 'authenticated') return
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/admin/customers')
        const data = await res.json()
        setCustomers(data.customers || [])
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [status])

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar active="/admin/customers" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-ink-900">Customers</h1>
          <span className="badge bg-brand-100 text-brand-700">{customers.length} total</span>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="input pl-9 w-72" />
        </div>

        {loading ? (
          <div className="card p-10 text-center text-ink-400">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-ink-300" />
            <p className="text-ink-500">No customers found</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 border-b border-ink-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">Phone</th>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">Joined</th>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">Orders</th>
                  <th className="text-right px-5 py-3 font-semibold text-ink-600">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer._id} className="border-b border-ink-100 hover:bg-ink-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
                          {customer.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-ink-900">{customer.name}</p>
                          <p className="text-ink-500 text-xs flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink-600">
                      {customer.phone ? (
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</span>
                      ) : <span className="text-ink-400">—</span>}
                    </td>
                    <td className="px-5 py-4 text-ink-500">{formatDate(customer.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className="badge bg-blue-50 text-blue-700">{customer.orderCount || 0} orders</span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-ink-900">
                      {formatPrice(customer.totalSpent || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

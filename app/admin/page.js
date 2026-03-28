'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Package, ShoppingCart, Users, DollarSign,
  BarChart2, LogOut, Menu, X
} from 'lucide-react'
import { formatPrice, ORDER_STATUS_COLORS } from '@/lib/utils'

const NAV = [
  { href: '/admin',           label: 'Dashboard', icon: BarChart2 },
  { href: '/admin/orders',    label: 'Orders',    icon: Package },
  { href: '/admin/products',  label: 'Products',  icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
]

export function AdminSidebar({ active = '/admin' }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-ink-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded flex items-center justify-center text-xs font-bold">P</div>
          <span className="font-display font-bold text-sm">PrintCraft Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg hover:bg-ink-800"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed top-12 left-0 right-0 z-50 bg-ink-900 border-t border-ink-800 px-4 py-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active === href
                  ? 'bg-brand-500 text-white'
                  : 'text-ink-300 hover:bg-ink-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <hr className="border-ink-800 my-2" />
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-ink-400 text-sm rounded-lg hover:bg-ink-800"
          >
            ↗ View Store
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-3 py-2 text-red-400 text-sm rounded-lg hover:bg-ink-800 w-full"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 bg-ink-900 text-white min-h-screen shrink-0 flex-col">
        <div className="p-5 border-b border-ink-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded flex items-center justify-center text-xs font-bold">P</div>
            <span className="font-display font-bold">PrintCraft</span>
          </Link>
          <p className="text-xs text-ink-500 mt-1">Admin Panel</p>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active === href
                  ? 'bg-brand-500 text-white'
                  : 'text-ink-300 hover:bg-ink-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-ink-800 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-ink-400 hover:text-ink-200 text-xs rounded-lg hover:bg-ink-800 transition-colors"
          >
            ↗ View Store
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-3 py-2 text-ink-400 hover:text-red-400 text-xs rounded-lg hover:bg-ink-800 transition-colors w-full"
          >
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/admin')
      return
    }
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/')
      return
    }
  }, [status, session])

  useEffect(() => {
    if (status !== 'authenticated' || session?.user?.role !== 'admin') return
    const fetchStats = async () => {
      try {
        setError(null)
        const res = await fetch('/api/admin/stats')
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to load stats')
        }
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [status, session])

  if (status === 'loading') return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar />
      <div className="flex-1 flex items-center justify-center mt-12 md:mt-0">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-ink-400">Loading...</p>
        </div>
      </div>
    </div>
  )

  if (session?.user?.role !== 'admin') return null

  const { stats, recentOrders = [], revenueByDay = [] } = data || {}

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      sub: `${formatPrice(stats?.monthRevenue || 0)} this month`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      sub: `${stats?.monthOrders || 0} this month`,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Customers',
      value: stats?.totalCustomers || 0,
      sub: 'registered accounts',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Active Products',
      value: stats?.totalProducts || 0,
      sub: `${stats?.pendingOrders || 0} pending`,
      icon: ShoppingCart,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  const chartData = revenueByDay.map(d => ({
    date: new Date(d._id).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    Revenue: parseFloat(d.revenue.toFixed(2)),
    Orders: d.orders,
  }))

  return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar active="/admin" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="p-4 md:p-8">
          <div className="mb-6">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-ink-900">Dashboard</h1>
            <p className="text-ink-500 mt-1 text-sm">
              Welcome back, {session?.user?.name?.split(' ')[0]} 👋
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
              <p className="font-semibold mb-1">Could not load dashboard data</p>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-red-600 underline text-xs"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="h-3 bg-ink-100 rounded w-20 mb-3" />
                  <div className="h-7 bg-ink-100 rounded w-14 mb-1" />
                  <div className="h-2 bg-ink-100 rounded w-24" />
                </div>
              ))}
            </div>
          )}

          {/* Stat Cards */}
          {!loading && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-6">
                {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
                  <div key={label} className="card p-4 md:p-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs md:text-sm font-medium text-ink-500">{label}</p>
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${bg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 md:w-5 md:h-5 ${color}`} />
                      </div>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-ink-900 mb-0.5">{value}</p>
                    <p className="text-xs text-ink-400 hidden md:block">{sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
                {/* Revenue Chart */}
                <div className="card p-4 md:p-6 xl:col-span-2">
                  <h2 className="font-semibold text-ink-900 mb-4 text-sm md:text-base">
                    Revenue — Last 7 Days
                  </h2>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeece6" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7a6f5e' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#7a6f5e' }} tickFormatter={v => `₹${v}`} />
                        <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} />
                        <Area
                          type="monotone"
                          dataKey="Revenue"
                          stroke="#f97316"
                          strokeWidth={2}
                          fill="url(#colorRevenue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[180px] flex items-center justify-center text-ink-400 text-sm">
                      No revenue data yet
                    </div>
                  )}
                </div>

                {/* Recent Orders */}
                <div className="card p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-ink-900 text-sm md:text-base">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-xs text-brand-600 font-medium">
                      View all →
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {recentOrders.length === 0 ? (
                      <p className="text-ink-400 text-sm text-center py-6">No orders yet</p>
                    ) : recentOrders.map((order) => (
                      <Link
                        key={order._id}
                        href={`/admin/orders/${order._id}`}
                        className="flex items-center justify-between hover:bg-ink-50 p-2 rounded-lg transition-colors"
                      >
                        <div>
                          <p className="font-medium text-ink-900 text-xs md:text-sm">{order.orderNumber}</p>
                          <p className="text-xs text-ink-500">{order.user?.name || 'Guest'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-xs md:text-sm text-ink-900">
                            {formatPrice(order.total)}
                          </p>
                          <span className={`badge text-xs ${ORDER_STATUS_COLORS[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
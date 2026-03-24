'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, Menu, X, User, Package, LogOut, Settings, ChevronDown } from 'lucide-react'
import useCartStore from '@/lib/cartStore'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/products?category=business-cards', label: 'Business Cards' },
  { href: '/products?category=banners', label: 'Banners' },
  { href: '/products?category=flyers', label: 'Flyers' },
]

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const items = useCartStore((s) => s.items)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-ink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">P</span>
            </div>
            <span className="font-display font-bold text-xl text-ink-900">PrintCraft</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-600 hover:text-brand-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-ink-100 transition-colors">
              <ShoppingCart className="w-5 h-5 text-ink-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-brand-700 text-xs font-bold">
                      {session.user.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-ink-700">
                    {session.user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-ink-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-ink-100 py-1 z-50">
                    <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50" onClick={() => setUserMenuOpen(false)}>
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50" onClick={() => setUserMenuOpen(false)}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    {session.user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-brand-600 hover:bg-brand-50 font-medium" onClick={() => setUserMenuOpen(false)}>
                        <Settings className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-ink-100" />
                    <button
                      onClick={() => { signOut({ callbackUrl: '/' }); setUserMenuOpen(false) }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login" className="text-sm font-medium text-ink-600 hover:text-ink-900 px-3 py-2">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary !py-2 !px-4 text-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-ink-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-ink-100 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-ink-700 font-medium hover:text-brand-600"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!session && (
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/auth/login" className="btn-outline text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link href="/auth/register" className="btn-primary text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

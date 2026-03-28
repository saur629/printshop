'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid, ShoppingCart, Package, User } from 'lucide-react'
import useCartStore from '@/lib/cartStore'

const navItems = [
  { href: '/',         label: 'Home',     icon: Home },
  { href: '/products', label: 'Products', icon: Grid },
  { href: '/cart',     label: 'Cart',     icon: ShoppingCart },
  { href: '/orders',   label: 'Orders',   icon: Package },
  { href: '/profile',  label: 'Profile',  icon: User },
]

export default function MobileNav() {
  const pathname = usePathname()
  const items = useCartStore((s) => s.items)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-ink-100 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          const isCart = href === '/cart'
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors relative ${
                isActive
                  ? 'text-brand-500'
                  : 'text-ink-400 hover:text-ink-700'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {isCart && itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-brand-500' : ''}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
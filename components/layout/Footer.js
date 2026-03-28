import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">P</span>
              </div>
              <span className="font-display font-bold text-xl text-white">PrintCraft</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Premium printing services with fast turnaround times. Quality you can see, service you can count on.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-ink-800 hover:bg-brand-500 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              {['Business Cards', 'Flyers', 'Banners', 'Brochures', 'Posters', 'Stickers'].map((item) => (
                <li key={item}>
                  <Link href={`/products?category=${item.toLowerCase().replace(' ', '-')}`} className="hover:text-brand-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

  
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Track Order', href: '/track' },
                { label: 'My Orders', href: '/orders' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-brand-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-400 shrink-0" />
                <span>R Digital printing</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="tel:+15551234567" className="hover:text-brand-400 transition-colors">9453566950</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="mailto:hello@printcraft.com" className="hover:text-brand-400 transition-colors">info@rdigitalstudio.com</a>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-ink-800 rounded-lg text-xs">
              <p className="font-semibold text-white mb-1">Business Hours</p>
              <p>Mon–Fri: 8am – 6pm</p>
              <p>Sat: 9am – 4pm</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-ink-500">
          <p>© {new Date().getFullYear()} PrintCraft. All rights reserved.</p>
          <p>Made with ❤️ for quality printing</p>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import { ArrowRight, Star, Truck, Shield, Clock, Zap } from 'lucide-react'
import { PRODUCT_CATEGORIES } from '@/lib/utils'

const features = [
  { icon: Zap, title: 'Fast Turnaround', desc: 'Same-day, rush, and standard options available' },
  { icon: Shield, title: 'Quality Guaranteed', desc: '100% satisfaction or we reprint for free' },
  { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $100' },
  { icon: Star, title: 'Premium Materials', desc: 'Thick stocks, vibrant inks, lasting finishes' },
]

const testimonials = [
  { name: 'Sarah M.', company: 'Bloom Studio', text: 'The business cards came out absolutely stunning. Sharp colors, premium feel. Will order again!', rating: 5 },
  { name: 'James T.', company: 'Urban Eats', text: 'Ordered 500 flyers on Wednesday, had them Friday. Incredible service and the quality was top notch.', rating: 5 },
  { name: 'Priya K.', company: 'Momentum Events', text: 'Our trade show banners looked incredible. The team was helpful with our design questions too.', rating: 5 },
]

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ea580c 0%, transparent 40%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 rounded-full px-4 py-1.5 text-brand-300 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" /> Same-day printing available
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Print That Makes an <span className="text-brand-400">Impression</span>
            </h1>
            <p className="text-ink-300 text-xl leading-relaxed mb-10 max-w-2xl">
              Premium business cards, banners, flyers, and more. Upload your design, choose your options, and we'll deliver quality prints to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary text-base flex items-center gap-2">
                Shop Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/track" className="btn-outline border-white text-white hover:bg-white hover:text-ink-900 text-base">
                Track Your Order
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-ink-400">
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.9/5 from 2,400+ reviews</span>
              <span>✓ 48-hour standard delivery</span>
              <span>✓ Free design templates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-brand-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 text-white py-2">
                <Icon className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-brand-100 text-xs hidden md:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="section-title">Our Products</h2>
          <p className="section-subtitle mx-auto">Everything you need to promote your brand, printed to perfection</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/products?category=${cat.value}`}
              className="card p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group text-center"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-ink-900 group-hover:text-brand-600 transition-colors">{cat.label}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-ink-50 border-y border-ink-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle mx-auto">From order to delivery in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose & Customize', desc: 'Pick your product, select size, paper, finish, and quantity. Get an instant price quote.' },
              { step: '02', title: 'Upload Your Design', desc: 'Upload your print-ready files or use one of our free templates. We review every file.' },
              { step: '03', title: 'We Print & Ship', desc: 'Your order goes into production and ships to your door. Track every step in real time.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-white font-bold text-xl">{item.step}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-ink-900 mb-2">{item.title}</h3>
                <p className="text-ink-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-ink-600 leading-relaxed mb-4 italic">"{t.text}"</p>
              <div>
                <p className="font-semibold text-ink-900">{t.name}</p>
                <p className="text-sm text-ink-500">{t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Ready to Print?</h2>
          <p className="text-ink-400 text-lg mb-8">Get started in minutes. Upload your design, get an instant quote, and we'll handle the rest.</p>
          <Link href="/products" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            Browse All Products <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}

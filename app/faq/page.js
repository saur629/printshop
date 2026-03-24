'use client'
import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    category: 'Ordering',
    items: [
      { q: 'How do I place an order?', a: 'Browse our products, select your size, paper, finish, and quantity. Upload your design file and add to cart. Complete your order with secure Stripe payment.' },
      { q: 'What file formats do you accept?', a: 'We accept PDF (preferred), AI, EPS, JPG, and PNG files up to 50MB. For best results, submit print-ready PDFs with 300 DPI resolution and 0.125" bleed.' },
      { q: 'Can I order without creating an account?', a: 'Yes! You can checkout as a guest. However, creating an account lets you track all your orders in one place and saves your shipping details.' },
      { q: 'What is the minimum order quantity?', a: 'Minimums vary by product. Business cards start at 100, flyers at 100, banners at 1. Check each product page for its specific minimum.' },
    ]
  },
  {
    category: 'Design & Files',
    items: [
      { q: 'Do you offer design services?', a: 'We focus on printing, but we have free downloadable templates for all our products. We recommend using Canva, Adobe Illustrator, or hiring a freelance designer for custom work.' },
      { q: 'What resolution should my file be?', a: 'All files should be at least 300 DPI at final print size. Lower resolution images will print blurry. Vector files (PDF, AI, EPS) are always preferred.' },
      { q: 'Should I include bleed in my design?', a: 'Yes! Include 0.125" (3mm) bleed on all sides beyond the trim line. This prevents white edges if the cut shifts slightly. Keep important content 0.125" inside the trim line.' },
      { q: 'Can I see a proof before printing?', a: 'We send a digital proof via email within 1 business day for orders over $100. You must approve the proof before we start printing.' },
    ]
  },
  {
    category: 'Turnaround & Shipping',
    items: [
      { q: 'How fast can you print my order?', a: 'Standard turnaround is 5–7 business days. Rush orders take 2–3 days. Same-day printing is available for select products if ordered before 10 AM local time.' },
      { q: 'Do you offer free shipping?', a: 'Yes! All orders over $100 ship free via ground shipping. Orders under $100 ship for a flat $9.99 fee.' },
      { q: 'Can I track my order?', a: 'Absolutely. Once your order ships, you\'ll receive an email with your tracking number. You can also track any order at printcraft.com/track using your order number.' },
      { q: 'Do you ship internationally?', a: 'Currently we ship to the US, Canada, and the United Kingdom. International shipping rates and times vary by destination.' },
    ]
  },
  {
    category: 'Quality & Returns',
    items: [
      { q: 'What if I\'m not happy with my order?', a: 'We stand behind our work 100%. If your order has a print defect, color issue, or production error, contact us within 7 days and we\'ll reprint or refund your order — no hassle.' },
      { q: 'What if I uploaded the wrong file?', a: 'We can only reprint for production errors on our end. If you uploaded the wrong file, we\'re unable to offer a free reprint, but contact us quickly and we\'ll try to catch it before production starts.' },
      { q: 'How do I report a problem with my order?', a: 'Email us at hello@printcraft.com with your order number and photos of the issue. Our team responds within 1 business day.' },
    ]
  },
  {
    category: 'Payment',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex, Discover) as well as Apple Pay and Google Pay through Stripe.' },
      { q: 'Is my payment information secure?', a: 'Yes. All payments are processed by Stripe, a PCI-compliant payment processor. We never store your card details on our servers.' },
      { q: 'Can I get a receipt or invoice?', a: 'Yes, a receipt is automatically emailed after payment. You can also view and download invoices from your order detail page in your account.' },
    ]
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-ink-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="font-medium text-ink-900">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-brand-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-ink-400 shrink-0" />}
      </button>
      {open && <p className="pb-4 text-ink-600 leading-relaxed text-sm">{a}</p>}
    </div>
  )
}

export default function FAQPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="section-title mb-3">Frequently Asked Questions</h1>
          <p className="section-subtitle mx-auto">Everything you need to know about PrintCraft</p>
        </div>

        <div className="space-y-8">
          {faqs.map(section => (
            <div key={section.category} className="card p-6">
              <h2 className="font-display text-xl font-bold text-ink-900 mb-4 pb-3 border-b border-ink-100">
                {section.category}
              </h2>
              <div>
                {section.items.map(item => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 card p-8 text-center bg-ink-900 text-white">
          <h2 className="font-display text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-ink-400 mb-6">Our team is ready to help. Reach out anytime.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="mailto:hello@printcraft.com" className="btn-primary">Email Us</a>
            <Link href="/track" className="btn-outline border-white text-white hover:bg-white hover:text-ink-900">Track Order</Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

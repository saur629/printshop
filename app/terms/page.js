import MainLayout from '@/components/layout/MainLayout'

export const metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="section-title mb-3">Terms of Service</h1>
        <p className="text-ink-500 mb-10">Last updated: January 1, 2025</p>

        <div className="space-y-8">
          {[
            {
              title: '1. Acceptance of Terms',
              body: 'By placing an order with PrintCraft, you agree to these Terms of Service. If you do not agree with any part of these terms, please do not use our services.'
            },
            {
              title: '2. Ordering & Pricing',
              body: 'All prices are in USD and subject to change without notice. An order is confirmed only after successful payment. We reserve the right to cancel any order at our discretion and issue a full refund. Quantity price tiers are applied automatically based on your selected quantity.'
            },
            {
              title: '3. File & Design Responsibility',
              body: 'You are responsible for submitting print-ready files. PrintCraft is not responsible for errors in your submitted designs including typos, incorrect colors, low resolution, or missing bleed. We will print exactly what you submit. Review your files carefully before ordering.'
            },
            {
              title: '4. Intellectual Property',
              body: 'By submitting design files, you confirm that you own or have the rights to all content in those files, including images, logos, and text. You agree to indemnify PrintCraft against any claims arising from intellectual property violations in your submitted files.'
            },
            {
              title: '5. Production & Delivery',
              body: 'Turnaround times begin after file approval (or immediately if no proof is required). Delivery estimates are not guaranteed. PrintCraft is not responsible for delays caused by shipping carriers, weather, or other events beyond our control.'
            },
            {
              title: '6. Satisfaction Guarantee & Returns',
              body: 'We guarantee our workmanship. If your order has a production defect (printing error, wrong product, damage during production), we will reprint or refund your order. Claims must be submitted within 7 days of delivery with photo evidence. We cannot accept returns for customer design errors.'
            },
            {
              title: '7. Limitation of Liability',
              body: 'PrintCraft\'s liability is limited to the amount paid for the specific order in question. We are not liable for indirect, incidental, or consequential damages, including lost profits or business opportunities arising from delays or defects.'
            },
            {
              title: '8. Contact',
              body: 'For questions regarding these Terms, contact us at legal@printcraft.com.'
            },
          ].map(section => (
            <div key={section.title}>
              <h2 className="font-display text-xl font-bold text-ink-900 mb-3">{section.title}</h2>
              <p className="text-ink-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

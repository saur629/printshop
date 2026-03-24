import MainLayout from '@/components/layout/MainLayout'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="section-title mb-3">Privacy Policy</h1>
        <p className="text-ink-500 mb-10">Last updated: January 1, 2025</p>

        <div className="prose max-w-none space-y-8">
          {[
            {
              title: '1. Information We Collect',
              body: 'We collect information you provide directly to us, such as your name, email address, phone number, shipping address, and payment information when you create an account or place an order. We also collect information automatically when you use our services, including log data, device information, and cookies.'
            },
            {
              title: '2. How We Use Your Information',
              body: 'We use the information we collect to process and fulfill your orders, send transactional emails and order updates, provide customer support, improve our products and services, and comply with legal obligations. We do not sell your personal information to third parties.'
            },
            {
              title: '3. Payment Information',
              body: 'All payment processing is handled by Stripe, a PCI-compliant payment processor. We do not store your full credit card number, CVV, or other sensitive payment details on our servers. Please review Stripe\'s privacy policy at stripe.com/privacy for more information.'
            },
            {
              title: '4. File Uploads',
              body: 'Design files you upload are stored securely and used only to fulfill your print order. Files are automatically deleted 90 days after your order is delivered. We do not use your design files for any other purpose.'
            },
            {
              title: '5. Cookies',
              body: 'We use cookies to maintain your session, remember your cart, and improve your experience. You can disable cookies in your browser settings, though some features may not function properly.'
            },
            {
              title: '6. Data Sharing',
              body: 'We share your information only with trusted service providers who assist us in operating our business (shipping carriers, payment processors, email providers). All third parties are bound by confidentiality agreements and may not use your information for their own purposes.'
            },
            {
              title: '7. Your Rights',
              body: 'You have the right to access, update, or delete your personal information at any time. You can manage your account information from your profile page. To request data deletion, email us at privacy@printcraft.com.'
            },
            {
              title: '8. Contact Us',
              body: 'If you have any questions about this Privacy Policy, please contact us at privacy@printcraft.com or write to us at 123 Print Street, Design City, DC 10001.'
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

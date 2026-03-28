import { Playfair_Display, DM_Sans } from 'next/font/google'
import SessionProvider from '@/components/layout/SessionProvider'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  title: { default: 'PrintCraft — Premium Printing Services', template: '%s | PrintCraft' },
  description: 'High-quality custom printing for business cards, flyers, banners, and more.',
  keywords: ['printing', 'business cards', 'banners', 'flyers', 'custom printing'],
  manifest: '/manifest.json',
  themeColor: '#f97316',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PrintCraft',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body bg-ink-50 text-ink-900 antialiased">
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#1a1714', color: '#f8f7f4', borderRadius: '8px' },
              success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
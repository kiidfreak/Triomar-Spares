import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/components/cart/cart-context'
import { AuthProvider } from '@/components/auth/auth-context'
import { CartDrawer } from '@/components/cart/cart-drawer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Triomah Spares Ltd - Quality Car Spare Parts in Manchester',
  description: 'Specialist car spare parts for Mazda CX-5, Nissan X-Trail T30, and Toyota Prado. Located in Manchester, UK. Fast delivery and expert support.',
  keywords: 'car spare parts, Mazda CX-5, Nissan X-Trail T30, Toyota Prado, Manchester, UK, auto parts, car parts',
  authors: [{ name: 'Triomah Spares Ltd' }],
  creator: 'Triomah Spares Ltd',
  publisher: 'Triomah Spares Ltd',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/apple-touch-icon.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://triomahspares.co.uk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Triomah Spares Ltd - Quality Car Spare Parts in Manchester',
    description: 'Specialist car spare parts for Mazda CX-5, Nissan X-Trail T30, and Toyota Prado. Located in Manchester, UK.',
    url: 'https://triomahspares.co.uk',
    siteName: 'Triomah Spares Ltd',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Triomah Spares Ltd - Car Spare Parts Store',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Triomah Spares Ltd - Quality Car Spare Parts in Manchester',
    description: 'Specialist car spare parts for Mazda CX-5, Nissan X-Trail T30, and Toyota Prado. Located in Manchester, UK.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <Providers>
          <AuthProvider>
            <CartProvider>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <CartDrawer />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}

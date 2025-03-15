import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { siteConfig } from '@/config/site'
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { Providers } from '@/app/providers'
import GoogleTag from '@/components/google-tag'
import StarryBackground from '@/components/starry-background'

export const metadata = {
  title: siteConfig.name,
  description: 'Predict market movements and win rewards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-[100dvh] bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Providers>
          <StarryBackground />
          {children}
          <GoogleTag />
        </Providers>
      </body>
    </html>
  )
}
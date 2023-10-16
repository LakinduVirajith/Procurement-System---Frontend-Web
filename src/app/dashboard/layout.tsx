import SideNav from '@/components/sideNav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'System Dashboard'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="page-style flex-row p-0">
        <SideNav />
        <div className='w-full h-screen'>
            {children}
        </div>
      </body>
    </html>
  )
}

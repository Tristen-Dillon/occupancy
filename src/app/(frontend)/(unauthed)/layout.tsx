import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { OccupancyProvider } from '@/providers/occupancy-provider'
import { SidebarProvider } from '@/components/ui/sidebar'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

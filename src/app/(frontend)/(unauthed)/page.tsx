import { AddressSidebar } from '@/components/address-sidebar'
import GoogleMapComponent from '@/components/map'
import { SidebarProvider } from '@/components/ui/sidebar'
import { MapProvider } from '@/providers/map-provider'
import { MarkersProvider } from '@/providers/markers-provider'
import { OccupancyProvider } from '@/providers/occupancy-provider'
import React from 'react'

export default async function Home() {
  return (
    <MapProvider>
      <OccupancyProvider>
        <SidebarProvider>
          <MarkersProvider>
            <AddressSidebar />
            <GoogleMapComponent />
          </MarkersProvider>
        </SidebarProvider>
      </OccupancyProvider>
    </MapProvider>
  )
}

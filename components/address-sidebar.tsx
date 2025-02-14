'use client'

import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { StreetView } from './street-view'
import { AddressDetails } from './address-details'
import { useAddress } from '@/providers/address-provider'
import { Button } from './ui/button'
import { X } from 'lucide-react'
export function AddressSidebar() {
  const { selectedAddress, setSelectedAddress } = useAddress()
  if (!selectedAddress) return null
  const location = new google.maps.LatLng(
    selectedAddress.latitude ?? selectedAddress.validated.result.geocode.location.latitude,
    selectedAddress.longitude ?? selectedAddress.validated.result.geocode.location.longitude
  )
  return (
    <div
      className="absolute top-0 left-0"
      style={{
        width: '600px',
      }}
    >
      <Sidebar className="w-[600px]">
        <SidebarHeader className="p-0 w-full">
          <StreetView location={location}
          />
        </SidebarHeader>
        <SidebarContent className="w-full">
          <AddressDetails address={selectedAddress} />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-0 right-0"
            onClick={() => setSelectedAddress(null)}
          >
            <X />
          </Button>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}

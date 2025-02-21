'use client'

import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { StreetView } from './street-view'
import { AddressDetails } from './address-details'
import { useOccupancy } from '@/providers/occupancy-provider'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import type { ValidatedOccupancy } from '@/lib/types'
import { useEffect, useState } from 'react'
export function AddressSidebar() {
  const { selectedOccupancy, setSelectedOccupancy } = useOccupancy()

  const [occupancy, setOccupancy] = useState<ValidatedOccupancy | null>(null)

  useEffect(() => {
    if (!selectedOccupancy) return

    const fetchOccupancy = async () => {
      const res = await fetch(`/api/occupancy/${selectedOccupancy}`)
      const data = await res.json()
      setOccupancy(data)
    }

    fetchOccupancy()
  }, [selectedOccupancy])

  if (!selectedOccupancy || !occupancy) return null

  const location = new google.maps.LatLng(
    occupancy.location?.lat ?? occupancy.validated.result.geocode.location.latitude,
    occupancy.location?.lng ?? occupancy.validated.result.geocode.location.longitude,
  )
  return (
    <div
      className="absolute top-0 left-0 bg-background"
      style={{
        width: '600px',
      }}
    >
      <Sidebar className="w-[600px] bg-background">
        <SidebarHeader className="p-0 w-full">
          <StreetView location={location} />
        </SidebarHeader>
        <SidebarContent className="w-full">
          <AddressDetails address={occupancy} />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-0 right-0"
            onClick={() => {
              console.log('CLICK')
              setSelectedOccupancy(null)
            }}
          >
            <X />
          </Button>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}

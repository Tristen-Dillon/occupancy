'use client'

import { toast } from 'sonner'
import { Button } from './ui/button'
import { saveValidatedAddressesToExcel } from '@/lib/save-to-excel'

export default function SaveToExcelButton() {
  const fetchAllOccupancies = async () => {
    const response = await fetch('/api/occupancy?limit=10000')
    if (!response.ok) {
      toast.error('Error fetching occupancies')
      return
    }
    const data = await response.json()
    // Transform data for Excel export
    const formattedData = data.docs.map((item: any) => {
      const fmpMarker = item.markers.docs.find((marker: any) => marker.dataset === 'fmp')
      const googleMarker = item.markers.docs.find((marker: any) => marker.dataset === 'google')
      return {
        Address: item.address,
        ValidatedAddress: item.validated.result.address.formattedAddress,
        Name: item.name,
        Lat: fmpMarker.location.lat,
        Lng: fmpMarker.location.lng,
        GoogleLat: googleMarker.location.lat,
        GoogleLng: googleMarker.location.lng,
        Markers: JSON.stringify(item.markers.docs), // Store markers array as JSON text
        OccupancyID: item.occupancyId,
        OccupancyPK: item.occupancyPk,
        Validated: JSON.stringify(item.validated), // Store validated field as JSON text
      }
    })

    // Export to Excel
    saveValidatedAddressesToExcel(formattedData)
  }

  return <Button onClick={fetchAllOccupancies}>Save to Excel</Button>
}

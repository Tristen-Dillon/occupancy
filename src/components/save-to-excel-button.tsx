'use client'

import { Button } from './ui/button'
import { saveValidatedAddressesToExcel } from '@/lib/save-to-excel'
import { useOccupancy } from '@/providers/occupancy-provider'

export default function SaveToExcelButton() {
  const { occupancies } = useOccupancy()
  const saveOccupanciesToExcel = async () => {
    // Transform data for Excel export
    const formattedData = occupancies.map((item) => {
      const fmpMarker = item.markers?.docs?.find((marker: any) => marker.dataset === 'fmp')
      const googleMarker = item.markers?.docs?.find((marker: any) => marker.dataset === 'google')
      return {
        Address: item.address,
        ValidatedAddress: (item.validated as any).result?.address?.formattedAddress,
        Name: item.name,
        Lat: (fmpMarker as any)?.location?.lat,
        Lng: (fmpMarker as any)?.location?.lng,
        GoogleLat: (googleMarker as any)?.location?.lat,
        GoogleLng: (googleMarker as any)?.location?.lng,
        Markers: JSON.stringify(item.markers?.docs), // Store markers array as JSON text
        OccupancyID: item.occupancyId,
        OccupancyPK: item.occupancyPk,
        Validated: JSON.stringify(item.validated), // Store validated field as JSON text
      }
    })

    // Export to Excel
    saveValidatedAddressesToExcel(formattedData)
  }

  return <Button onClick={saveOccupanciesToExcel}>Save to Excel</Button>
}

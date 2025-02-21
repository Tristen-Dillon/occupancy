'use client'

import React from 'react'
import { useMarkers } from '@/providers/markers-provider'
import CustomMarker from './custom-marker'
import type { Occupancy } from '@/payload-types'

export default function Markers() {
  const { markers } = useMarkers()

  return (
    <div>
      {markers.map((marker) => (
        <CustomMarker
          marker={marker}
          key={marker.id}
          id={(marker.occupancy as unknown as Occupancy[])[0].id}
          location={new google.maps.LatLng(marker.location!.lat!, marker.location!.lng!)}
          dataset={marker.dataset}
        />
      ))}
    </div>
  )
}

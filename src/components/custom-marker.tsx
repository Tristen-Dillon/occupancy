'use client'

import { useMap } from '@/providers/map-provider'
import { useOccupancy } from '@/providers/occupancy-provider'
import { Marker } from '@react-google-maps/api'
import React from 'react'
import type { Marker as PayloadMarker } from '@/payload-types'
import { useMarkers } from '@/providers/markers-provider'
import { toast } from 'sonner'

interface CustomMarkerProps {
  marker: PayloadMarker
  id: number
  location: google.maps.LatLng
  dataset: 'fmp' | 'google'
}
export default function CustomMarker({ marker, id, location, dataset }: CustomMarkerProps) {
  const { setSelectedOccupancy } = useOccupancy()
  const { bounds } = useMarkers()
  const { zoom } = useMap()
  const onClick = () => {
    setSelectedOccupancy(id)
  }

  const onDragEnd = async (e: google.maps.MapMouseEvent) => {
    const newLocation = { lat: e.latLng!.lat(), lng: e.latLng!.lng() }
    const res = await fetch(`/api/markers/${marker.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...marker,
        location: newLocation,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    if (res.ok) {
      toast.success('Marker updated')
    } else {
      toast.error('Error updating marker')
    }
    console.log(data)
  }

  const isInBounds = bounds?.contains(location)

  if (!isInBounds) return null

  const color = dataset === 'fmp' ? 'blue' : 'red'
  return (
    <Marker
      icon={`/icons/${color}.svg`}
      onClick={onClick}
      position={location}
      draggable={dataset === 'fmp' && zoom > 18}
      onDragEnd={onDragEnd}
    ></Marker>
  )
}

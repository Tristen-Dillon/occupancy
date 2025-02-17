import type { ValidatedAddress } from '@/lib/types'
import { useAddress } from '@/providers/address-provider'
import { Marker } from '@react-google-maps/api'
import React, { useEffect, useState } from 'react'
import { useMap } from '@/providers/map-provider'

export default function Markers({
  color = 'blue',
  dataset = 'fmp',
}: {
  color?: 'blue' | 'red'
  dataset?: 'fmp' | 'google'
}) {
  const { addresses, setSelectedAddress, editAddresses } = useAddress()
  const { map } = useMap()
  const [zoom, setZoom] = useState(0)
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null)
  const onClick = (address: ValidatedAddress) => {
    setSelectedAddress(address)
  }

  const onDragEnd = (
    e: google.maps.MapMouseEvent,
    address: ValidatedAddress
  ) => {
    if (e.latLng) {
      // Here you could update the address coordinates if needed
      address.latitude = e.latLng.lat()
      address.longitude = e.latLng.lng()
      editAddresses(address)
    }
  }

  useEffect(() => {
    const zoom_changed = () => {
      const zoom = map?.getZoom();
      setZoom(zoom ?? 0)
    }

    const bounds_changed = () => {
      const bounds = map?.getBounds()
      setBounds(bounds ?? null)
    }

    setTimeout(() => {
      zoom_changed()
      bounds_changed()
    }, 1000)
    map?.addListener('zoom_changed', zoom_changed)
    map?.addListener('bounds_changed', bounds_changed)
  }, [map])

  let filteredAddresses: ValidatedAddress[] = []
  if (dataset === 'fmp') {
    filteredAddresses = addresses.filter((address) => {
      return (
        (bounds?.contains(
          new google.maps.LatLng(address.latitude ?? 0, address.longitude ?? 0)
        ) &&
          address.latitude &&
          address.longitude) ??
        false
      )
    })
  } else {
    filteredAddresses = addresses.filter((address) => {
      return (
        bounds?.contains(
          new google.maps.LatLng(
            address.validated.result.geocode.location.latitude,
            address.validated.result.geocode.location.longitude
          )
        ) ?? false
      )
    })
  }

  return (
    <div>
      {filteredAddresses.map((address) => (
        <Marker
          icon={`/icons/${color}.svg`}
          onClick={() => onClick(address)}
          key={
            address.full_address +
            address.latitude +
            address.longitude +
            address.pk_occupancy
          }
          position={
            dataset === 'fmp'
              ? new google.maps.LatLng(
                  address.latitude ?? 0,
                  address.longitude ?? 0
                )
              : new google.maps.LatLng(
                  address.validated.result.geocode.location.latitude,
                  address.validated.result.geocode.location.longitude
                )
          }
          draggable={dataset === 'fmp' && zoom > 18}
          onDragEnd={(e) => onDragEnd(e, address)}
        ></Marker>
      ))}
    </div>
  )
}

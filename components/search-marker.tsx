import type { ValidatedAddress } from '@/lib/types'
import { useAddress } from '@/providers/address-provider'
import { useMap } from '@/providers/map-provider'
import React, { useState, type CSSProperties } from 'react'

const inputStyle: CSSProperties = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
  position: 'absolute',
}

export default function SearchMarker({
  className,
  dataset,
}: {
  className?: string
  dataset?: 'fmp' | 'google'
}) {
  const { map } = useMap()
  const { addresses } = useAddress()
  const [filteredAddresses, setFilteredAddresses] = useState<
    ValidatedAddress[]
  >([])

  return (
    <div
      className={className}
      onBlur={() => {
        setTimeout(() => {
          setFilteredAddresses([])
        }, 100)
      }}
    >
      <input
        type="text"
        className="mb-10"
        onChange={(e) => {
          setFilteredAddresses(
            addresses.filter(
              (address) =>
                address.full_address
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase()) ||
                address.name
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase())
            )
          )
        }}
        placeholder={`Find ${dataset} markers...`}
        style={inputStyle}
      />
      <div className="mt-10">
        {filteredAddresses.slice(0, 5).map((address) => (
          <div
            onClick={() => {
              console.log(address)
              map?.setCenter(
                dataset === 'fmp'
                  ? new google.maps.LatLng(
                      address.latitude ?? 0,
                      address.longitude ?? 0
                    )
                  : new google.maps.LatLng(
                      address.validated.result.geocode.location.latitude,
                      address.validated.result.geocode.location.longitude
                    )
              )
              map?.setZoom(21)
            }}
            key={address.pk_occupancy + address.name}
            className="bg-white p-3 rounded-md shadow-sm hover:bg-gray-50 cursor-pointer z-10"
            style={{
              border: '1px solid #e5e7eb',
            }}
          >
            <p className="font-medium text-gray-900">{address.name}</p>
            <p className="text-sm text-gray-600">{address.full_address}</p>
            <p className="text-xs text-gray-400">{address.pk_occupancy}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

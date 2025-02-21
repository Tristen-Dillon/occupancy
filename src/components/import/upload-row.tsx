import type { Occupancy } from '@/payload-types'
import React from 'react'

interface UploadRowProps {
  occupancy: Occupancy
}

export default function UploadRow({ occupancy }: UploadRowProps) {
  const fmpLocation = occupancy.location
  const validated = occupancy.validated as any
  const googleLocation = validated.result.geocode.location

  return (
    <tr className="border-b">
      <td className="p-4 max-w-[100px] truncate">{occupancy.occupancyId}</td>
      <td className="p-4 max-w-[100px] truncate">{occupancy.name}</td>
      <td className="p-4 max-w-[100px] truncate">{occupancy.address}</td>
      <td className="p-4">
        {fmpLocation?.lat && fmpLocation?.lng && (
          <span className="inline-flex gap-2">
            {fmpLocation.lat}, {fmpLocation.lng}
          </span>
        )}
      </td>
      <td className="p-4">
        {googleLocation?.latitude && googleLocation?.longitude && (
          <span className="inline-flex gap-2 ml-2">
            {googleLocation.latitude}, {googleLocation.longitude}
          </span>
        )}
      </td>
    </tr>
  )
}

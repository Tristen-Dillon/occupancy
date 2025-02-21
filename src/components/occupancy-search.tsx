'use client'

import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from './ui/input'
import { useOccupancy } from '@/providers/occupancy-provider'
import type { Occupancy, Marker as PayloadMarker } from '@/payload-types'
import { useMap } from '@/providers/map-provider'

const datasets = ['fmp', 'google']
type Datasets = (typeof datasets)[number]

export default function OccupancySearch() {
  const { occupancies, loading } = useOccupancy()
  const { map } = useMap()
  const [selectedDataSet, setSelectedDataSet] = useState<Datasets>('fmp')
  const [filteredOccupancies, setFilteredOccupancies] = useState<Occupancy[]>([])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.toLowerCase()
    const filtered = occupancies.filter(
      (occupancy) =>
        occupancy.address?.toLowerCase().includes(value) ||
        occupancy.name?.toLowerCase().includes(value),
    )
    setFilteredOccupancies(filtered)
  }

  const onClick = (occupancy: Occupancy) => {
    setFilteredOccupancies([])
    if (selectedDataSet === 'fmp') {
      const fmpMarker = occupancy.markers?.docs?.find(
        (marker) => (marker as PayloadMarker).dataset === 'fmp',
      )
      if (fmpMarker) {
        const { location } = fmpMarker as PayloadMarker

        if (!location || !location.lat || !location.lng) return
        map?.setCenter({ lat: location.lat, lng: location.lng })
      }
    } else {
      const googleMarker = occupancy.markers?.docs?.find(
        (marker) => (marker as PayloadMarker).dataset === 'google',
      )
      if (googleMarker) {
        const { location } = googleMarker as PayloadMarker

        if (!location || !location.lat || !location.lng) return
        map?.setCenter({ lat: location.lat, lng: location.lng })
      }
      map?.setZoom(20)
    }
  }

  return (
    <div className="flex gap-4">
      <Select
        value={selectedDataSet}
        onValueChange={(value) => setSelectedDataSet(value as Datasets)}
      >
        <SelectTrigger className="w-[180px] bg-background uppercase">
          <SelectValue placeholder="Select Dataset" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          {datasets.map((dataset) => (
            <SelectItem className="uppercase" key={dataset} value={dataset}>
              {dataset}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-col gap-4 w-[400px]">
        <Input
          disabled={loading}
          onBlur={() => {
            setTimeout(() => setFilteredOccupancies([]), 100)
          }}
          onChange={handleSearch}
          className="bg-background w-full"
          placeholder="Enter Address"
        />
        {filteredOccupancies.length > 0 && (
          <div className="flex flex-col gap-2">
            {filteredOccupancies
              .sort((a, b) => a.address?.localeCompare(b.address || '') || 0)
              .slice(0, 5)
              .map((occupancy) => (
                <div
                  onClick={() => onClick(occupancy)}
                  key={occupancy.id}
                  className="bg-background p-2 rounded-md hover:bg-secondary cursor-pointer"
                >
                  <div className="font-medium">{occupancy.address}</div>
                  {occupancy.name && (
                    <div className="text-sm text-muted-foreground">{occupancy.name}</div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

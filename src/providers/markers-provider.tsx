'use client'

import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useMap } from './map-provider'
import type { Marker } from '@/payload-types'
import { debounce } from 'lodash'
type MarkerContextType = {
  bounds: google.maps.LatLngBounds | null
  markers: Marker[]
  setMarkers: (markers: Marker[]) => void
  distanceMargin: number
  setDistanceMargin: (distanceMargin: number) => void
}

const MarkerContext = createContext<MarkerContextType | undefined>(undefined)

export function MarkersProvider({ children }: { children: React.ReactNode }) {
  const [markers, setMarkers] = useState<Marker[]>([])
  const [distanceMargin, setDistanceMargin] = useState(10)
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null)
  const { map } = useMap()

  const boundsChanged = useMemo(
    () =>
      debounce(async () => {
        if (!map) return
        const bounds = map.getBounds()
        setBounds(bounds ?? null)
      }, 500),
    [map],
  )

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchMarkers = async (page: number = 1): Promise<Marker[]> => {
      try {
        const NE = bounds?.getNorthEast()
        const SW = bounds?.getSouthWest()
        if (!NE || !SW) return []
        const res = await fetch(
          `/api/markers/get-markers-in-bounds?ne_lat=${NE.lat()}&ne_lng=${NE.lng()}&sw_lat=${SW.lat()}&sw_lng=${SW.lng()}&distance=${distanceMargin}&page=${page}`,
          { signal },
        )

        if (!res.ok) throw new Error('Failed to fetch markers')

        const data = await res.json()

        if (data.nextPage) {
          return [...data.docs, ...(await fetchMarkers(data.nextPage))]
        } else {
          return data.docs
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.error('Error fetching markers:', err)
        }
        return []
      }
    }

    const getMarkers = async () => {
      const markers = await fetchMarkers()
      setMarkers(markers)
    }

    if (
      distanceMargin === 0 ||
      !bounds ||
      bounds.getNorthEast().lat() === 0 ||
      bounds.getNorthEast().lng() === 0 ||
      bounds.getSouthWest().lat() === 0 ||
      bounds.getSouthWest().lng() === 0
    ) {
      return
    }

    getMarkers()

    return () => {
      controller.abort() // No try-catch needed
    }
  }, [bounds, distanceMargin])

  useEffect(() => {
    map?.addListener('bounds_changed', boundsChanged)
    return () => {
      boundsChanged.cancel()
    }
  }, [boundsChanged, map])

  const memoizedValue = useMemo(
    () => ({
      markers,
      setMarkers,
      distanceMargin,
      setDistanceMargin,
      bounds,
    }),
    [markers, distanceMargin, bounds],
  )

  return <MarkerContext.Provider value={memoizedValue}>{children}</MarkerContext.Provider>
}

export function useMarkers() {
  const context = useContext(MarkerContext)
  if (!context) throw new Error('useMarkers must be used within a MarkersProvider')
  return context
}

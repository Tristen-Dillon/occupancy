//Since the map will be laoded and displayed on client side
'use client'

// Import necessary modules and functions from external libraries and our own project
import { Libraries, useJsApiLoader } from '@react-google-maps/api'
import { createContext, ReactNode, useContext, useState } from 'react'

// Define a list of libraries to load from the Google Maps API
const libraries = ['places', 'drawing', 'geometry']

type MapContextType = {
  isLoaded: boolean
  loadError: Error | null
  map: google.maps.Map | null
  setMap: (map: google.maps.Map | null) => void
  zoom: number
}

const MapContext = createContext<MapContextType | null>(null)

// Define a function component called MapProvider that takes a children prop
export function MapProvider({ children }: { children: ReactNode }) {
  // Load the Google Maps JavaScript API asynchronously
  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
    libraries: libraries as Libraries,
  })
  const [zoom, setZoom] = useState(0)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  if (loadError) return <p>Encountered error while loading google maps</p>

  if (!scriptLoaded) return <p>Map Script is loading ...</p>
  if (map) {
    map.addListener('zoom_changed', () => {
      setZoom(map.getZoom() ?? 0)
    })
  }
  // Return the children prop wrapped by this MapProvider component
  return (
    <MapContext.Provider
      value={{
        isLoaded: scriptLoaded,
        loadError: loadError ?? null,
        map,
        setMap,
        zoom,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export function useMap() {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMap must be used within a MapProvider')
  }
  return context
}

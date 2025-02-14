import { AddressSidebar } from '@/components/address-sidebar'
import GoogleMapComponent from '@/components/map'
import { MapProvider } from '@/providers/map-provider'

export default function Home() {
  return (
    <MapProvider>
      <AddressSidebar />
      <GoogleMapComponent />
    </MapProvider>
  )
}

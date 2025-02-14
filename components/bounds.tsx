import { useAddress } from '@/providers/address-provider'
import { Rectangle } from '@react-google-maps/api'

export default function Bounds() {
  const { addresses } = useAddress()

  return (
    <>
      {addresses.map((address) => {
        const bounds = address.validated?.result?.geocode?.bounds
        if (bounds) {
          // Ensure bounds are not the same point

          const BUFFER = 0.0001

          const location = address.validated.result.geocode.location
          const new_bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(
              location.latitude - BUFFER,
              location.longitude - BUFFER
            ),
            new google.maps.LatLng(
              location.latitude + BUFFER,
              location.longitude + BUFFER
            )
          )

          return (
            <Rectangle
              key={address.name + address.pk_occupancy}
              bounds={new_bounds}
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
              }}
            />
          )
        }
      })}
    </>
  )
}

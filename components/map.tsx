/*
Since the map was loaded on client side,
we need to make this component client rendered as well else error occurs
*/
'use client'

import { useMap } from '@/providers/map-provider'
//Map component Component from library
import { GoogleMap } from '@react-google-maps/api'
import Markers from './markers'
import Legend from './legend'
import SearchMarker from './search-marker'
import SaveToExcelButton from './save-to-excel-button'
import SaveButton from './save-button'
// import Bounds from './bounds'

//Map's styling
export const defaultMapContainerStyle = {
  width: '100%',
  height: '100vh',
  borderRadius: '15px 0px 0px 15px',
}
const defaultMapCenter = {
  lat: 39.188161342012,
  lng: -96.5898756371237,
}
const defaultMapZoom = 18
const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: 'auto',
  mapTypeId: 'satellite',
}

export default function GoogleMapComponent() {
  const { setMap } = useMap()

  const onLoad = (map: google.maps.Map) => {
    setMap(map)
  }

  const onUnmount = () => {
    setMap(null)
  }

  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* <Bounds /> */}
        <Markers />
        <Markers color="red" dataset="google" />
        <Legend
          items={[
            { color: 'Blue', label: 'FileMaker Pro GeoData' },
            {
              color: 'Red',
              label: 'Google API Validated GeoData',
            },
          ]}
        />
        <SearchMarker
          className="absolute top-[10px] right-10 w-[240px]"
          dataset="fmp"
        />
        <SearchMarker
          className="absolute top-[10px] right-[300px] w-[240px]"
          dataset="google"
        />
        <div className="absolute top-[10px] right-[50%] flex gap-4">
          <SaveToExcelButton
            options={{ useGoogleGeocode: false, buttonText: 'Save to Excel' }}
          />
          <SaveToExcelButton
            options={{
              useGoogleGeocode: true,
              buttonText: 'Save Google GEOCODE to Excel',
            }}
          />
        </div>
        <div className='absolute bottom-[15px] right-[5%]'>
            <SaveButton/>
        </div>
      </GoogleMap>
    </div>
  )
}

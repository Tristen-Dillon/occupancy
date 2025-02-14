import { useMap } from '@/providers/map-provider'
import { useEffect, useRef } from 'react'

export default function Legend({
  items,
}: {
  items: { color: string; label: string }[]
}) {
  const { map } = useMap()
  const legendDiv = useRef(null)

  useEffect(() => {
    if (map && legendDiv.current) {
      map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(
        legendDiv.current
      )
    }
  }, [map])

  return (
    <div
      ref={legendDiv}
      style={{
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid black',
      }}
    >
      <h3>Legend</h3>
      {items.map((item, index) => (
        <div key={index}>
          <span
            style={{
              backgroundColor: item.color,
              width: '20px',
              height: '20px',
              display: 'inline-block',
              marginRight: '5px',
            }}
          ></span>
          {item.label}
        </div>
      ))}
    </div>
  )
}

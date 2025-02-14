import Image from 'next/image'
import { useState, useRef } from 'react'

interface StreetViewProps {
  location: google.maps.LatLng
}

function getImage(latLong: google.maps.LatLng, heading: number) {
  return `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${latLong.lat()},${latLong.lng()}&fov=120&heading=${heading}&pitch=0&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`
}

export function StreetView({ location }: StreetViewProps) {
  const [heading, setHeading] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const lastX = useRef(0)
  const lastHeading = useRef(heading)

  if (!location.lat() || !location.lng()) {
    return (
      <div className="h-48 bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No street view available</p>
      </div>
    )
  }

  // Determine base heading and next heading
  const baseHeading = Math.round(heading / 120) * 120
  console.log("Heading", heading)
  console.log("LAST HEADING", lastHeading.current)
  const isDraggingRight = heading > lastHeading.current

  const nextHeading = isDraggingRight ? baseHeading + 120 : baseHeading - 120

  // Get images
  const image1 = getImage(location, baseHeading % 360)
  const image2 = getImage(location, nextHeading % 360)

  // Calculate blend percentage
  const blendFactor = Math.abs((heading % 120) / 120)

  // Dragging functions
  const handleMouseDown = (e: React.MouseEvent) => {
    lastHeading.current = heading
    setIsDragging(true)
    lastX.current = e.clientX
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - lastX.current
    lastX.current = e.clientX
    setHeading((prev) => (prev + deltaX))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }


  console.log(isDraggingRight)
  return (
    <div
      className="relative h-[400px] w-[600px] overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {isDraggingRight ? (
        <>
          <Image
            src={image1}
            alt="Street View Base"
            layout="fill"
            objectFit="cover"
            className="absolute left-0 top-0 pointer-events-none"
            style={{
              clipPath: isDraggingRight
                ? `polygon(0% 0%, ${100 - blendFactor * 50}% 0%, ${100 - blendFactor * 50}% 100%, 0% 100%)`
                : `polygon(0% 0%, ${50 + blendFactor * 50}% 0%, ${50 + blendFactor * 50}% 100%, 0% 100%)`,
            }}
          />
          <Image
            src={image2}
            alt="Street View Base2"
            layout="fill"
            objectFit="cover"
            className="absolute left-0 top-0 pointer-events-none"
            style={{
              clipPath: isDraggingRight
                ? `polygon(0% 0%, ${100 - blendFactor * 50}% 0%, ${100 - blendFactor * 50}% 100%, 0% 100%)`
                : `polygon(0% 0%, ${50 + blendFactor * 50}% 0%, ${50 + blendFactor * 50}% 100%, 0% 100%)`,
            }}
          />
        </>

      ) : (
        <>
          <Image
            src={image2}
            alt="Street View Base2"
            layout="fill"
            objectFit="cover"
            className="absolute left-0 top-0 pointer-events-none"
            style={{
              clipPath: isDraggingRight
                ? `polygon(0% 0%, ${100 - blendFactor * 50}% 0%, ${100 - blendFactor * 50}% 100%, 0% 100%)`
                : `polygon(0% 0%, ${50 + blendFactor * 50}% 0%, ${50 + blendFactor * 50}% 100%, 0% 100%)`,
            }}
          />
          <Image
            src={image1}
            alt="Street View Base"
            layout="fill"
            objectFit="cover"
            className="absolute left-0 top-0 pointer-events-none"
            style={{
              clipPath: isDraggingRight
                ? `polygon(0% 0%, ${100 - blendFactor * 50}% 0%, ${100 - blendFactor * 50}% 100%, 0% 100%)`
                : `polygon(0% 0%, ${50 + blendFactor * 50}% 0%, ${50 + blendFactor * 50}% 100%, 0% 100%)`,
            }}
          />
        </>
      )}

      {/* Overlay image (blending)
      {blendFactor > 0 && (
        <Image
          src={image2}
          alt="Street View Next"
          layout="fill"
          objectFit="cover"
          className="absolute left-0 top-0 pointer-events-none"
          style={{
            clipPath: isDraggingRight
              ? `polygon(${100 - blendFactor * 50}% 0%, 100% 0%, 100% 100%, ${100 - blendFactor * 50}% 100%)`
              : `polygon(${50 + blendFactor * 50}% 0%, 100% 0%, 100% 100%, ${50 + blendFactor * 50}% 100%)`,
          }}
        />
      )} */}
    </div>
  )
}

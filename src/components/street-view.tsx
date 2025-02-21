'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'

interface StreetViewProps {
  location: google.maps.LatLng
}

function getImage(latLong: google.maps.LatLng, heading: number) {
  return `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${latLong.lat()},${latLong.lng()}&fov=120&heading=${heading}&pitch=0&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`
}

export function StreetView({ location }: StreetViewProps) {
  const [angle, setAngle] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastX = useRef(0)
  const lastTime = useRef(Date.now())
  const animationFrame = useRef<number | null>(null)

  // Get the two images that should be visible based on current angle
  const getVisibleImages = () => {
    const normalizedAngle = angle % 360
    const headings = [0, 120, 240]
    const visibleHeadings = headings.filter((heading) => {
      const diff = Math.abs(normalizedAngle - heading)
      return diff <= 120 || diff >= 240
    })

    return visibleHeadings.map((heading) => ({
      heading,
      url: getImage(location, heading),
    }))
  }

  // Animation loop for smooth momentum scrolling
  const animate = useCallback(() => {
    if (Math.abs(velocity) > 0.01) {
      setAngle((prev) => prev + velocity)
      // Apply friction
      setVelocity((prev) => prev * 0.95)
      animationFrame.current = requestAnimationFrame(animate)
    } else {
      setVelocity(0)
    }
  }, [velocity])

  // Handle mouse/touch events for dragging with momentum
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleStart = (clientX: number) => {
      isDragging.current = true
      lastX.current = clientX
      lastTime.current = Date.now()
      setVelocity(0)
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }

    const handleMove = (clientX: number) => {
      if (!isDragging.current) return

      const currentTime = Date.now()
      const deltaTime = currentTime - lastTime.current
      const delta = clientX - lastX.current

      // Calculate velocity based on movement and time
      if (deltaTime > 0) {
        const newVelocity = (delta * 0.3) / deltaTime
        setVelocity(newVelocity)
      }

      setAngle((prev) => prev - delta * 0.3)

      lastX.current = clientX
      lastTime.current = currentTime
    }

    const handleEnd = () => {
      isDragging.current = false
      // Start animation loop when dragging ends
      animationFrame.current = requestAnimationFrame(animate)
    }

    // Mouse events
    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX)
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const onMouseUp = () => handleEnd()

    // Touch events
    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX)
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX)
    const onTouchEnd = () => handleEnd()

    const controller = new AbortController()
    const { signal } = controller

    container.addEventListener('mousedown', onMouseDown, { signal })
    window.addEventListener('mousemove', onMouseMove, { signal })
    window.addEventListener('mouseup', onMouseUp, { signal })
    container.addEventListener('touchstart', onTouchStart, { signal })
    window.addEventListener('touchmove', onTouchMove, { signal })
    window.addEventListener('touchend', onTouchEnd, { signal })

    return () => {
      controller.abort()
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [animate])

  if (!location.lat() || !location.lng()) {
    return (
      <div className="h-48 bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No street view available</p>
      </div>
    )
  }

  const visibleImages = getVisibleImages()
  return (
    <div
      ref={containerRef}
      className="relative h-96 overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {visibleImages.map(({ heading, url }) => {
        const angleDiff = ((heading - angle + 540) % 360) - 180
        const position = (angleDiff / 120) * 100

        return (
          <div
            key={heading}
            className="absolute w-full h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${position}%)`,
            }}
          >
            <img
              draggable={false}
              src={url}
              alt={`Street view at ${heading}°`}
              className="w-full h-full object-cover"
            />
          </div>
        )
      })}
    </div>
  )
}

export default StreetView

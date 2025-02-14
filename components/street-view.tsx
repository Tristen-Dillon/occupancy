import Image from 'next/image'
import { useState } from 'react'
import { Button } from './ui/button'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'

interface StreetViewProps {
  latitude: number | null
  longitude: number | null
}

export function StreetView({ latitude, longitude }: StreetViewProps) {
  const [pitch, setPitch] = useState(0)
  const [heading, setHeading] = useState(190)
  if (!latitude || !longitude) {
    return (
      <div className="h-48 bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No street view available</p>
      </div>
    )
  }

  const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${latitude},${longitude}&fov=80&heading=${heading}&pitch=${pitch}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`

  const lookUp = () => {
    setPitch(pitch + 5)
  }

  const lookDown = () => {
    setPitch(pitch - 5)
  }

  const lookLeft = () => {
    setHeading(heading - 5)
  }

  const lookRight = () => {
    setHeading(heading + 5)
  }

  return (
    <div className="relative h-[400px] w-[600px]">
      <Image
        src={streetViewUrl || '/placeholder.svg'}
        alt="Street View"
        layout="fill"
        objectFit="cover"
      />
      <Button
        className="absolute top-0 left-[45%]"
        variant="outline"
        onClick={lookUp}
      >
        <ArrowUp />
      </Button>
      <Button
        className="absolute bottom-0 left-[45%]"
        variant="outline"
        onClick={lookDown}
      >
        <ArrowDown />
      </Button>
      <Button
        className="absolute top-[45%] left-0"
        variant="outline"
        onClick={lookLeft}
      >
        <ArrowLeft />
      </Button>
      <Button
        className="absolute top-[45%] right-0"
        variant="outline"
        onClick={lookRight}
      >
        <ArrowRight />
      </Button>
    </div>
  )
}

'use client'

import { useMarkers } from '@/providers/markers-provider'
import { Slider } from '@/components/ui/slider'
import { debounce } from 'lodash'

export default function MarkerSlider() {
  const { distanceMargin, setDistanceMargin } = useMarkers()

  const debouncedSetMargin = debounce((value: number) => {
    setDistanceMargin(value)
  }, 500)

  return (
    <div className="absolute bottom-[5%] left-5 w-[300px] bg-background p-4 rounded-md space-y-2">
      <p>Distance Margin: {distanceMargin} meters</p>
      <Slider
        defaultValue={[distanceMargin]}
        max={100}
        min={0}
        step={1}
        onValueChange={(value) => debouncedSetMargin(value[0])}
      />
    </div>
  )
}

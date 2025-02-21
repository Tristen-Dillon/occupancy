'use client'

import type { Occupancy } from '@/payload-types'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

type OccupancyProviderProps = {
  children: React.ReactNode
}

type OccupancyContextType = {
  loading: boolean
  occupancies: Occupancy[]
  selectedOccupancy: number | null
  setSelectedOccupancy: React.Dispatch<React.SetStateAction<number | null>>
}

const OccupancyContext = createContext<OccupancyContextType | undefined>(undefined)

export function OccupancyProvider({ children }: OccupancyProviderProps) {
  const [loading, setLoading] = useState(true)
  const [occupancies, setOccupancies] = useState<Occupancy[]>([])
  const [selectedOccupancy, setSelectedOccupancy] = useState<number | null>(null)

  useEffect(() => {
    const fetchOccupancies = async () => {
      const response = await fetch('/api/occupancy?limit=10000')
      if (!response.ok) {
        toast.error('Failed to fetch occupancies')
        return
      }
      const data = await response.json()

      setOccupancies(data.docs)
      setLoading(false)
    }

    fetchOccupancies()
  }, [])

  return (
    <OccupancyContext.Provider
      value={{
        loading,
        occupancies,
        selectedOccupancy,
        setSelectedOccupancy,
      }}
    >
      {children}
    </OccupancyContext.Provider>
  )
}

export function useOccupancy() {
  const context = useContext(OccupancyContext)
  if (!context) {
    throw new Error('useOccupancy must be used within a OccupancyProvider')
  }
  return context
}

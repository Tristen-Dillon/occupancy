'use client'

import { createContext, useContext, useState } from 'react'

type OccupancyProviderProps = {
  children: React.ReactNode
}

type OccupancyContextType = {
  selectedOccupancy: number | null
  setSelectedOccupancy: React.Dispatch<React.SetStateAction<number | null>>
}

const OccupancyContext = createContext<OccupancyContextType | undefined>(undefined)

export function OccupancyProvider({ children }: OccupancyProviderProps) {
  const [selectedOccupancy, setSelectedOccupancy] = useState<number | null>(null)

  return (
    <OccupancyContext.Provider
      value={{
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

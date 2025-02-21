'use client'

import React, { createContext, useContext, useState, useRef } from 'react'
import type { Occupancy } from '@/payload-types'
export type ImportOccupancy = {
  occupancyPk: string
  occupancyId: string
  name: string
  address: string
  location: {
    lat: number | null
    lng: number | null
  }
  validated: any
}

type ImportContextType = {
  parsedData: ImportOccupancy[]
  count: number
  setParsedData: (data: ImportOccupancy[]) => void
  handleImport: () => Promise<void>
  isImporting: boolean
  importedOccupancies: Occupancy[]
  abortControllerRef: React.RefObject<AbortController | null>
}

const ImportContext = createContext<ImportContextType | undefined>(undefined)

interface ImportProviderProps {
  children: React.ReactNode
}

export default function ImportProvider({ children }: ImportProviderProps) {
  const [parsedData, setParsedData] = useState<ImportOccupancy[]>([])
  const [importedOccupancies, setImportedOccupancies] = useState<Occupancy[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const abortController = useRef<AbortController | null>(null)
  const handleImport = async () => {
    try {
      setIsImporting(true)
      abortController.current = new AbortController()
      const response = await fetch('/api/occupancy/upload', {
        method: 'POST',
        body: JSON.stringify({ data: parsedData }),
        signal: abortController.current?.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        console.error('Import failed')
        return
      }

      const reader = response.body?.getReader()
      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = new TextDecoder().decode(value)
        console.log(text)
        const data = text.trim()

        if (data.startsWith('data: ')) {
          try {
            const parsedData = JSON.parse(data.slice(6))
            if (parsedData.error) {
              console.error('Stream error:', parsedData.error)
              continue
            }
            setImportedOccupancies((prev) => [...prev, parsedData])
          } catch (e) {
            console.error('Error parsing SSE data:', e)
          }
        }
      }
      setIsImporting(false)
    } catch (e) {
      console.error('Import failed:', e)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <ImportContext.Provider
      value={{
        parsedData,
        setParsedData,
        handleImport,
        count: parsedData.length,
        isImporting,
        importedOccupancies,
        abortControllerRef: abortController,
      }}
    >
      {children}
    </ImportContext.Provider>
  )
}

export function useImport() {
  const context = useContext(ImportContext)
  if (context === undefined) {
    throw new Error('useImport must be used within an ImportProvider')
  }
  return context
}

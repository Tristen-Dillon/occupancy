'use client'

import React from 'react'
import { useImport } from '@/providers/import-provider'
export default function UploadProgressBar() {
  const { importedOccupancies, count } = useImport()
  const percent = Math.round((importedOccupancies.length / count) * 100)

  if (importedOccupancies.length === 0) {
    return null
  }

  return (
    <div className="relative w-full h-4 border bg-background border-border rounded-full mt-0">
      <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }}></div>
      <div className="w-full flex justify-between text-sm">
        <div>
          {importedOccupancies.length} / {count}
        </div>
        <div>{percent}%</div>
      </div>
    </div>
  )
}

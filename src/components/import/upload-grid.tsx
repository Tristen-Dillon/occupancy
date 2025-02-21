'use client'

import { useImport } from '@/providers/import-provider'
import React from 'react'
import UploadRow from './upload-row'

export default function UploadGrid() {
  const { importedOccupancies } = useImport()
  return (
    <div className="w-full h-full flex">
      <div className="mt-5 border border-border p-4 mx-auto w-full">
        <table className="w-full overflow-auto max-h-[500px]">
          <thead className="border-b w-full">
            <tr className="w-full justify-between ">
              <th>Occupancy ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>FMP Location</th>
              <th>Google Location</th>
            </tr>
          </thead>
          <tbody>
            {importedOccupancies.map((occupancy) => (
              <UploadRow key={occupancy.id} occupancy={occupancy} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

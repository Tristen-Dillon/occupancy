import React from 'react'
import Upload from '@/components/import/upload'
import ImportProvider from '@/providers/import-provider'
import UploadGrid from '@/components/import/upload-grid'
import UploadProgressBar from '@/components/import/upload-progress-bar'
export default function ImportPage() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full mx-auto mt-10">
        <ImportProvider>
          <Upload />
          <div className="h-full max-w-4xl w-full mx-auto">
            <UploadProgressBar />
            <UploadGrid />
          </div>
        </ImportProvider>
      </div>
    </div>
  )
}

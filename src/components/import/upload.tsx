'use client'

import React, { useState } from 'react'
import { FileUpload } from '../ui/file-upload'
import { Button } from '../ui/button'
import { useImport } from '@/providers/import-provider'

export default function Upload() {
  const [files, setFiles] = useState<File[]>([])
  const { setParsedData, handleImport, abortControllerRef, isImporting } = useImport()
  const handleFileUpload = (files: File[]) => {
    setFiles(files)
    if (files.length > 0) {
      parseFile(files[0])
    }
  }

  const parseFile = async (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        // Handle both single object and array of objects
        const data = Array.isArray(json) ? json : [json]
        setParsedData(data)
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    }
    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }
    reader.readAsText(file)
  }

  const handleClick = () => {
    if (isImporting && abortControllerRef.current) {
      abortControllerRef.current.abort()
    } else {
      handleImport()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-background border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
      {files.length > 0 && (
        <div className="w-full h-full flex justify-center">
          <Button variant="outline" onClick={handleClick}>
            {isImporting ? 'Abort' : 'Import'}
          </Button>
        </div>
      )}
    </div>
  )
}

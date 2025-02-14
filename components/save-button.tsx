'use client'

import { Button } from './ui/button'
import { toast } from 'sonner'
import React from 'react'

export default function SaveButton() {
  
  const saveClicked = async () => {
    const res = await fetch('/api/addresses', {
      method: "POST",
    })
    if (res.ok) {
      toast.success("Data saved to schema.")
    } else {
      toast.error("Could not save file")
    }
  }

  return (
    <Button onClick={saveClicked}>
      Save Updated Data
    </Button>
  )
}

'use client'

import type { ValidatedAddress } from '@/lib/types'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

type AddressProviderProps = {
  children: React.ReactNode
}

type AddressContextType = {
  loading: boolean
  addresses: ValidatedAddress[]
  editAddresses: (address: ValidatedAddress) => void
  selectedAddress: ValidatedAddress | null
  setSelectedAddress: React.Dispatch<
    React.SetStateAction<ValidatedAddress | null>
  >
}

const AddressContext = createContext<AddressContextType | undefined>(undefined)

export function AddressProvider({ children }: AddressProviderProps) {
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState<ValidatedAddress[]>([])
  const [selectedAddress, setSelectedAddress] =
    useState<ValidatedAddress | null>(null)

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true)
      const response = await fetch('/api/addresses')
      const data = JSON.parse(await response.json())
      if (response.ok) {
        console.log(data)
        setAddresses(data)
      } else {
        toast.error('Failed to fetch addresses')
      }
      setLoading(false)
    }

    fetchAddresses()
  }, [])

  const editAddresses = async (address: ValidatedAddress) => {
    setAddresses((prevAddresses) => [
      ...prevAddresses.filter((a) => a.pk_occupancy !== address.pk_occupancy),
      address,
    ])
    const response = await fetch('/api/addresses', {
      method: 'PUT',
      body: JSON.stringify(address),
    })
    if (response.ok) {
      toast.success('Address updated successfully')
    } else {
      toast.error('Failed to update address')
    }
  }

  return (
    <AddressContext.Provider
      value={{
        addresses,
        editAddresses,
        loading,
        selectedAddress,
        setSelectedAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}

export function useAddress() {
  const context = useContext(AddressContext)
  if (!context) {
    throw new Error('useAddress must be used within a AddressProvider')
  }
  return context
}

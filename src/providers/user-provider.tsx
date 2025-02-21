'use client'

import type { TypedUser } from 'payload'
import React, { createContext, useContext } from 'react'

type UserContextType = {
  user: TypedUser
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: React.ReactNode
  user: TypedUser
}

export default function UserProvider({ children, user }: UserProviderProps) {
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

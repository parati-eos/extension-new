import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define the type of data the context will hold
interface UserContextType {
  userId: string | null
  setUserId: (id: string | null) => void
}

// Create the UserContext with default undefined
const UserContext = createContext<UserContextType | undefined>(undefined)

// Create the provider component
interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null)

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook for easy context access
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}

import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../api/client.js'

const STORAGE_KEY = 'campus-placement-session'
const AuthContext = createContext(null)

function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  const value = useMemo(
    () => ({
      session,
      async login({ email, password }) {
        try {
          const data = await api.login({ email, password })
          const userSession = {
            userId: data.userId,
            studentId: data.studentId,
            email: data.email,
            name: data.fullName,
            role: data.role.toLowerCase().includes('officer') ? 'officer'
                : data.role.toLowerCase().includes('team') ? 'team' : 'student',
            roleLabel: data.role.replace('_', ' '),
            home: data.homeRoute,
          }
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userSession))
          setSession(userSession)
          return userSession
        } catch (error) {
          throw error
        }
      },
      logout() {
        sessionStorage.removeItem(STORAGE_KEY)
        setSession(null)
      },
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

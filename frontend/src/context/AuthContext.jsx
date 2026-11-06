import { createContext, useContext, useMemo, useState } from 'react'
import { roleProfiles } from '../data/mockData.js'

const STORAGE_KEY = 'campus-placement-session'
const AuthContext = createContext(null)

function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.role || !roleProfiles[parsed.role]) return null
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  const value = useMemo(
    () => ({
      session,
      login({ email, role }) {
        const profile = roleProfiles[role]
        const next = {
          email,
          role,
          name: profile.name,
          roleLabel: profile.roleLabel,
          home: profile.home,
        }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        setSession(next)
        return next
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

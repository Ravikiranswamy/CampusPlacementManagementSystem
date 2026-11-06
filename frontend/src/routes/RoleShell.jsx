import { Navigate, useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function RoleShell({ role, navItems }) {
  const { session, logout } = useAuth()
  const navigate = useNavigate()

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (session.role !== role) {
    return <Navigate to={session.home} replace />
  }

  return (
    <DashboardLayout
      brand="Campus Placement"
      navItems={navItems}
      note="Sample records for this role. Nothing here is loaded from the database."
      user={{ name: session.name, role: session.roleLabel }}
      onLogout={() => {
        logout()
        navigate('/login', { replace: true })
      }}
    />
  )
}

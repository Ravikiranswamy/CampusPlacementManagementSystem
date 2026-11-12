import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ApplicationStatus from './pages/student/ApplicationStatus.jsx'
import Eligibility from './pages/student/Eligibility.jsx'
import MyApplications from './pages/student/MyApplications.jsx'
import PlacementDrives from './pages/student/PlacementDrives.jsx'
import StudentOverview from './pages/student/StudentOverview.jsx'
import StudentProfile from './pages/student/StudentProfile.jsx'
import OfficerOverview from './pages/officer/OfficerOverview.jsx'
import Offers from './pages/officer/Offers.jsx'
import Selections from './pages/officer/Selections.jsx'
import Statistics from './pages/officer/Statistics.jsx'
import Students from './pages/officer/Students.jsx'
import Companies from './pages/team/Companies.jsx'
import JobRoles from './pages/team/JobRoles.jsx'
import TeamDrives from './pages/team/TeamDrives.jsx'
import TeamEligibility from './pages/team/TeamEligibility.jsx'
import TeamOverview from './pages/team/TeamOverview.jsx'
import RoleShell from './routes/RoleShell.jsx'
import { officerNav, studentNav, teamNav } from './routes/navConfig.jsx'

function HomeRedirect() {
  const { session } = useAuth()
  return <Navigate to={session ? session.home : '/login'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<RoleShell role="student" navItems={studentNav} />}>
        <Route path="/student" element={<StudentOverview />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/drives" element={<PlacementDrives />} />
        <Route path="/student/eligibility" element={<Eligibility />} />
        <Route path="/student/applications" element={<MyApplications />} />
        <Route path="/student/status" element={<ApplicationStatus />} />
      </Route>
      <Route element={<RoleShell role="team" navItems={teamNav} />}>
        <Route path="/team" element={<TeamOverview />} />
        <Route path="/team/companies" element={<Companies />} />
        <Route path="/team/roles" element={<JobRoles />} />
        <Route path="/team/drives" element={<TeamDrives />} />
        <Route path="/team/eligibility" element={<TeamEligibility />} />
      </Route>
      <Route element={<RoleShell role="officer" navItems={officerNav} />}>
        <Route path="/officer" element={<OfficerOverview />} />
        <Route path="/officer/students" element={<Students />} />
        <Route path="/officer/statistics" element={<Statistics />} />
        <Route path="/officer/selections" element={<Selections />} />
        <Route path="/officer/offers" element={<Offers />} />
      </Route>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

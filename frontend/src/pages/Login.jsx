import { useState } from 'react'
import { GraduationCap, Loader2 } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const roleChoices = [
  {
    id: 'student',
    label: 'Student',
    defaultEmail: 'student.demo@example.edu',
    detail: 'Drives, eligibility, and applications',
  },
  {
    id: 'team',
    label: 'Placement Team Member',
    defaultEmail: 'team.demo@example.edu',
    detail: 'Companies, job roles, and drives',
  },
  {
    id: 'officer',
    label: 'Placement Officer',
    defaultEmail: 'officer.demo@example.edu',
    detail: 'Students, selections, restrictions, and reports',
  },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('student.demo@example.edu')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (session) {
    return <Navigate to={session.home} replace />
  }

  function handleRoleChange(selectedRole) {
    setRole(selectedRole.id)
    setEmail(selectedRole.defaultEmail)
    setPassword('password123')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    try {
      const userSession = await login({ email: email.trim(), password: password.trim() })
      navigate(userSession.home, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-screen">
      <section className="login-panel">
        <span className="brand-mark" aria-hidden="true">
          <GraduationCap size={22} />
        </span>
        <p className="brand-kicker">University portal</p>
        <h1>Campus Placement</h1>
        <p>
          The centralized campus recruitment and placement management system for JSS Science and Technology University.
        </p>
      </section>

      <section className="login-card">
        <h2>Sign in</h2>
        <p className="login-lead">
          Select your portal role or sign in with your registered university account credentials.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="role-fieldset">
            <legend>Role</legend>
            <div className="role-grid">
              {roleChoices.map((choice) => (
                <label
                  key={choice.id}
                  className={role === choice.id ? 'role-option selected' : 'role-option'}
                >
                  <input
                    type="radio"
                    name="role"
                    value={choice.id}
                    checked={role === choice.id}
                    onChange={() => handleRoleChange(choice)}
                  />
                  <span>
                    <strong>{choice.label}</strong>
                    <small>{choice.detail}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field-label" htmlFor="email-input">
            Email address
          </label>
          <input
            id="email-input"
            className="text-input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="field-label" htmlFor="password-input">
            Password
          </label>
          <input
            id="password-input"
            className="text-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}

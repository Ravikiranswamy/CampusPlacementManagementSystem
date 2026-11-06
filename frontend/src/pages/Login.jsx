import { useState } from 'react'
import { GraduationCap } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { roleProfiles } from '../data/mockData.js'

const roleChoices = [
  {
    id: 'student',
    label: 'Student',
    detail: 'Drives, eligibility, and applications',
  },
  {
    id: 'team',
    label: 'Placement Team Member',
    detail: 'Companies, job roles, and drives',
  },
  {
    id: 'officer',
    label: 'Placement Officer',
    detail: 'Students, selections, and offers',
  },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (session) {
    return <Navigate to={session.home} replace />
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!roleProfiles[role]) {
      setError('Select a role to continue.')
      return
    }
    if (!emailPattern.test(email.trim())) {
      setError('Enter an email address, such as name@university.edu.')
      return
    }
    if (!password.trim()) {
      setError('Enter a password. Any password works in this preview.')
      return
    }

    const next = login({ email: email.trim(), role })
    navigate(next.home, { replace: true })
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
          The recruitment desk for students, the placement team, and the placement officer.
        </p>
      </section>

      <section className="login-card">
        <h2>Sign in</h2>
        <p className="login-lead">
          Choose a role, then sign in. This preview keeps the session in your browser and does not check a database.
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
                    onChange={() => setRole(choice.id)}
                  />
                  <span>
                    <strong>{choice.label}</strong>
                    <small>{choice.detail}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="name@university.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className="primary-button">
            Login
          </button>
        </form>
      </section>
    </main>
  )
}

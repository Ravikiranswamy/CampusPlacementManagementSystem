import { useState } from 'react'
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  AlertCircle,
  Database,
} from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const roleChoices = [
  {
    id: 'student',
    label: 'Student Portal',
    icon: GraduationCap,
    defaultEmail: 'student.demo@example.edu',
    detail: 'Browse drives, track eligibility & view offer letters',
  },
  {
    id: 'team',
    label: 'Placement Team Portal',
    icon: Building2,
    defaultEmail: 'team.demo@example.edu',
    detail: 'Manage recruiters, job roles & candidate evaluations',
  },
  {
    id: 'officer',
    label: 'Placement Officer Portal',
    icon: ShieldCheck,
    defaultEmail: 'officer.demo@example.edu',
    detail: 'Student directory, offer issuance & DBMS reports',
  },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('team') // Default to team so user can immediately test!
  const [email, setEmail] = useState('team.demo@example.edu')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (session) {
    return <Navigate to={session.home} replace />
  }

  function handleRoleChange(choice) {
    setRole(choice.id)
    setEmail(choice.defaultEmail)
    setPassword('password123')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid university email address.')
      return
    }
    if (!password.trim()) {
      setError('Please enter your account password.')
      return
    }

    setLoading(true)
    try {
      const userSession = await login({ email: email.trim(), password: password.trim() })
      navigate(userSession.home, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials or ensure the server is active.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-screen">
      {/* Left University Branding Panel */}
      <section className="login-panel">
        <div className="login-brand-top">
          <div className="brand-mark">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="brand-kicker">JSS Science & Technology University</p>
            <span style={{ fontSize: '0.88rem', color: '#cbd5e1', fontWeight: 500 }}>
              Department of Computer Science & Engineering
            </span>
          </div>
        </div>

        <div className="login-brand-copy">
          <h1>Campus Placement & Recruitment Portal</h1>
          <p>
            A centralized, relational database management platform powering campus hiring, eligibility checks, interview rounds, and offer tracking.
          </p>
        </div>

        <div className="login-footer-badges">
          <span className="badge-pill">
            <Database size={13} /> Neon PostgreSQL (16 Tables)
          </span>
          <span className="badge-pill">DBMS Course 24CS520</span>
          <span className="badge-pill">Spring Boot 4.1</span>
        </div>
      </section>

      {/* Right Login Card & Form */}
      <section className="login-card">
        <div className="login-card-inner">
          <h2>Sign In</h2>
          <p className="login-lead">
            Select your university portal role below or enter your registered account credentials.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Role Options */}
            <fieldset className="role-fieldset">
              <legend>Select Portal Role</legend>
              <div className="role-grid">
                {roleChoices.map((choice) => {
                  const Icon = choice.icon
                  const isSelected = role === choice.id
                  return (
                    <label
                      key={choice.id}
                      className={`role-option ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="portal-role"
                        value={choice.id}
                        checked={isSelected}
                        onChange={() => handleRoleChange(choice)}
                      />
                      <div className="role-icon-box">
                        <Icon size={18} />
                      </div>
                      <div className="role-text">
                        <strong>{choice.label}</strong>
                        <small>{choice.detail}</small>
                      </div>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {/* Email Field */}
            <div className="form-field">
              <label htmlFor="email-input">Institutional Email</label>
              <div className="input-container">
                <Mail size={18} className="input-icon" />
                <input
                  id="email-input"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.edu"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-field">
              <label htmlFor="password-input">Password</label>
              <div className="input-container">
                <Lock size={18} className="input-icon" />
                <input
                  id="password-input"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="login-error-alert" role="alert">
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              className="login-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Demo Hint */}
            <div className="demo-credentials-hint">
              Default password for all demo accounts: <code>password123</code>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

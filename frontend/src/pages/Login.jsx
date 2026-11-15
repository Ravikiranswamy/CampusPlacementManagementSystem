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
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const roleChoices = [
  {
    id: 'student',
    label: 'Student Portal',
    icon: GraduationCap,
    detail: 'Login with USN to view drives, eligibility & offers',
  },
  {
    id: 'team',
    label: 'Placement Team Portal',
    icon: Building2,
    detail: 'Manage recruiters, job roles & drive evaluations',
  },
  {
    id: 'officer',
    label: 'Placement Officer Portal',
    icon: ShieldCheck,
    detail: 'Student directory, offer issuance & DBMS reports',
  },
]

export default function Login() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (session) {
    return <Navigate to={session.home} replace />
  }

  function handleRoleChange(choice) {
    setRole(choice.id)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const trimmedIdentifier = identifier.trim()
    if (!trimmedIdentifier) {
      setError(role === 'student' ? 'Please enter your USN or SR number.' : 'Please enter your email or username.')
      return
    }
    if (!password.trim()) {
      setError('Please enter your account password.')
      return
    }

    setLoading(true)
    try {
      const userSession = await login({ email: trimmedIdentifier, password: password.trim() })
      navigate(userSession.home, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials or ensure the server is active.')
    } finally {
      setLoading(false)
    }
  }

  const isStudent = role === 'student'

  return (
    <main className="login-screen">
      {/* Left University Branding Panel */}
      <section className="login-panel">
        <div className="login-brand-top">
          <div className="brand-mark">
            <GraduationCap size={22} />
          </div>
          <div>
            <p className="brand-kicker">Campus Placement Platform</p>
            <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 500 }}>
              JSS Science &amp; Technology University
            </span>
          </div>
        </div>

        <div className="login-brand-copy">
          <h1>Campus Placement &amp; Recruitment Portal</h1>
          <p>
            A centralized, relational database management platform powering campus hiring, eligibility checks, interview rounds, and offer tracking.
          </p>
        </div>

        <div className="login-panel-footer">
          <span>&copy; {new Date().getFullYear()} JSS Science &amp; Technology University • Mysuru</span>
        </div>
      </section>

      {/* Right Login Card & Form */}
      <section className="login-card">
        <div className="login-card-inner">
          <h2>Sign In</h2>
          <p className="login-lead">
            Select your university portal role below or enter your registered account credentials.
          </p>

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
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
                        <Icon size={16} />
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

            {/* Identifier Field: USN for students, Email for admin/officer */}
            <div className="form-field">
              <label htmlFor="identifier-input">
                {isStudent ? 'USN / SR Number' : 'Email / Username'}
              </label>
              <div className="input-container">
                {isStudent ? (
                  <GraduationCap size={17} className="input-icon" />
                ) : (
                  <Mail size={17} className="input-icon" />
                )}
                <input
                  id="identifier-input"
                  type="text"
                  name="portal_identifier"
                  autoComplete="off"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={isStudent ? 'e.g. 01JST24UCS120 or 4JC...' : 'name@example.edu'}
                  style={{ textTransform: isStudent ? 'uppercase' : 'none' }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-field">
              <label htmlFor="password-input">Password</label>
              <div className="input-container" style={{ position: 'relative' }}>
                <Lock size={17} className="input-icon" />
                <input
                  id="password-input"
                  type="text"
                  name="portal_auth_code"
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  style={{
                    WebkitTextSecurity: showPassword ? 'none' : 'disc',
                    paddingRight: '40px',
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="login-error-alert" role="alert">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
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
                  <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Register Link: specifically for students */}
            {isStudent ? (
              <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.88rem', color: '#64748b' }}>
                New student?{' '}
                <Link
                  to="/register"
                  style={{ color: '#0b1f3a', fontWeight: 700, textDecoration: 'none' }}
                >
                  Register here with USN <UserPlus size={13} style={{ verticalAlign: 'middle' }} />
                </Link>
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                Administrator credentials are issued by the placement cell.
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.82rem' }}>
              <Link
                to="/"
                style={{ color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                &larr; Back to Placement Home
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

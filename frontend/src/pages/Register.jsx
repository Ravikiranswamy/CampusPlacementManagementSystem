import { useState } from 'react'
import {
  GraduationCap,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [form, setForm] = useState({
    usn: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const trimmedUsn = form.usn.trim().toUpperCase()
    const trimmedEmail = form.email.trim().toLowerCase()

    if (!trimmedUsn) {
      setError('USN / SR Number is required.')
      return
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid institutional email address.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters in length.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please verify and re-enter.')
      return
    }

    setLoading(true)
    try {
      await api.registerStudent({
        usn: trimmedUsn,
        email: trimmedEmail,
        password: form.password,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.message || 'Registration failed. Please check if this USN or email is already registered.')
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
          <h1>Student Registration</h1>
          <p>
            Create your student placement account with your official university USN or SR Number. Academic records and eligibility criteria are verified directly by the university placement cell.
          </p>
        </div>

        <div className="login-panel-footer">
          <span>&copy; {new Date().getFullYear()} JSS Science &amp; Technology University • Mysuru</span>
        </div>
      </section>

      {/* Right Registration Card & Form */}
      <section className="login-card">
        <div className="login-card-inner">
          <h2>Student Registration</h2>
          <p className="login-lead">
            Enter your official university USN / SR number, institutional email, and set your portal password.
          </p>

          {success ? (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1.5px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '10px',
                padding: '24px 20px',
                textAlign: 'center',
                color: '#065f46',
                margin: '16px 0',
              }}
            >
              <CheckCircle size={38} color="#059669" style={{ marginBottom: '10px' }} />
              <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', color: '#065f46' }}>
                Registration Successful!
              </h3>
              <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#047857' }}>
                Your student account has been created. Redirecting you to login...
              </p>
              <Link
                to="/login"
                className="login-submit-btn"
                style={{ textDecoration: 'none', display: 'inline-flex', padding: '10px 20px' }}
              >
                <span>Go to Login Now</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              {/* USN / SR Number */}
              <div className="form-field">
                <label htmlFor="reg-usn">USN / SR Number *</label>
                <div className="input-container">
                  <GraduationCap size={17} className="input-icon" />
                  <input
                    id="reg-usn"
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. 01JST24UCS120 or 4JC21CS045"
                    value={form.usn}
                    onChange={set('usn')}
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                </div>
              </div>

              {/* Institutional Email */}
              <div className="form-field">
                <label htmlFor="reg-email">Institutional Email *</label>
                <div className="input-container">
                  <Mail size={17} className="input-icon" />
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="off"
                    placeholder="usn@jssstuniv.in or name@example.edu"
                    value={form.email}
                    onChange={set('email')}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-field">
                <label htmlFor="reg-pass">Create Password *</label>
                <div className="input-container" style={{ position: 'relative' }}>
                  <Lock size={17} className="input-icon" />
                  <input
                    id="reg-pass"
                    type="text"
                    autoComplete="new-password"
                    data-lpignore="true"
                    style={{
                      WebkitTextSecurity: showPassword ? 'none' : 'disc',
                      paddingRight: '40px',
                    }}
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={set('password')}
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

              {/* Confirm Password */}
              <div className="form-field">
                <label htmlFor="reg-confirm">Confirm Password *</label>
                <div className="input-container" style={{ position: 'relative' }}>
                  <Lock size={17} className="input-icon" />
                  <input
                    id="reg-confirm"
                    type="text"
                    autoComplete="new-password"
                    data-lpignore="true"
                    style={{
                      WebkitTextSecurity: showConfirmPassword ? 'none' : 'disc',
                      paddingRight: '40px',
                    }}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Create Student Account</span>
                  </>
                )}
              </button>

              {/* Already registered */}
              <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.88rem', color: '#64748b' }}>
                Already registered?{' '}
                <Link
                  to="/login"
                  style={{ color: '#0b1f3a', fontWeight: 700, textDecoration: 'none' }}
                >
                  Sign in with USN &rarr;
                </Link>
              </div>

              <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.82rem' }}>
                <Link
                  to="/"
                  style={{ color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  &larr; Back to Placement Home
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

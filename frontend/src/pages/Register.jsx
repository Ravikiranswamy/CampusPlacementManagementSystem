import { useEffect, useState } from 'react'
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  BookOpen,
  Phone,
  Loader2,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Database,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'

export default function Register() {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    usn: '',
    departmentId: '',
    section: '',
    cgpa: '',
    activeBacklogs: '0',
    graduationYear: new Date().getFullYear() + 1,
    phone: '',
    resumeUrl: '',
  })

  useEffect(() => {
    api.getDepartments()
      .then(setDepartments)
      .catch(() => setDepartments([]))
  }, [])

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.fullName.trim()) return setError('Full name is required.')
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid university email.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (!form.usn.trim()) return setError('USN is required.')
    if (!form.departmentId) return setError('Please select your department.')
    const cgpaNum = parseFloat(form.cgpa)
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) return setError('CGPA must be between 0 and 10.')
    const backlogsNum = parseInt(form.activeBacklogs)
    if (isNaN(backlogsNum) || backlogsNum < 0) return setError('Active backlogs must be 0 or more.')

    setLoading(true)
    try {
      await api.registerStudent({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        usn: form.usn.trim().toUpperCase(),
        departmentId: parseInt(form.departmentId),
        section: form.section.trim() || null,
        cgpa: cgpaNum,
        activeBacklogs: backlogsNum,
        graduationYear: parseInt(form.graduationYear),
        phone: form.phone.trim() || null,
        resumeUrl: form.resumeUrl.trim() || null,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-screen">
      {/* Left Branding Panel */}
      <section className="login-panel">
        <div className="login-brand-top">
          <div className="brand-mark">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="brand-kicker">JSS Science &amp; Technology University</p>
            <span style={{ fontSize: '0.88rem', color: '#cbd5e1', fontWeight: 500 }}>
              Department of Computer Science &amp; Engineering
            </span>
          </div>
        </div>

        <div className="login-brand-copy">
          <h1>Student Registration</h1>
          <p>
            Create your placement portal account using your university email and register your academic profile to start applying to companies visiting campus.
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

      {/* Right Form */}
      <section className="login-card" style={{ overflowY: 'auto' }}>
        <div className="login-card-inner" style={{ maxWidth: '480px', paddingTop: '2rem' }}>
          <h2>Create Account</h2>
          <p className="login-lead">
            Fill in your details below. All fields marked with * are required.
          </p>

          {success ? (
            <div style={{
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.4)',
              borderRadius: '10px',
              padding: '1.5rem',
              textAlign: 'center',
              color: '#10b981',
              marginTop: '1rem',
            }}>
              <CheckCircle size={36} style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                Account Created Successfully!
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Redirecting to login page in 3 seconds…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              {/* Personal Info */}
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Full Name *</label>
                <div className="input-container">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Ravi Kumar"
                    value={form.fullName}
                    onChange={set('fullName')}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">University Email *</label>
                <div className="input-container">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    autoComplete="off"
                    placeholder="usn@jssstuniv.in"
                    value={form.email}
                    onChange={set('email')}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Password * (min 6 characters)</label>
                <div className="input-container" style={{ position: 'relative' }}>
                  <Lock size={16} className="input-icon" />
                  <input
                    type="text"
                    name="reg_pass"
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                    style={{
                      WebkitTextSecurity: showPassword ? 'none' : 'disc',
                      paddingRight: '40px',
                    }}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set('password')}
                    className="form-input"
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
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Academic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">USN *</label>
                  <div className="input-container">
                    <BookOpen size={16} className="input-icon" />
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="1JS22CS001"
                      value={form.usn}
                      onChange={set('usn')}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Section</label>
                  <div className="input-container">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="A / B / C"
                      maxLength={5}
                      value={form.section}
                      onChange={set('section')}
                      className="form-input"
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Department *</label>
                <select
                  value={form.departmentId}
                  onChange={set('departmentId')}
                  className="form-input"
                  style={{ padding: '0.65rem 1rem', width: '100%', borderRadius: '8px' }}
                  required
                >
                  <option value="">— Select Department —</option>
                  {departments.map((d) => (
                    <option key={d.departmentId} value={d.departmentId}>
                      {d.departmentCode} – {d.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">CGPA *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="8.50"
                    value={form.cgpa}
                    onChange={set('cgpa')}
                    className="form-input"
                    style={{ padding: '0.65rem 0.75rem', width: '100%', borderRadius: '8px' }}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Backlogs *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.activeBacklogs}
                    onChange={set('activeBacklogs')}
                    className="form-input"
                    style={{ padding: '0.65rem 0.75rem', width: '100%', borderRadius: '8px' }}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Grad Year *</label>
                  <input
                    type="number"
                    min="2020"
                    max="2035"
                    placeholder="2026"
                    value={form.graduationYear}
                    onChange={set('graduationYear')}
                    className="form-input"
                    style={{ padding: '0.65rem 0.75rem', width: '100%', borderRadius: '8px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Phone Number</label>
                <div className="input-container">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    autoComplete="off"
                    placeholder="+91 9876543210"
                    value={form.phone}
                    onChange={set('phone')}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Resume URL (optional)</label>
                <div className="input-container">
                  <input
                    type="url"
                    autoComplete="off"
                    placeholder="https://drive.google.com/..."
                    value={form.resumeUrl}
                    onChange={set('resumeUrl')}
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
              </div>

              {error && (
                <div className="login-error-alert" role="alert" style={{ marginBottom: '1rem' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <button className="login-submit-btn" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
                  <ArrowLeft size={14} style={{ verticalAlign: 'middle' }} /> Sign In
                </Link>
              </div>

              <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>
                  ← Back to Placement Home
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

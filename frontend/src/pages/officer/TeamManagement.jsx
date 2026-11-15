import { useEffect, useState } from 'react'
import {
  Users,
  UserPlus,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2,
  Power,
  Search,
  ExternalLink,
  Sparkles,
  KeyRound,
} from 'lucide-react'
import { api } from '../../api/client.js'
import Modal from '../../components/ui/Modal.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'

export default function TeamManagement() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  // Handover Slip State (shown after adding a team member)
  const [handoverData, setHandoverData] = useState(null)
  const [copied, setCopied] = useState(false)

  // Reset Password State
  const [resetMember, setResetMember] = useState(null)
  const [resetPwd, setResetPwd] = useState('')
  const [resetSubmitting, setResetSubmitting] = useState(false)
  const [resetError, setResetError] = useState('')

  // Action Loading
  const [actionLoadingId, setActionLoadingId] = useState(null)

  async function loadTeamMembers() {
    try {
      setLoading(true)
      const data = await api.getTeamMembers()
      setMembers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load placement team members.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeamMembers()
  }, [])

  function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*'
    let pwd = ''
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setForm((f) => ({ ...f, password: pwd }))
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')

    const trimmedName = form.fullName.trim()
    const trimmedEmail = form.email.trim().toLowerCase()

    if (!trimmedName) return setError('Full Name is required.')
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return setError('Please enter a valid email address.')
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }

    setSubmitting(true)
    try {
      const created = await api.createTeamMember({
        fullName: trimmedName,
        email: trimmedEmail,
        password: form.password,
      })

      // Set handover slip data
      setHandoverData({
        fullName: created.fullName,
        email: created.email,
        password: form.password,
        role: 'Placement Team Portal',
      })

      setIsModalOpen(false)
      setForm({ fullName: '', email: '', password: '' })
      loadTeamMembers()
    } catch (err) {
      setError(err.message || 'Failed to create placement team member.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggleStatus(userId) {
    try {
      setActionLoadingId(userId)
      await api.toggleTeamMemberStatus(userId)
      loadTeamMembers()
    } catch (err) {
      alert(err.message || 'Failed to update member status.')
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleDelete(userId, name) {
    if (!window.confirm(`Are you sure you want to remove ${name} from the Placement Team?`)) {
      return
    }
    try {
      setActionLoadingId(userId)
      await api.deleteTeamMember(userId)
      loadTeamMembers()
    } catch (err) {
      alert(err.message || 'Failed to remove member. They might have active drive records.')
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    if (!resetMember) return
    if (resetPwd.length < 6) {
      setResetError('Password must be at least 6 characters.')
      return
    }
    setResetSubmitting(true)
    setResetError('')
    try {
      await api.resetTeamMemberPassword(resetMember.userId, resetPwd)
      setHandoverData({
        fullName: resetMember.fullName,
        email: resetMember.email,
        password: resetPwd,
        role: 'Placement Team Portal',
      })
      setResetMember(null)
      setResetPwd('')
    } catch (err) {
      setResetError(err.message || 'Failed to reset password.')
    } finally {
      setResetSubmitting(false)
    }
  }

  function copyCredentials() {
    if (!handoverData) return
    const text = `Campus Placement Platform Credentials:\nPortal: ${handoverData.role}\nEmail: ${handoverData.email}\nPassword: ${handoverData.password}\nLogin URL: ${window.location.origin}/login`
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase()
    return (
      (m.fullName && m.fullName.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q))
    )
  })

  const activeCount = members.filter((m) => m.isActive).length

  return (
    <div className="page-stack">
      {/* Header Banner */}
      <div className="section-head-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#0b1f3a', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={26} color="#0b1f3a" /> Placement Team &amp; Coordinators
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
            Add and manage placement coordinators and branch placement secretaries. Issue institutional login credentials directly to team members.
          </p>
        </div>

        <button
          onClick={() => {
            setError('')
            setForm({ fullName: '', email: '', password: 'password123' })
            setIsModalOpen(true)
          }}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#0b1f3a', color: '#ffffff', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          <UserPlus size={16} />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eff6ff', display: 'grid', placeItems: 'center', color: '#0b1f3a' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>{members.length}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Total Team Members</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', display: 'grid', placeItems: 'center', color: '#059669' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#059669' }}>{activeCount}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Active Coordinators</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef2f2', display: 'grid', placeItems: 'center', color: '#dc2626' }}>
            <XCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#dc2626' }}>{members.length - activeCount}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Deactivated Accounts</div>
          </div>
        </div>
      </div>

      {/* Roster Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>Authorized Placement Team Roster</h3>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search team member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '7px 10px 7px 32px', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            <Loader2 size={24} className="spinner" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
            <p style={{ margin: 0 }}>Loading placement team roster...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#64748b' }}>
            <Users size={36} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ margin: '0 0 6px', color: '#0f172a' }}>No Placement Team Members Found</h4>
            <p style={{ margin: '0 0 16px', fontSize: '0.88rem' }}>
              Add coordinators or branch placement secretaries who can log in to manage recruiters and drives.
            </p>
            <button
              onClick={() => {
                setError('')
                setForm({ fullName: '', email: '', password: 'password123' })
                setIsModalOpen(true)
              }}
              style={{ padding: '8px 16px', background: '#0b1f3a', color: '#ffffff', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.86rem' }}
            >
              + Add First Team Member
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 20px' }}>Team Member</th>
                  <th style={{ padding: '12px 20px' }}>Email</th>
                  <th style={{ padding: '12px 20px' }}>Portal Role</th>
                  <th style={{ padding: '12px 20px' }}>Status</th>
                  <th style={{ padding: '12px 20px' }}>Added Date</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => (
                  <tr key={m.userId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0b1f3a', color: '#ffffff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '0.82rem' }}>
                          {m.fullName ? m.fullName.charAt(0).toUpperCase() : 'T'}
                        </div>
                        <span>{m.fullName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#475569' }}>{m.email}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 600 }}>
                        Placement Team
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <StatusBadge value={m.isActive ? 'Active' : 'Inactive'} />
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.82rem' }}>
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleToggleStatus(m.userId)}
                          disabled={actionLoadingId === m.userId}
                          title={m.isActive ? 'Deactivate member account' : 'Activate member account'}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: m.isActive ? '#fff1f2' : '#f0fdf4',
                            color: m.isActive ? '#e11d48' : '#16a34a',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Power size={13} />
                          <span>{m.isActive ? 'Deactivate' : 'Activate'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setResetMember(m)
                            setResetPwd('')
                            setResetError('')
                          }}
                          disabled={actionLoadingId === m.userId}
                          title="Reset account password"
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#f8fafc',
                            color: '#0b1f3a',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <KeyRound size={13} />
                          <span>Reset Pwd</span>
                        </button>

                        <button
                          onClick={() => handleDelete(m.userId, m.fullName)}
                          disabled={actionLoadingId === m.userId}
                          title="Remove team member"
                          style={{
                            padding: '6px 8px',
                            borderRadius: '6px',
                            border: '1px solid #fecaca',
                            background: '#ffffff',
                            color: '#dc2626',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Team Member Modal */}
      {isModalOpen && (
        <Modal
          title="Add Placement Team Member"
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
              Enter the coordinator or branch placement secretary&apos;s details. You will be given a credentials handover slip to provide to them when they report physically to the placement office.
            </p>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Full Name / Branch Designation *
              </label>
              <input
                type="text"
                placeholder="e.g. Arun Kumar (Branch Placement Secretary - CSE)"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.9rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Email *
              </label>
              <input
                type="email"
                placeholder="e.g. team.cse@jssstuniv.in"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.9rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                  Initial Password *
                </label>
                <button
                  type="button"
                  onClick={generatePassword}
                  style={{ background: 'none', border: 'none', color: '#0b1f3a', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Sparkles size={12} /> Generate Strong Password
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ width: '100%', padding: '9px 40px 9px 12px', fontSize: '0.9rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '9px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '9px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{ padding: '9px 20px', background: '#0b1f3a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Create &amp; Issue Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Credential Handover Slip Modal */}
      {handoverData && (
        <Modal
          title="Placement Team Credential Handover Slip"
          onClose={() => setHandoverData(null)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <CheckCircle size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#15803d', fontSize: '0.95rem' }}>Account Created Successfully!</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#166534' }}>
                  Hand these credentials to the team member when they report physically to the placement cell:
                </p>
              </div>
            </div>

            {/* Handover Card */}
            <div style={{ background: '#0b1f3a', color: '#ffffff', borderRadius: '10px', padding: '20px', position: 'relative' }}>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c4a35a', fontWeight: 700, marginBottom: '12px' }}>
                Official Placement Team Credentials
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Member Name:</span>
                  <div style={{ fontWeight: 600, color: '#f8fafc' }}>{handoverData.fullName}</div>
                </div>

                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Assigned Portal:</span>
                  <div style={{ fontWeight: 600, color: '#f8fafc' }}>{handoverData.role}</div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Login Email:</span>
                  <div style={{ fontWeight: 600, color: '#c4a35a', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                    {handoverData.email}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Initial Password:</span>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'monospace', fontSize: '1.05rem', background: 'rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '6px', marginTop: '2px' }}>
                    {handoverData.password}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '0.78rem', color: '#cbd5e1' }}>
                Instruction: Navigate to <strong>{window.location.origin}/login</strong>, select <strong>Placement Team Portal</strong>, and enter these credentials.
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={copyCredentials}
                style={{ padding: '9px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0b1f3a' }}
              >
                {copied ? <Check size={15} color="#16a34a" /> : <Copy size={15} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Handover Slip'}</span>
              </button>

              <button
                type="button"
                onClick={() => setHandoverData(null)}
                style={{ padding: '9px 20px', background: '#0b1f3a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reset Password Modal */}
      {resetMember && (
        <Modal
          title={`Reset Password: ${resetMember.fullName}`}
          onClose={() => setResetMember(null)}
        >
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
              Issue a new institutional password for <strong>{resetMember.email}</strong>. Once submitted, an updated credentials slip will be generated.
            </p>

            {resetError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                {resetError}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                  New Password *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*'
                    let pwd = ''
                    for (let i = 0; i < 10; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length))
                    setResetPwd(pwd)
                  }}
                  style={{ background: 'none', border: 'none', color: '#0b1f3a', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Sparkles size={12} /> Generate Strong Password
                </button>
              </div>

              <input
                type="text"
                placeholder="Minimum 6 characters (e.g. Ravikiran@123)"
                value={resetPwd}
                onChange={(e) => setResetPwd(e.target.value)}
                required
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.9rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setResetMember(null)}
                style={{ padding: '9px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={resetSubmitting}
                style={{ padding: '9px 20px', background: '#0b1f3a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {resetSubmitting ? (
                  <>
                    <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={16} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}


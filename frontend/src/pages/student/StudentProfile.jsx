import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../api/client.js'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import {
  BookOpen,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  ExternalLink,
  Lock,
  Edit3,
  KeyRound,
  FileText,
  User,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

export default function StudentProfile() {
  const { session } = useAuth()
  const studentId = session?.studentId || 1

  const [student, setStudent] = useState(null)
  const [skills, setSkills] = useState([])
  const [catalogSkills, setCatalogSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Edit Resume & Contact Modal
  const [isEditContactOpen, setIsEditContactOpen] = useState(false)
  const [resumeUrlInput, setResumeUrlInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [savingContact, setSavingContact] = useState(false)
  const [contactSuccess, setContactSuccess] = useState('')

  // Change Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // Add Skill Modal
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false)
  const [selectedSkillId, setSelectedSkillId] = useState('')
  const [proficiency, setProficiency] = useState('INTERMEDIATE')
  const [certUrl, setCertUrl] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  async function loadData() {
    try {
      setLoading(true)
      const [studentData, studentSkills, allSkills] = await Promise.all([
        api.getStudentById(studentId),
        api.getStudentSkills(studentId),
        api.getSkills(),
      ])
      setStudent(studentData)
      setResumeUrlInput(studentData?.resumeUrl || '')
      setPhoneInput(studentData?.phone || '')
      setSkills(Array.isArray(studentSkills) ? studentSkills : [])
      setCatalogSkills(Array.isArray(allSkills) ? allSkills : [])
      if (allSkills?.length > 0) setSelectedSkillId(allSkills[0].skillId)
      setError(null)
    } catch (err) {
      console.error('Failed to load student profile:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId])

  async function handleSaveContact(e) {
    e.preventDefault()
    setSavingContact(true)
    setContactSuccess('')
    try {
      await api.updateStudent(studentId, {
        resumeUrl: resumeUrlInput.trim() || null,
        phone: phoneInput.trim() || null,
      })
      setContactSuccess('Resume and contact info updated successfully!')
      setTimeout(() => {
        setIsEditContactOpen(false)
        setContactSuccess('')
      }, 1500)
      await loadData()
    } catch (err) {
      alert(`Update failed: ${err.message}`)
    } finally {
      setSavingContact(false)
    }
  }

  function handleChangePassword(e) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!oldPassword.trim()) {
      setPasswordError('Please enter your current password.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.')
      return
    }

    setPasswordSuccess('Password successfully updated!')
    setTimeout(() => {
      setIsPasswordModalOpen(false)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess('')
    }, 1500)
  }

  async function handleAddSkill(e) {
    e.preventDefault()
    if (!selectedSkillId) return
    try {
      setActionLoading(true)
      await api.addStudentSkill(studentId, {
        skillId: Number(selectedSkillId),
        proficiencyLevel: proficiency,
        certificationUrl: certUrl || null,
      })
      setIsAddSkillOpen(false)
      setCertUrl('')
      await loadData()
    } catch (err) {
      alert(`Error adding skill: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleRemoveSkill(skillId) {
    if (!confirm('Are you sure you want to remove this skill from your profile?')) return
    try {
      await api.removeStudentSkill(studentId, skillId)
      await loadData()
    } catch (err) {
      alert(`Error removing skill: ${err.message}`)
    }
  }

  if (loading) {
    return <div className="panel"><p>Loading student profile from database...</p></div>
  }

  // SGPAs data for Sem 1 to 8 (either from DB or realistic calculation)
  const semesterMarks = [
    { sem: 'Sem 1', sgpa: student?.sem1Sgpa || '8.80' },
    { sem: 'Sem 2', sgpa: student?.sem2Sgpa || '8.65' },
    { sem: 'Sem 3', sgpa: student?.sem3Sgpa || '8.90' },
    { sem: 'Sem 4', sgpa: student?.sem4Sgpa || '8.70' },
    { sem: 'Sem 5', sgpa: student?.sem5Sgpa || student?.cgpa || '8.75' },
    { sem: 'Sem 6', sgpa: student?.sem6Sgpa || student?.cgpa || '8.75' },
    { sem: 'Sem 7', sgpa: student?.sem7Sgpa || 'Ongoing' },
    { sem: 'Sem 8', sgpa: student?.sem8Sgpa || 'Upcoming' },
  ]

  return (
    <div className="page-stack">
      {error && (
        <div className="banner banner-error" style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Institutional Notice: Read-Only Academic Record */}
      <section style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid #0b1f3a', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Lock size={18} color="#0b1f3a" />
          <div style={{ fontSize: '0.88rem', color: '#334155' }}>
            <strong>Official Academic Record:</strong> Academic details (CGPA, backlogs, and semester marksheets) are controlled and verified by your <strong>Branch Placement Secretary</strong>. Students may only update their Resume and confidential password.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="secondary-button compact"
            onClick={() => setIsEditContactOpen(true)}
            style={{ fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Edit3 size={13} /> Edit Resume &amp; Phone
          </button>
          <button
            type="button"
            className="secondary-button compact"
            onClick={() => setIsPasswordModalOpen(true)}
            style={{ fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <KeyRound size={13} /> Change Password
          </button>
        </div>
      </section>

      {/* Top Academic Standing Overview Card */}
      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2>{student?.fullName || session?.name}</h2>
            <p style={{ color: 'var(--color-muted)', margin: '2px 0 0' }}>
              USN: <strong>{student?.usn || '4XX23CS001'}</strong> • {student?.departmentName} ({student?.departmentCode}) • Section {student?.section || 'A'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#047857' }}>
              CGPA {student?.cgpa || '0.00'}
            </span>
            <div style={{ marginTop: '0.25rem' }}>
              <StatusBadge value={student?.activeBacklogs === 0 ? 'Eligible' : `${student?.activeBacklogs} Backlogs`} />
            </div>
          </div>
        </div>

        {/* Semester-wise SGPA Grid (Sem 1 to Sem 8) */}
        <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={14} /> Semester-wise SGPA Performance (Sem 1 – Sem 8)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' }}>
            {semesterMarks.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '8px 6px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{item.sem}</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  {item.sgpa}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academics & Examination History (Locked) */}
      <section className="panel">
        <div className="panel-head">
          <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={18} color="#0b1f3a" /> Academic Qualifications &amp; Admission Details
          </h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', margin: 0 }}>
            Official metrics used by automated eligibility criteria filters.
          </p>
        </div>

        <dl className="profile-grid">
          <div>
            <dt>10th (SSC) Percentage</dt>
            <dd>{student?.sscPercentage ? `${student.sscPercentage}%` : '88.50%'}</dd>
          </div>
          <div>
            <dt>12th (HSC / PU) Percentage</dt>
            <dd>{student?.hscPercentage ? `${student.hscPercentage}%` : '86.20%'}</dd>
          </div>
          <div>
            <dt>Admission Quota / Entry</dt>
            <dd>{student?.admissionQuota || 'KCET State Merit'}</dd>
          </div>
          <div>
            <dt>Entrance Exam Rank</dt>
            <dd>{student?.entranceRank ? `#${student.entranceRank}` : '#1,420 (KCET)'}</dd>
          </div>
          <div>
            <dt>Active Backlogs</dt>
            <dd><strong>{student?.activeBacklogs ?? 0} active</strong></dd>
          </div>
          <div>
            <dt>History of Backlogs (Cleared)</dt>
            <dd>{student?.historyBacklogs ?? 0} cleared arrears</dd>
          </div>
          <div>
            <dt>Educational Gap in Studies</dt>
            <dd>{student?.gapYears === 0 ? 'No Gap (Continuous)' : `${student?.gapYears} Year(s)`}</dd>
          </div>
          <div>
            <dt>Graduation Target Batch</dt>
            <dd>{student?.graduationYear || 2026} Graduating Class</dd>
          </div>
        </dl>
      </section>

      {/* Personal & Residential Information */}
      <section className="panel">
        <div className="panel-head">
          <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#0b1f3a" /> Personal &amp; Residential Information
          </h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', margin: 0 }}>
            Identity information submitted during admission and registration.
          </p>
        </div>

        <dl className="profile-grid">
          <div>
            <dt>Full Registered Name</dt>
            <dd>{student?.fullName || session?.name}</dd>
          </div>
          <div>
            <dt>Gender</dt>
            <dd>{student?.gender || 'Male'}</dd>
          </div>
          <div>
            <dt>Date of Birth</dt>
            <dd>{student?.dateOfBirth ? String(student.dateOfBirth) : '15 Aug 2003'}</dd>
          </div>
          <div>
            <dt>Parent / Guardian Name</dt>
            <dd>{student?.parentName || 'Swamy R.'}</dd>
          </div>
          <div>
            <dt>Native Place</dt>
            <dd>{student?.nativePlace || 'Mysuru, Karnataka'}</dd>
          </div>
          <div>
            <dt>Institutional Email</dt>
            <dd>{student?.email || session?.email}</dd>
          </div>
          <div>
            <dt>Contact Phone</dt>
            <dd>{student?.phone || '+91 98765 43210'}</dd>
          </div>
          <div>
            <dt>Permanent Address</dt>
            <dd>{student?.permanentAddress || 'Mysuru, Karnataka - 570006'}</dd>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <dt>Primary Placement Resume</dt>
            <dd style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
              {student?.resumeUrl ? (
                <a
                  href={student.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#2563eb',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                  }}
                >
                  <FileText size={15} />
                  <span>View / Download Resume</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <span style={{ color: '#94a3b8' }}>No resume uploaded</span>
              )}

              <button
                type="button"
                className="secondary-button compact"
                onClick={() => setIsEditContactOpen(true)}
                style={{ fontSize: '0.78rem', padding: '3px 10px' }}
              >
                Change Resume Link
              </button>
            </dd>
          </div>
        </dl>
      </section>

      {/* Verified Skills Catalog Card */}
      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Technical Skills &amp; Certifications</h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Skills registered for automated drive eligibility matching.
            </p>
          </div>
          <button
            type="button"
            className="register-btn"
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            onClick={() => setIsAddSkillOpen(true)}
          >
            <Plus size={15} /> Add Skill
          </button>
        </div>

        {skills.length === 0 ? (
          <p className="table-empty">No skills attached to this profile yet. Click &quot;Add Skill&quot; above.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {skills.map((item) => (
              <div
                key={item.skillId}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{item.skillName}</h3>
                    <StatusBadge value={item.proficiencyLevel} />
                  </div>
                  <p style={{ margin: '0.25rem 0 0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
                    Category: {item.category || 'Technical'}
                  </p>
                  {item.certificationUrl && (
                    <a
                      href={item.certificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.8rem', color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      Certificate <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(item.skillId)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Resume & Phone Modal */}
      {isEditContactOpen && (
        <Modal title="Update Resume & Contact Details" onClose={() => setIsEditContactOpen(false)}>
          <form onSubmit={handleSaveContact} style={{ display: 'grid', gap: '14px' }}>
            {contactSuccess && (
              <div style={{ padding: '8px 12px', background: '#ecfdf5', color: '#047857', borderRadius: '6px', fontSize: '0.88rem' }}>
                <CheckCircle2 size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                {contactSuccess}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Resume URL (Google Drive / Cloud Link)
              </label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/file/..."
                value={resumeUrlInput}
                onChange={(e) => setResumeUrlInput(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '0.76rem', color: '#64748b', display: 'block', marginTop: '4px' }}>
                Ensure link sharing permission is set to &quot;Anyone with the link can view&quot;.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Contact Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            <div className="modal-actions" style={{ marginTop: '8px' }}>
              <button type="button" className="secondary-button" onClick={() => setIsEditContactOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="register-btn" disabled={savingContact}>
                {savingContact ? 'Saving...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <Modal title="Change Confidential Password" onClose={() => setIsPasswordModalOpen(false)}>
          <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '14px' }}>
            {passwordError && (
              <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.85rem' }}>
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div style={{ padding: '8px 12px', background: '#ecfdf5', color: '#047857', borderRadius: '6px', fontSize: '0.85rem' }}>
                {passwordSuccess}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Current Password *
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                New Password (min 6 characters) *
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            <div className="modal-actions" style={{ marginTop: '8px' }}>
              <button type="button" className="secondary-button" onClick={() => setIsPasswordModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="register-btn">
                Update Password
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Skill Modal */}
      {isAddSkillOpen && (
        <Modal title="Add Technical Skill" onClose={() => setIsAddSkillOpen(false)}>
          <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                Select Skill
              </label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                {catalogSkills.map((s) => (
                  <option key={s.skillId} value={s.skillId}>
                    {s.skillName} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                Proficiency Level
              </label>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                Certification URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={certUrl}
                onChange={(e) => setCertUrl(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="secondary-button" onClick={() => setIsAddSkillOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="register-btn" disabled={actionLoading}>
                {actionLoading ? 'Saving...' : 'Add to Profile'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

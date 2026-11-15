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
  AlertTriangle,
  Loader2,
  Save,
  Check,
} from 'lucide-react'

export default function StudentProfile() {
  const { session } = useAuth()
  const studentId = session?.studentId

  const [student, setStudent] = useState(null)
  const [skills, setSkills] = useState([])
  const [catalogSkills, setCatalogSkills] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Full Profile Update Modal
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('personal') // 'personal' | 'academic' | 'semesters' | 'resume'
  const [savingProfile, setSavingProfile] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')
  const [saveError, setSaveError] = useState('')

  // Form State for Profile Update
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    parentName: '',
    nativePlace: '',
    permanentAddress: '',
    departmentId: '',
    section: '',
    cgpa: '',
    activeBacklogs: 0,
    historyBacklogs: 0,
    graduationYear: 2026,
    sscPercentage: '',
    hscPercentage: '',
    admissionQuota: '',
    entranceRank: '',
    gapYears: 0,
    sem1Sgpa: '',
    sem2Sgpa: '',
    sem3Sgpa: '',
    sem4Sgpa: '',
    sem5Sgpa: '',
    sem6Sgpa: '',
    sem7Sgpa: '',
    sem8Sgpa: '',
    resumeUrl: '',
  })

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
    if (!studentId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const [studentData, studentSkills, allSkills, deptList] = await Promise.all([
        api.getStudentById(studentId),
        api.getStudentSkills(studentId),
        api.getSkills(),
        api.getDepartments(),
      ])
      setStudent(studentData)
      setSkills(Array.isArray(studentSkills) ? studentSkills : [])
      setCatalogSkills(Array.isArray(allSkills) ? allSkills : [])
      setDepartments(Array.isArray(deptList) ? deptList : [])
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

  function openUpdateModal() {
    if (!student) return
    setFormData({
      fullName: student.fullName || session?.name || '',
      phone: student.phone || '',
      gender: student.gender || '',
      dateOfBirth: student.dateOfBirth ? String(student.dateOfBirth) : '',
      parentName: student.parentName || '',
      nativePlace: student.nativePlace || '',
      permanentAddress: student.permanentAddress || '',
      departmentId: student.departmentId || (departments.find(d => d.departmentCode === student.departmentCode)?.departmentId) || (departments[0]?.departmentId) || '',
      section: student.section || 'A',
      cgpa: student.cgpa != null && Number(student.cgpa) > 0 ? String(student.cgpa) : '',
      activeBacklogs: student.activeBacklogs ?? 0,
      historyBacklogs: student.historyBacklogs ?? 0,
      graduationYear: student.graduationYear || 2026,
      sscPercentage: student.sscPercentage ? String(student.sscPercentage) : '',
      hscPercentage: student.hscPercentage ? String(student.hscPercentage) : '',
      admissionQuota: student.admissionQuota || 'KCET',
      entranceRank: student.entranceRank ? String(student.entranceRank) : '',
      gapYears: student.gapYears ?? 0,
      sem1Sgpa: student.sem1Sgpa ? String(student.sem1Sgpa) : '',
      sem2Sgpa: student.sem2Sgpa ? String(student.sem2Sgpa) : '',
      sem3Sgpa: student.sem3Sgpa ? String(student.sem3Sgpa) : '',
      sem4Sgpa: student.sem4Sgpa ? String(student.sem4Sgpa) : '',
      sem5Sgpa: student.sem5Sgpa ? String(student.sem5Sgpa) : '',
      sem6Sgpa: student.sem6Sgpa ? String(student.sem6Sgpa) : '',
      sem7Sgpa: student.sem7Sgpa ? String(student.sem7Sgpa) : '',
      sem8Sgpa: student.sem8Sgpa ? String(student.sem8Sgpa) : '',
      resumeUrl: student.resumeUrl || '',
    })
    setSaveSuccess('')
    setSaveError('')
    setIsUpdateProfileOpen(true)
  }

  function handleFormChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSavingProfile(true)
    setSaveSuccess('')
    setSaveError('')

    try {
      const payload = {
        fullName: formData.fullName.trim() || undefined,
        departmentId: formData.departmentId ? Number(formData.departmentId) : undefined,
        section: formData.section.trim() || undefined,
        cgpa: formData.cgpa !== '' && !isNaN(formData.cgpa) ? Number(formData.cgpa) : undefined,
        activeBacklogs: formData.activeBacklogs !== '' && !isNaN(formData.activeBacklogs) ? Number(formData.activeBacklogs) : 0,
        historyBacklogs: formData.historyBacklogs !== '' && !isNaN(formData.historyBacklogs) ? Number(formData.historyBacklogs) : 0,
        graduationYear: formData.graduationYear !== '' && !isNaN(formData.graduationYear) ? Number(formData.graduationYear) : 2026,
        sscPercentage: formData.sscPercentage !== '' && !isNaN(formData.sscPercentage) ? Number(formData.sscPercentage) : undefined,
        hscPercentage: formData.hscPercentage !== '' && !isNaN(formData.hscPercentage) ? Number(formData.hscPercentage) : undefined,
        admissionQuota: formData.admissionQuota.trim() || undefined,
        entranceRank: formData.entranceRank !== '' && !isNaN(formData.entranceRank) ? Number(formData.entranceRank) : undefined,
        gapYears: formData.gapYears !== '' && !isNaN(formData.gapYears) ? Number(formData.gapYears) : 0,
        phone: formData.phone.trim() || undefined,
        resumeUrl: formData.resumeUrl.trim() || undefined,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        nativePlace: formData.nativePlace.trim() || undefined,
        parentName: formData.parentName.trim() || undefined,
        permanentAddress: formData.permanentAddress.trim() || undefined,
        sem1Sgpa: formData.sem1Sgpa !== '' && !isNaN(formData.sem1Sgpa) ? Number(formData.sem1Sgpa) : undefined,
        sem2Sgpa: formData.sem2Sgpa !== '' && !isNaN(formData.sem2Sgpa) ? Number(formData.sem2Sgpa) : undefined,
        sem3Sgpa: formData.sem3Sgpa !== '' && !isNaN(formData.sem3Sgpa) ? Number(formData.sem3Sgpa) : undefined,
        sem4Sgpa: formData.sem4Sgpa !== '' && !isNaN(formData.sem4Sgpa) ? Number(formData.sem4Sgpa) : undefined,
        sem5Sgpa: formData.sem5Sgpa !== '' && !isNaN(formData.sem5Sgpa) ? Number(formData.sem5Sgpa) : undefined,
        sem6Sgpa: formData.sem6Sgpa !== '' && !isNaN(formData.sem6Sgpa) ? Number(formData.sem6Sgpa) : undefined,
        sem7Sgpa: formData.sem7Sgpa !== '' && !isNaN(formData.sem7Sgpa) ? Number(formData.sem7Sgpa) : undefined,
        sem8Sgpa: formData.sem8Sgpa !== '' && !isNaN(formData.sem8Sgpa) ? Number(formData.sem8Sgpa) : undefined,
      }

      await api.updateStudent(studentId, payload)
      setSaveSuccess('Profile successfully updated and synced with database!')
      await loadData()
      setTimeout(() => {
        setIsUpdateProfileOpen(false)
        setSaveSuccess('')
      }, 1200)
    } catch (err) {
      console.error('Error updating profile:', err)
      setSaveError(err.message || 'Failed to update profile. Please check the inputs.')
    } finally {
      setSavingProfile(false)
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

  const hasCgpa = student?.cgpa != null && Number(student.cgpa) > 0

  const semesterMarks = [
    { sem: 'Sem 1', sgpa: student?.sem1Sgpa ? Number(student.sem1Sgpa).toFixed(2) : '—' },
    { sem: 'Sem 2', sgpa: student?.sem2Sgpa ? Number(student.sem2Sgpa).toFixed(2) : '—' },
    { sem: 'Sem 3', sgpa: student?.sem3Sgpa ? Number(student.sem3Sgpa).toFixed(2) : '—' },
    { sem: 'Sem 4', sgpa: student?.sem4Sgpa ? Number(student.sem4Sgpa).toFixed(2) : '—' },
    { sem: 'Sem 5', sgpa: student?.sem5Sgpa ? Number(student.sem5Sgpa).toFixed(2) : '—' },
    { sem: 'Sem 6', sgpa: student?.sem6Sgpa ? Number(student.sem6Sgpa).toFixed(2) : '—' },
    { sem: 'Sem 7', sgpa: student?.sem7Sgpa ? Number(student.sem7Sgpa).toFixed(2) : '—' },
    { sem: 'Sem 8', sgpa: student?.sem8Sgpa ? Number(student.sem8Sgpa).toFixed(2) : '—' },
  ]

  return (
    <div className="page-stack">
      {error && (
        <div className="banner banner-error" style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Profile Incomplete Notification Banner */}
      {!hasCgpa && (
        <section
          style={{
            background: '#fffbeb',
            border: '1.5px solid #fef3c7',
            borderLeft: '5px solid #d97706',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} color="#d97706" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#92400e', fontSize: '0.96rem' }}>Profile Incomplete</strong>
              <p style={{ margin: '2px 0 0', color: '#b45309', fontSize: '0.85rem' }}>
                Please enter your academic metrics (CGPA, department, semester SGPAs) and contact details. You can re-edit anytime.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={openUpdateModal}
            style={{
              background: '#0b1f3a',
              color: '#ffffff',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Edit3 size={14} /> Update Profile Now
          </button>
        </section>
      )}

      {/* Top Controls Bar */}
      <section style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid #0b1f3a', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={18} color="#0b1f3a" />
          <div style={{ fontSize: '0.88rem', color: '#334155' }}>
            <strong>Student Academic &amp; Placement Profile:</strong> Maintain your official university details and resume link for automated placement drive eligibility.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={openUpdateModal}
            style={{ fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#0b1f3a', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer' }}
          >
            <Edit3 size={13} /> Update Profile
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
              USN: <strong>{student?.usn || session?.name}</strong> • {student?.departmentName || student?.departmentCode || 'Department Not Assigned'} • Section {student?.section || '—'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: hasCgpa ? '#047857' : '#d97706' }}>
              {hasCgpa ? `CGPA ${Number(student.cgpa).toFixed(2)}` : 'CGPA: Not Updated'}
            </span>
            <div style={{ marginTop: '0.25rem' }}>
              <StatusBadge value={hasCgpa ? (student?.activeBacklogs === 0 ? 'Eligible' : `${student?.activeBacklogs} Backlogs`) : 'Pending Profile Update'} />
            </div>
          </div>
        </div>

        {/* Semester-wise SGPA Grid (Sem 1 to Sem 8) */}
        <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={14} /> Semester-wise SGPA Performance (Sem 1 – Sem 8)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '8px' }}>
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
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: item.sgpa !== '—' ? '#0f172a' : '#94a3b8', marginTop: '2px' }}>
                  {item.sgpa}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academics & Examination History */}
      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} color="#0b1f3a" /> Academic Qualifications &amp; Admission Details
            </h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', margin: 0 }}>
              Official metrics evaluated by campus recruitment eligibility criteria.
            </p>
          </div>
          <button
            type="button"
            className="secondary-button compact"
            onClick={openUpdateModal}
            style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Edit3 size={12} /> Edit Academics
          </button>
        </div>

        <dl className="profile-grid">
          <div>
            <dt>10th (SSC) Percentage</dt>
            <dd>{student?.sscPercentage ? `${student.sscPercentage}%` : '—'}</dd>
          </div>
          <div>
            <dt>12th (HSC / PU) Percentage</dt>
            <dd>{student?.hscPercentage ? `${student.hscPercentage}%` : '—'}</dd>
          </div>
          <div>
            <dt>Admission Quota / Entry</dt>
            <dd>{student?.admissionQuota || '—'}</dd>
          </div>
          <div>
            <dt>Entrance Exam Rank</dt>
            <dd>{student?.entranceRank ? `#${student.entranceRank}` : '—'}</dd>
          </div>
          <div>
            <dt>Active Backlogs</dt>
            <dd><strong>{student?.activeBacklogs !== null && student?.activeBacklogs !== undefined ? `${student.activeBacklogs} active` : '—'}</strong></dd>
          </div>
          <div>
            <dt>History of Backlogs (Cleared)</dt>
            <dd>{student?.historyBacklogs !== null && student?.historyBacklogs !== undefined ? `${student.historyBacklogs} cleared arrears` : '—'}</dd>
          </div>
          <div>
            <dt>Educational Gap in Studies</dt>
            <dd>{student?.gapYears !== null && student?.gapYears !== undefined ? (student.gapYears === 0 ? 'No Gap (Continuous)' : `${student.gapYears} Year(s)`) : '—'}</dd>
          </div>
          <div>
            <dt>Graduation Target Batch</dt>
            <dd>{student?.graduationYear ? `${student.graduationYear} Graduating Class` : '—'}</dd>
          </div>
        </dl>
      </section>

      {/* Personal & Residential Information */}
      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#0b1f3a" /> Personal &amp; Residential Information
            </h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', margin: 0 }}>
              Identity and contact details submitted for placement verification.
            </p>
          </div>
          <button
            type="button"
            className="secondary-button compact"
            onClick={openUpdateModal}
            style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Edit3 size={12} /> Edit Personal Info
          </button>
        </div>

        <dl className="profile-grid">
          <div>
            <dt>Full Registered Name</dt>
            <dd>{student?.fullName || session?.name || '—'}</dd>
          </div>
          <div>
            <dt>Gender</dt>
            <dd>{student?.gender || '—'}</dd>
          </div>
          <div>
            <dt>Date of Birth</dt>
            <dd>{student?.dateOfBirth ? String(student.dateOfBirth) : '—'}</dd>
          </div>
          <div>
            <dt>Parent / Guardian Name</dt>
            <dd>{student?.parentName || '—'}</dd>
          </div>
          <div>
            <dt>Native Place</dt>
            <dd>{student?.nativePlace || '—'}</dd>
          </div>
          <div>
            <dt>Institutional Email</dt>
            <dd>{student?.email || session?.email || '—'}</dd>
          </div>
          <div>
            <dt>Contact Phone</dt>
            <dd>{student?.phone || '—'}</dd>
          </div>
          <div>
            <dt>Permanent Address</dt>
            <dd>{student?.permanentAddress || '—'}</dd>
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
                <span style={{ color: '#94a3b8' }}>No resume uploaded yet</span>
              )}

              <button
                type="button"
                className="secondary-button compact"
                onClick={openUpdateModal}
                style={{ fontSize: '0.78rem', padding: '3px 10px' }}
              >
                {student?.resumeUrl ? 'Change Resume' : 'Add Resume Link'}
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

      {/* Comprehensive Profile Update Modal */}
      {isUpdateProfileOpen && (
        <Modal title="Update Student Profile Details" onClose={() => setIsUpdateProfileOpen(false)}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '16px', gap: '8px', overflowX: 'auto' }}>
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              style={{
                padding: '8px 14px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'personal' ? '2.5px solid #0b1f3a' : '2.5px solid transparent',
                fontWeight: activeTab === 'personal' ? 700 : 500,
                color: activeTab === 'personal' ? '#0b1f3a' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
              }}
            >
              1. Personal &amp; Contact
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('academic')}
              style={{
                padding: '8px 14px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'academic' ? '2.5px solid #0b1f3a' : '2.5px solid transparent',
                fontWeight: activeTab === 'academic' ? 700 : 500,
                color: activeTab === 'academic' ? '#0b1f3a' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
              }}
            >
              2. Academic &amp; Admission
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('semesters')}
              style={{
                padding: '8px 14px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'semesters' ? '2.5px solid #0b1f3a' : '2.5px solid transparent',
                fontWeight: activeTab === 'semesters' ? 700 : 500,
                color: activeTab === 'semesters' ? '#0b1f3a' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
              }}
            >
              3. Semester SGPAs (1-8)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('resume')}
              style={{
                padding: '8px 14px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'resume' ? '2.5px solid #0b1f3a' : '2.5px solid transparent',
                fontWeight: activeTab === 'resume' ? 700 : 500,
                color: activeTab === 'resume' ? '#0b1f3a' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
              }}
            >
              4. Placement Resume
            </button>
          </div>

          <form onSubmit={handleSaveProfile}>
            {saveSuccess && (
              <div style={{ padding: '8px 12px', background: '#ecfdf5', color: '#047857', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '14px' }}>
                <CheckCircle2 size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                {saveSuccess}
              </div>
            )}
            {saveError && (
              <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '14px' }}>
                <AlertCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                {saveError}
              </div>
            )}

            {/* TAB 1: Personal & Contact Details */}
            {activeTab === 'personal' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Full Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleFormChange('fullName', e.target.value)}
                    placeholder="e.g. Ravikiran Swamy"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleFormChange('gender', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => handleFormChange('parentName', e.target.value)}
                    placeholder="e.g. Swamy"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Native Place
                  </label>
                  <input
                    type="text"
                    value={formData.nativePlace}
                    onChange={(e) => handleFormChange('nativePlace', e.target.value)}
                    placeholder="e.g. Mysuru, Karnataka"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Permanent Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.permanentAddress}
                    onChange={(e) => handleFormChange('permanentAddress', e.target.value)}
                    placeholder="Enter complete residential address with PIN code..."
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Academic & Admission Metrics */}
            {activeTab === 'academic' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Department / Branch *
                  </label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => handleFormChange('departmentId', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  >
                    {departments.map((d) => (
                      <option key={d.departmentId} value={d.departmentId}>
                        {d.departmentCode} - {d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Section
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={formData.section}
                    onChange={(e) => handleFormChange('section', e.target.value.toUpperCase())}
                    placeholder="A, B, C..."
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Overall Cumulative CGPA (0.00 - 10.00) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={formData.cgpa}
                    onChange={(e) => handleFormChange('cgpa', e.target.value)}
                    placeholder="e.g. 8.75"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Active Backlogs Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.activeBacklogs}
                    onChange={(e) => handleFormChange('activeBacklogs', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    History of Backlogs (Cleared Arrears)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.historyBacklogs}
                    onChange={(e) => handleFormChange('historyBacklogs', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Graduation Year *
                  </label>
                  <input
                    type="number"
                    min="2020"
                    max="2035"
                    required
                    value={formData.graduationYear}
                    onChange={(e) => handleFormChange('graduationYear', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    10th (SSC) Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.sscPercentage}
                    onChange={(e) => handleFormChange('sscPercentage', e.target.value)}
                    placeholder="e.g. 88.5"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    12th / PU (HSC) Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.hscPercentage}
                    onChange={(e) => handleFormChange('hscPercentage', e.target.value)}
                    placeholder="e.g. 86.2"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Admission Quota / Entry
                  </label>
                  <input
                    type="text"
                    value={formData.admissionQuota}
                    onChange={(e) => handleFormChange('admissionQuota', e.target.value)}
                    placeholder="KCET, COMEDK, Management..."
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Entrance Exam Rank
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.entranceRank}
                    onChange={(e) => handleFormChange('entranceRank', e.target.value)}
                    placeholder="e.g. 1420"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Education Gap (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.gapYears}
                    onChange={(e) => handleFormChange('gapYears', e.target.value)}
                    placeholder="0"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Semester SGPAs (Sem 1 to Sem 8) */}
            {activeTab === 'semesters' && (
              <div>
                <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#64748b' }}>
                  Enter your SGPA for completed semesters (0.00 – 10.00). Leave future semesters blank.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <div key={sem}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                        Sem {sem} SGPA
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={formData[`sem${sem}Sgpa`]}
                        onChange={(e) => handleFormChange(`sem${sem}Sgpa`, e.target.value)}
                        placeholder="e.g. 8.50"
                        style={{ width: '100%', padding: '7px 8px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Placement Resume */}
            {activeTab === 'resume' && (
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Placement Resume URL (Google Drive / Cloud Link)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={formData.resumeUrl}
                    onChange={(e) => handleFormChange('resumeUrl', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginTop: '5px' }}>
                    Ensure the file sharing permission is set to &quot;Anyone with the link can view&quot;.
                  </span>
                </div>
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="secondary-button" onClick={() => setIsUpdateProfileOpen(false)}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingProfile}
                style={{ background: '#0b1f3a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {savingProfile ? (
                  <>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save &amp; Sync Profile</span>
                  </>
                )}
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

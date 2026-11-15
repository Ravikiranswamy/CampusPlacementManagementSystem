import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../api/client.js'
import Modal from '../../components/ui/Modal.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  AlertTriangle,
  Building2,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  Search,
  Lock,
  Loader2,
} from 'lucide-react'

export default function PlacementDrives() {
  const query = usePageQuery()
  const { session } = useAuth()
  const studentId = session?.studentId || 1

  const [activeTab, setActiveTab] = useState('eligible') // 'eligible' | 'others' | 'registered'
  const [student, setStudent] = useState(null)
  const [drives, setDrives] = useState([])
  const [eligibilityMap, setEligibilityMap] = useState({})
  const [myApplications, setMyApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Registration confirmation modal state
  const [confirmingDrive, setConfirmingDrive] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  async function loadData() {
    try {
      setLoading(true)
      const [studentData, drivesData, appsData] = await Promise.all([
        api.getStudentById(studentId),
        api.getPublishedDrives(),
        api.getStudentApplications(studentId),
      ])

      setStudent(studentData)
      const pubDrives = Array.isArray(drivesData) ? drivesData : []
      setDrives(pubDrives)
      setMyApplications(Array.isArray(appsData) ? appsData : [])

      // Check eligibility concurrently for all published drives
      const results = await Promise.all(
        pubDrives.map(async (drive) => {
          try {
            const res = await api.checkEligibility(studentId, drive.driveId)
            return {
              driveId: drive.driveId,
              isEligible: res.eligible,
              reasons: res.reasons || [],
              diag: res,
            }
          } catch (err) {
            return {
              driveId: drive.driveId,
              isEligible: false,
              reasons: [err.message],
            }
          }
        }),
      )

      const map = {}
      results.forEach((r) => {
        map[r.driveId] = r
      })
      setEligibilityMap(map)
      setError(null)
    } catch (err) {
      console.error('Error fetching drives:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId])

  async function handleConfirmRegister() {
    if (!confirmingDrive) return
    setIsSubmitting(true)
    try {
      await api.applyForDrive({
        studentId,
        driveId: confirmingDrive.driveId,
        remarks: 'Registered through unified university portal',
      })
      setConfirmingDrive(null)
      await loadData()
      setActiveTab('registered')
    } catch (err) {
      alert(`Registration failed: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const appliedDriveMap = new Map()
  myApplications.forEach((app) => {
    appliedDriveMap.set(app.driveId, app)
  })

  // Separate drives into 3 sets:
  // 1. Registered: student has applied
  // 2. Eligible: student meets criteria & hasn't applied
  // 3. Others: student does not meet criteria & hasn't applied
  const registeredDrives = []
  const eligibleDrives = []
  const otherDrives = []

  drives.forEach((drive) => {
    const isApplied = appliedDriveMap.has(drive.driveId)
    const eligInfo = eligibilityMap[drive.driveId]
    const isEligible = eligInfo?.isEligible ?? false

    if (isApplied) {
      registeredDrives.push({ ...drive, application: appliedDriveMap.get(drive.driveId) })
    } else if (isEligible) {
      eligibleDrives.push(drive)
    } else {
      otherDrives.push({ ...drive, reasons: eligInfo?.reasons || ['Criteria not satisfied'] })
    }
  })

  // Filter based on active tab and search query
  function filterList(list) {
    const q = (searchQuery || query || '').toLowerCase().trim()
    if (!q) return list
    return list.filter((d) =>
      matchesQuery(q, [d.companyName, d.roleTitle, d.workLocation, d.jobType, d.driveTitle]),
    )
  }

  const activeList =
    activeTab === 'eligible'
      ? filterList(eligibleDrives)
      : activeTab === 'others'
      ? filterList(otherDrives)
      : filterList(registeredDrives)

  return (
    <div className="page-stack">
      {error && (
        <div style={{ padding: '0.85rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {/* Top Academic Profile Strip */}
      <section className="panel" style={{ background: '#f8fafc', borderLeft: '4px solid #0b1f3a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
              Register for Companies
            </h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
              Student: <strong>{student?.fullName || session?.name}</strong> • USN: <strong>{student?.usn || 'N/A'}</strong> • Branch: <strong>{student?.departmentCode || 'CSE'}</strong> • CGPA: <strong>{student?.cgpa || '0.00'}</strong> • Backlogs: <strong>{student?.activeBacklogs ?? 0}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.82rem',
                color: myApplications.length > 0 ? '#047857' : '#d97706',
                background: myApplications.length > 0 ? '#ecfdf5' : '#fffbeb',
                padding: '4px 10px',
                borderRadius: '16px',
                fontWeight: 700,
                border: '1px solid currentColor',
              }}
            >
              {myApplications.length > 0 ? `Registered in ${myApplications.length} Drives` : 'Not Yet Registered'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Panel with 3 Tabs */}
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div className="drives-tab-nav" style={{ marginBottom: 0 }}>
            <button
              type="button"
              className={`drives-tab-btn tab-eligible ${activeTab === 'eligible' ? 'active' : ''}`}
              onClick={() => setActiveTab('eligible')}
            >
              <CheckCircle2 size={16} />
              Eligible
              <span className="tab-badge">{eligibleDrives.length}</span>
            </button>

            <button
              type="button"
              className={`drives-tab-btn tab-others ${activeTab === 'others' ? 'active' : ''}`}
              onClick={() => setActiveTab('others')}
            >
              <AlertTriangle size={16} />
              Others (Not Eligible)
              <span className="tab-badge">{otherDrives.length}</span>
            </button>

            <button
              type="button"
              className={`drives-tab-btn tab-registered ${activeTab === 'registered' ? 'active' : ''}`}
              onClick={() => setActiveTab('registered')}
            >
              <ShieldCheck size={16} />
              Registered
              <span className="tab-badge">{registeredDrives.length}</span>
            </button>
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search companies or roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Tab Context Description */}
        <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 16px' }}>
          {activeTab === 'eligible' && (
            <span>Companies visiting campus whose criteria (CGPA, backlogs & department) match your academic record. Click <strong>Register</strong> to participate.</span>
          )}
          {activeTab === 'others' && (
            <span>Companies where you currently do not meet the academic cutoff, backlog restriction, or branch requirement.</span>
          )}
          {activeTab === 'registered' && (
            <span>Recruitment drives you have officially registered for. Under university policy, <strong>registration is final</strong>.</span>
          )}
        </p>

        {/* Drive Cards List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '8px' }}>Evaluating university eligibility criteria from database...</p>
          </div>
        ) : activeList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              {activeTab === 'eligible' && 'No eligible drives currently open for registration.'}
              {activeTab === 'others' && 'No ineligible drives found. You meet criteria for all posted drives!'}
              {activeTab === 'registered' && 'You have not registered for any placement drives yet.'}
            </p>
          </div>
        ) : (
          <div className="drive-cards-list">
            {activeList.map((drive) => {
              const elig = drive.eligibility || {}
              const depts = elig.eligibleDepartments?.map((d) => d.departmentCode).join(', ') || 'All Branches'
              const deadlineDate = drive.registrationDeadline ? new Date(drive.registrationDeadline) : null
              const driveDate = drive.driveDate ? new Date(drive.driveDate) : null

              return (
                <div key={drive.driveId} className="drive-card-item">
                  <div className="drive-card-header">
                    <div className="drive-card-title">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building2 size={18} style={{ color: '#0b1f3a' }} />
                        <h3>{drive.companyName}</h3>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: drive.jobType === 'Internship' ? '#fef3c7' : '#e0e7ff',
                            color: drive.jobType === 'Internship' ? '#92400e' : '#3730a3',
                          }}
                        >
                          {drive.jobType || 'Full-time'}
                        </span>
                      </div>
                      <p>{drive.roleTitle} • {drive.workLocation || 'Pan-India'}</p>
                    </div>

                    <div className="drive-pkg-badge">
                      <span className="drive-pkg-value">{formatPackage(drive.packageLpa)}</span>
                      <span className="drive-pkg-type">{drive.jobType === 'Internship' ? 'Stipend / CTC' : 'Full-time CTC'}</span>
                    </div>
                  </div>

                  {/* Criteria & Attributes Strip */}
                  <div className="drive-attributes-grid">
                    <div className="drive-attr-item">
                      <dt>Cutoff (Min CGPA)</dt>
                      <dd>{elig.minCgpa ? `${elig.minCgpa} CGPA` : 'No Cutoff'}</dd>
                    </div>
                    <div className="drive-attr-item">
                      <dt>Backlogs Allowed</dt>
                      <dd>
                        {elig.maxActiveBacklogs === 0
                          ? 'No (0 backlogs)'
                          : `Yes (Up to ${elig.maxActiveBacklogs})`}
                      </dd>
                    </div>
                    <div className="drive-attr-item">
                      <dt>Eligible Branches</dt>
                      <dd>{depts}</dd>
                    </div>
                    <div className="drive-attr-item">
                      <dt>Target Batch</dt>
                      <dd>{elig.eligibleGraduationYear ? `${elig.eligibleGraduationYear} Batch` : 'Current Batch'}</dd>
                    </div>
                  </div>

                  {/* If in "Others" tab -> Diagnostic Ineligibility Box */}
                  {activeTab === 'others' && drive.reasons && (
                    <div className="drive-ineligible-banner">
                      <strong>Reasons for Ineligibility:</strong>
                      <ul>
                        {drive.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* JD Attachments Strip */}
                  {(drive.jd1Url || drive.jd2Url || drive.jd3Url) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Attachments:</span>
                      {drive.jd1Url && (
                        <a
                          href={drive.jd1Url.startsWith('http') ? drive.jd1Url : `https://${drive.jd1Url}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.76rem', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '4px', textDecoration: 'none', fontWeight: 600 }}
                        >
                          📄 JD 1
                        </a>
                      )}
                      {drive.jd2Url && (
                        <a
                          href={drive.jd2Url.startsWith('http') ? drive.jd2Url : `https://${drive.jd2Url}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.76rem', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '4px', textDecoration: 'none', fontWeight: 600 }}
                        >
                          📄 JD 2
                        </a>
                      )}
                      {drive.jd3Url && (
                        <a
                          href={drive.jd3Url.startsWith('http') ? drive.jd3Url : `https://${drive.jd3Url}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.76rem', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '4px', textDecoration: 'none', fontWeight: 600 }}
                        >
                          📄 JD 3
                        </a>
                      )}
                    </div>
                  )}

                  {/* Card Footer with Deadlines and Actions */}
                  <div className="drive-card-footer">
                    <div className="drive-deadlines">
                      <div className="deadline-item">
                        <Clock size={15} style={{ color: '#d97706' }} />
                        <span>
                          Deadline:{' '}
                          <strong>
                            {deadlineDate
                              ? deadlineDate.toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'TBA'}
                          </strong>
                        </span>
                      </div>

                      <div className="deadline-item">
                        <Calendar size={15} style={{ color: '#2563eb' }} />
                        <span>
                          Drive Date:{' '}
                          <strong>
                            {driveDate
                              ? driveDate.toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'To Be Announced'}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons based on Tab */}
                    <div>
                      {activeTab === 'eligible' && (
                        <button
                          type="button"
                          className="register-btn"
                          onClick={() => setConfirmingDrive(drive)}
                        >
                          Register for Drive
                        </button>
                      )}

                      {activeTab === 'others' && (
                        <button type="button" className="ineligible-btn-locked" disabled>
                          <Lock size={14} /> Ineligible
                        </button>
                      )}

                      {activeTab === 'registered' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button type="button" className="registered-btn-locked" disabled>
                            <CheckCircle2 size={15} color="#059669" /> Registered
                          </button>
                          <Link
                            to="/student/status"
                            className="secondary-button compact"
                            style={{ textDecoration: 'none', fontSize: '0.84rem' }}
                          >
                            Track Rounds <ChevronRight size={14} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Irreversible Registration Confirmation Modal */}
      {confirmingDrive && (
        <Modal
          title={`Register for ${confirmingDrive.companyName}`}
          onClose={() => !isSubmitting && setConfirmingDrive(null)}
        >
          <div style={{ marginBottom: '16px' }}>
            <p style={{ margin: '0 0 10px', fontSize: '0.95rem' }}>
              You are registering for the role of <strong>{confirmingDrive.roleTitle}</strong> at{' '}
              <strong>{confirmingDrive.companyName}</strong> offering <strong>{formatPackage(confirmingDrive.packageLpa)}</strong>.
            </p>

            <div
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#92400e',
                fontSize: '0.88rem',
              }}
            >
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <AlertTriangle size={16} /> Placement Policy: Irreversible Registration
              </strong>
              <span>
                As per college placement guidelines, <strong>registration is final</strong>. You cannot unregister or skip selection rounds once registered. Missing scheduled interviews will result in a placement restriction.
              </span>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setConfirmingDrive(null)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="register-btn"
              onClick={handleConfirmRegister}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Submitting...
                </>
              ) : (
                'Confirm & Register'
              )}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  FileText,
  BadgeCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Building2,
  Clock,
  Calendar,
  Lock,
  Loader2,
  ExternalLink,
  Search,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../api/client.js'
import StatCard from '../../components/ui/StatCard.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { formatDeadline } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

export default function StudentOverview() {
  const query = usePageQuery()
  const { session } = useAuth()
  const studentId = session?.studentId

  const [student, setStudent] = useState(null)
  const [drives, setDrives] = useState([])
  const [eligibilityMap, setEligibilityMap] = useState({})
  const [applications, setApplications] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  // Register for Companies Tab: 'eligible' | 'others' | 'registered'
  const [activeTab, setActiveTab] = useState('eligible')
  const [searchQuery, setSearchQuery] = useState('')

  // Drive registration modal state
  const [confirmingDrive, setConfirmingDrive] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadData() {
    if (!studentId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const [studentData, drivesData, appsData, offersData] = await Promise.all([
        api.getStudentById(studentId),
        api.getPublishedDrives(),
        api.getStudentApplications(studentId),
        api.getStudentOffers(studentId),
      ])

      setStudent(studentData)
      const pubDrives = Array.isArray(drivesData) ? drivesData : []
      setDrives(pubDrives)
      const appList = Array.isArray(appsData) ? appsData : []
      setApplications(appList)
      setOffers(Array.isArray(offersData) ? offersData : [])

      // Check eligibility concurrently for each published drive
      const eligibilityResults = await Promise.all(
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
      eligibilityResults.forEach((r) => {
        map[r.driveId] = r
      })
      setEligibilityMap(map)
    } catch (err) {
      console.error('Error loading student home:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId])

  async function handleConfirmRegister() {
    if (!confirmingDrive || !studentId) return
    setIsSubmitting(true)
    try {
      await api.applyForDrive({
        studentId,
        driveId: confirmingDrive.driveId,
        remarks: 'Registered through unified student home portal',
      })
      alert(`Registration confirmed! You have successfully registered for ${confirmingDrive.companyName}.`)
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
  applications.forEach((app) => {
    appliedDriveMap.set(app.driveId, app)
  })

  // Partition drives into 3 groups:
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

  const hasCgpa = student?.cgpa != null && Number(student.cgpa) > 0

  return (
    <div className="page-stack">
      {/* Profile Incomplete Notification Banner */}
      {!hasCgpa && !loading && (
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
          aria-label="Profile incomplete notice"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} color="#d97706" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#92400e', fontSize: '0.96rem' }}>Profile Incomplete</strong>
              <p style={{ margin: '2px 0 0', color: '#b45309', fontSize: '0.85rem' }}>
                You haven&apos;t entered your academic metrics (CGPA, department, semester marksheets). Update your profile to participate in automated drive eligibility checks.
              </p>
            </div>
          </div>
          <Link
            to="/student/profile"
            style={{
              background: '#0b1f3a',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Update Profile Now</span>
            <ArrowRight size={14} />
          </Link>
        </section>
      )}

      {/* KPI Cards */}
      <section className="stat-grid" aria-label="Student placement summary">
        <StatCard
          icon={Briefcase}
          label="Open Drives"
          value={drives.length}
          hint="Accepting applications now"
        />
        <StatCard
          icon={FileText}
          label="My Applications"
          value={applications.length}
          hint="Across this placement season"
        />
        <StatCard
          icon={BadgeCheck}
          label="Academic Standing"
          value={hasCgpa ? `CGPA ${Number(student.cgpa).toFixed(2)}` : 'Not Updated'}
          hint={hasCgpa ? `${student.activeBacklogs ?? 0} active backlogs` : 'Pending profile update'}
        />
        <StatCard
          icon={Send}
          label="Offers Received"
          value={offers.length}
          hint={offers.length > 0 ? 'Offer letter ready' : 'In review'}
        />
      </section>

      {/* Register for Companies Section */}
      <section className="panel" id="register-companies" style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
        {/* Navy Header Banner */}
        <div
          style={{
            background: '#0b1f3a',
            padding: '16px 24px',
            textAlign: 'center',
            borderBottom: '2px solid #c59b27',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '0.01em',
              color: '#ffffff',
            }}
          >
            Register for Companies
          </h2>
        </div>

        {/* Inner Content Area */}
        <div style={{ padding: '20px 24px' }}>
          {/* Centered Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '2px',
              marginBottom: '20px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('eligible')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'eligible' ? '3px solid #2563eb' : '3px solid transparent',
                padding: '10px 18px',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'eligible' ? 800 : 600,
                color: activeTab === 'eligible' ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 0.15s ease',
              }}
            >
              ELIGIBLE {eligibleDrives.length > 0 && `(${eligibleDrives.length})`}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('others')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'others' ? '3px solid #2563eb' : '3px solid transparent',
                padding: '10px 18px',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'others' ? 800 : 600,
                color: activeTab === 'others' ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 0.15s ease',
              }}
            >
              OTHERS {otherDrives.length > 0 && `(${otherDrives.length})`}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('registered')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'registered' ? '3px solid #2563eb' : '3px solid transparent',
                padding: '10px 18px',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'registered' ? 800 : 600,
                color: activeTab === 'registered' ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 0.15s ease',
              }}
            >
              REGISTERED {registeredDrives.length > 0 && `(${registeredDrives.length})`}
            </button>
          </div>

          {/* Quick Search */}
          {drives.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Filter companies or roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px 7px 32px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          )}

          {/* Tab Content Display */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
              <Loader2 size={26} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Evaluating placement drives &amp; live eligibility...</p>
            </div>
          ) : activeList.length === 0 ? (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '50px 20px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 600, color: '#334155' }}>
                No companies available currently!
              </h3>
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

                    {/* Ineligibility Reasons Banner (for OTHERS tab) */}
                    {activeTab === 'others' && drive.reasons && (
                      <div className="drive-ineligible-banner">
                        <strong>Reasons for Ineligibility:</strong>
                        <ul style={{ margin: '4px 0 0', paddingLeft: '18px' }}>
                          {drive.reasons.map((reason, idx) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* JD Attachments Strip */}
                    {(drive.jd1Url || drive.jd2Url || drive.jd3Url) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Job Descriptions:</span>
                        {drive.jd1Url && (
                          <a
                            href={drive.jd1Url.startsWith('http') ? drive.jd1Url : `https://${drive.jd1Url}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '0.76rem', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '4px', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                          >
                            <span>JD 1</span> <ExternalLink size={11} />
                          </a>
                        )}
                        {drive.jd2Url && (
                          <a
                            href={drive.jd2Url.startsWith('http') ? drive.jd2Url : `https://${drive.jd2Url}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '0.76rem', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '4px', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                          >
                            <span>JD 2</span> <ExternalLink size={11} />
                          </a>
                        )}
                        {drive.jd3Url && (
                          <a
                            href={drive.jd3Url.startsWith('http') ? drive.jd3Url : `https://${drive.jd3Url}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '0.76rem', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '4px', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                          >
                            <span>JD 3</span> <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Card Footer with Deadlines & Action Button */}
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

                      {/* Action Buttons based on Active Tab */}
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
                            <span style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 600 }}>
                              Status: {drive.application?.status || 'SUBMITTED'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Registration Confirmation Modal */}
      {confirmingDrive && (
        <Modal
          title={`Confirm Registration: ${confirmingDrive.companyName}`}
          onClose={() => setConfirmingDrive(null)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>{confirmingDrive.roleTitle}</div>
              <div style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '2px' }}>
                {confirmingDrive.companyName} • {confirmingDrive.workLocation || 'Pan-India'}
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.95rem', fontWeight: 700, color: '#047857' }}>
                Package: {formatPackage(confirmingDrive.packageLpa)}
              </div>
            </div>

            <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
              By registering, you confirm that:
              <ul style={{ margin: '6px 0 0', paddingLeft: '20px' }}>
                <li>Your academic records (CGPA, backlogs) are accurate and up-to-date.</li>
                <li>You will attend all mandatory selection rounds scheduled by the recruiter.</li>
                <li>Registration is binding under the JSS Science &amp; Technology University Placement Policy.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
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
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Confirm Registration</span>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

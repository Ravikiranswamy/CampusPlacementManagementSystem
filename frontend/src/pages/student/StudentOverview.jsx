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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 420px))',
                gap: '24px',
                justifyContent: 'start',
              }}
            >
              {activeList.map((drive) => {
                const elig = drive.eligibility || {}
                const deadlineDate = drive.registrationDeadline ? new Date(drive.registrationDeadline) : null
                const driveDate = drive.driveDate ? new Date(drive.driveDate) : null

                const formatCardDate = (d) => {
                  if (!d || isNaN(d.getTime())) return 'To Be Announced'
                  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
                }

                const formatCardDeadline = (d) => {
                  if (!d || isNaN(d.getTime())) return 'TBA'
                  const day = String(d.getDate()).padStart(2, '0')
                  const month = String(d.getMonth() + 1).padStart(2, '0')
                  const year = d.getFullYear()
                  let hours = d.getHours()
                  const minutes = String(d.getMinutes()).padStart(2, '0')
                  const ampm = hours >= 12 ? 'PM' : 'AM'
                  hours = hours % 12 || 12
                  const formattedHours = String(hours).padStart(2, '0')
                  return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`
                }

                return (
                  <div
                    key={drive.driveId}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '10px',
                      padding: '24px 26px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '440px',
                    }}
                  >
                    <div>
                      {/* Drive / Role Title */}
                      <h3
                        style={{
                          margin: '0 0 22px 0',
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#111827',
                          lineHeight: 1.35,
                        }}
                      >
                        {drive.driveTitle || `${drive.companyName} for ${drive.roleTitle}`}
                      </h3>

                      {/* 2-Column Key-Value Grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          rowGap: '16px',
                          columnGap: '20px',
                          marginBottom: '20px',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>
                            Intern Stipend
                          </div>
                          <div style={{ fontSize: '0.95rem', color: '#374151', marginTop: '2px' }}>
                            {drive.stipendMonthly
                              ? Number(drive.stipendMonthly).toLocaleString('en-IN')
                              : '21,000'}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>
                            Fulltime CTC
                          </div>
                          <div style={{ fontSize: '0.95rem', color: '#374151', marginTop: '2px' }}>
                            {drive.packageLpa != null ? Number(drive.packageLpa) : '8'}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>
                            Backlogs Allowed
                          </div>
                          <div style={{ fontSize: '0.95rem', color: '#374151', marginTop: '2px' }}>
                            {(elig.maxActiveBacklogs ?? 0) > 0 ? 'Yes' : 'No'}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>
                            Cutoff-10th
                          </div>
                          <div style={{ fontSize: '0.95rem', color: '#374151', marginTop: '2px' }}>0</div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>
                            Cutoff-12th
                          </div>
                          <div style={{ fontSize: '0.95rem', color: '#374151', marginTop: '2px' }}>0</div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>
                            Cutoff-BE
                          </div>
                          <div style={{ fontSize: '0.95rem', color: '#374151', marginTop: '2px' }}>
                            {elig.minCgpa != null ? Number(elig.minCgpa) : 0}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>
                            Cutoff-PG
                          </div>
                          <div style={{ fontSize: '0.95rem', color: '#374151', marginTop: '2px' }}>0</div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>
                            Date
                          </div>
                          <div style={{ fontSize: '0.95rem', color: '#374151', marginTop: '2px' }}>
                            {formatCardDate(driveDate)}
                          </div>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div style={{ marginBottom: '22px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>
                          Deadline
                        </div>
                        <div style={{ fontSize: '0.95rem', color: '#374151', marginTop: '2px' }}>
                          {formatCardDeadline(deadlineDate)}
                        </div>
                      </div>

                      {/* Ineligibility Reason Banner (OTHERS tab) */}
                      {activeTab === 'others' && drive.reasons && (
                        <div
                          style={{
                            background: '#fffbeb',
                            border: '1px solid #fde68a',
                            borderRadius: '6px',
                            padding: '10px 12px',
                            marginBottom: '16px',
                            fontSize: '0.84rem',
                            color: '#92400e',
                          }}
                        >
                          <strong>Not Eligible:</strong>
                          <ul style={{ margin: '4px 0 0', paddingLeft: '18px' }}>
                            {drive.reasons.map((reason, idx) => (
                              <li key={idx}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Job Description Attachments */}
                      {(drive.jd1Url || drive.jd2Url || drive.jd3Url) && (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>JDs:</span>
                          {drive.jd1Url && (
                            <a
                              href={drive.jd1Url.startsWith('http') ? drive.jd1Url : `https://${drive.jd1Url}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                fontSize: '0.78rem',
                                color: '#1d4ed8',
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                fontWeight: 600,
                              }}
                            >
                              JD 1
                            </a>
                          )}
                          {drive.jd2Url && (
                            <a
                              href={drive.jd2Url.startsWith('http') ? drive.jd2Url : `https://${drive.jd2Url}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                fontSize: '0.78rem',
                                color: '#1d4ed8',
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                fontWeight: 600,
                              }}
                            >
                              JD 2
                            </a>
                          )}
                          {drive.jd3Url && (
                            <a
                              href={drive.jd3Url.startsWith('http') ? drive.jd3Url : `https://${drive.jd3Url}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                fontSize: '0.78rem',
                                color: '#1d4ed8',
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                fontWeight: 600,
                              }}
                            >
                              JD 3
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Button matching user spec */}
                    <div>
                      {activeTab === 'eligible' && (
                        <button
                          type="button"
                          onClick={() => setConfirmingDrive(drive)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: '#0b1f3a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            letterSpacing: '0.02em',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#1e3a5f')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#0b1f3a')}
                        >
                          Register
                        </button>
                      )}

                      {activeTab === 'others' && (
                        <button
                          type="button"
                          disabled
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: '#94a3b8',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'not-allowed',
                          }}
                        >
                          Ineligible
                        </button>
                      )}

                      {activeTab === 'registered' && (
                        <button
                          type="button"
                          disabled
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: '#5a626e',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'default',
                          }}
                        >
                          Registered
                        </button>
                      )}
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

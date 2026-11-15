import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../api/client.js'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatPackage } from '../../data/mockData.js'
import { formatDeadline } from '../../data/records.js'
import { CheckCircle2, Award, Clock, FileText, Check, X, ExternalLink } from 'lucide-react'

export default function ApplicationStatus() {
  const { session } = useAuth()
  const studentId = session?.studentId

  const [applications, setApplications] = useState([])
  const [selectedAppId, setSelectedAppId] = useState(null)
  const [roundResults, setRoundResults] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roundsLoading, setRoundsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function loadData() {
    if (!studentId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const [appsData, offersData] = await Promise.all([
        api.getStudentApplications(studentId),
        api.getStudentOffers(studentId),
      ])
      const appList = Array.isArray(appsData) ? appsData : []
      setApplications(appList)
      setOffers(Array.isArray(offersData) ? offersData : [])
      if (appList.length > 0) {
        setSelectedAppId(appList[0].applicationId)
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching application status:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId])

  useEffect(() => {
    if (!selectedAppId) return
    async function loadResults() {
      try {
        setRoundsLoading(true)
        const results = await api.getApplicationResults(selectedAppId)
        setRoundResults(Array.isArray(results) ? results : [])
      } catch (err) {
        console.error('Error fetching round results:', err)
      } finally {
        setRoundsLoading(false)
      }
    }
    loadResults()
  }, [selectedAppId])

  async function handleOfferAction(offerId, newStatus) {
    const actionLabel = newStatus === 'ACCEPTED' ? 'accept' : 'decline'
    if (!confirm(`Are you sure you want to ${actionLabel} this offer?`)) return
    try {
      await api.updateOfferStatus(offerId, newStatus)
      alert(`Offer ${actionLabel}ed successfully!`)
      await loadData()
    } catch (err) {
      alert(`Action failed: ${err.message}`)
    }
  }

  const activeApp = applications.find((a) => a.applicationId === selectedAppId)

  return (
    <div className="page-stack">
      {error && (
        <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Official Offers Section */}
      {offers.length > 0 && (
        <section className="panel" style={{ borderLeft: '4px solid #10b981', background: '#f0fdf4' }}>
          <div className="panel-head" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={22} style={{ color: '#059669' }} />
            <div>
              <h2 style={{ color: '#065f46', margin: 0 }}>Official Placement Offers Received</h2>
              <p style={{ color: '#047857', margin: '0.2rem 0 0' }}>
                Congratulations! You have received formal offers from recruitment drives.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {offers.map((offer) => (
              <div
                key={offer.offerId}
                style={{
                  background: '#ffffff',
                  border: '1px solid #a7f3d0',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{offer.companyName}</h3>
                    <StatusBadge value={offer.offerStatus} />
                  </div>
                  <p style={{ margin: '0.25rem 0', color: '#4b5563', fontSize: '0.9rem' }}>
                    Role: <strong>{offer.roleTitle}</strong> • Package:{' '}
                    <strong style={{ color: '#059669', fontSize: '1.05rem' }}>
                      {formatPackage(offer.offeredPackageLpa)}
                    </strong>
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    Offer Date: {offer.offerDate || 'Current'} • Joining:{' '}
                    {offer.joiningDate || 'Summer 2027'}
                  </div>
                  {offer.offerLetterUrl && (
                    <a
                      href={offer.offerLetterUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        color: 'var(--color-primary)',
                        fontSize: '0.85rem',
                        marginTop: '0.5rem',
                      }}
                    >
                      <FileText size={14} /> Download Offer Letter
                    </a>
                  )}
                </div>

                {offer.offerStatus === 'OFFERED' && (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.85rem' }}
                      onClick={() => handleOfferAction(offer.offerId, 'ACCEPTED')}
                    >
                      <Check size={16} /> Accept Offer
                    </button>
                    <button
                      type="button"
                      style={{
                        background: 'transparent',
                        border: '1px solid #dc2626',
                        color: '#dc2626',
                        borderRadius: '6px',
                        padding: '0.4rem 0.85rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                      onClick={() => handleOfferAction(offer.offerId, 'REJECTED')}
                    >
                      <X size={16} /> Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rounds Progression Section */}
      <section className="panel">
        <div className="panel-head">
          <h2>Recruitment Stage Progression</h2>
          <p style={{ color: 'var(--color-muted)' }}>
            Select an active application to view round-by-round qualification status, interviewer feedback, and scores.
          </p>
        </div>

        {applications.length === 0 ? (
          <p className="table-empty">No active applications to display.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginTop: '1rem' }}>
            {/* Left list of applications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-muted)' }}>
                Select Application
              </label>
              {applications.map((app) => (
                <button
                  key={app.applicationId}
                  type="button"
                  style={{
                    textAlign: 'left',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border: selectedAppId === app.applicationId ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: selectedAppId === app.applicationId ? '#f0f9ff' : '#ffffff',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedAppId(app.applicationId)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{app.companyName}</strong>
                    <StatusBadge value={app.status} />
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
                    {app.roleTitle}
                  </div>
                </button>
              ))}
            </div>

            {/* Right side: Round Details */}
            <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.25rem', background: '#fafafa' }}>
              {activeApp ? (
                <div>
                  <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                      {activeApp.companyName} — Selection Timeline
                    </h3>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                      Overall Status: <strong>{activeApp.status}</strong> • Verified Eligibility: {activeApp.eligibilityVerified ? 'Yes' : 'Pending'}
                    </p>
                  </div>

                  {roundsLoading ? (
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Loading round outcomes...</p>
                  ) : roundResults.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-muted)' }}>
                      <Clock size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>
                        Selection rounds have not commenced or results are being compiled for this drive.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {roundResults.map((r, idx) => (
                        <div
                          key={r.resultId}
                          style={{
                            background: '#ffffff',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                            padding: '1rem',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>
                              Round {r.roundNumber || idx + 1}: {r.roundName}
                            </h4>
                            <StatusBadge value={r.resultStatus} />
                          </div>
                          <div style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: '#4b5563' }}>
                            {r.score != null && (
                              <div>
                                Score / Evaluation: <strong>{r.score}</strong>
                              </div>
                            )}
                            {r.remarks && (
                              <div style={{ marginTop: '0.2rem', fontStyle: 'italic', color: '#6b7280' }}>
                                Remarks: "{r.remarks}"
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: 'var(--color-muted)' }}>Select an application from the left to view timeline.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

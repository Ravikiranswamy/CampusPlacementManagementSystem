import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../api/client.js'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatPackage } from '../../data/mockData.js'
import {
  CheckCircle2,
  Clock,
  Award,
  FileText,
  Check,
  X,
  Building2,
  ArrowRight,
  Loader2,
  Briefcase,
} from 'lucide-react'

export default function ApplicationStatus() {
  const { session } = useAuth()
  const studentId = session?.studentId

  const [applications, setApplications] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
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
      setApplications(Array.isArray(appsData) ? appsData : [])
      setOffers(Array.isArray(offersData) ? offersData : [])
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

  // Determine Placement Status
  // A student is PLACED if they have an accepted offer, an offered package, or an application marked as SELECTED/CONFIRMED
  const acceptedOffer =
    offers.find((o) => o.offerStatus === 'ACCEPTED') ||
    offers.find((o) => o.offerStatus === 'OFFERED')

  const selectedApp = applications.find(
    (a) => a.status === 'SELECTED' || a.status === 'CONFIRMED'
  )

  const isPlaced = Boolean(acceptedOffer || selectedApp)

  let placedDetails = null
  if (acceptedOffer) {
    placedDetails = {
      companyName: acceptedOffer.companyName,
      roleTitle: acceptedOffer.roleTitle,
      compensation: acceptedOffer.offeredPackageLpa
        ? formatPackage(acceptedOffer.offeredPackageLpa)
        : 'As per drive',
      statusLabel:
        acceptedOffer.offerStatus === 'ACCEPTED'
          ? 'Offer Accepted'
          : 'Formal Offer Issued',
      date: acceptedOffer.offerDate || 'Current Season',
    }
  } else if (selectedApp) {
    placedDetails = {
      companyName: selectedApp.companyName,
      roleTitle: selectedApp.roleTitle,
      compensation: selectedApp.packageLpa
        ? formatPackage(selectedApp.packageLpa)
        : selectedApp.stipendMonthly
        ? `₹${Number(selectedApp.stipendMonthly).toLocaleString('en-IN')} / month`
        : 'Confirmed',
      statusLabel: 'Internship / Role Confirmed',
      date: selectedApp.appliedAt
        ? new Date(selectedApp.appliedAt).toLocaleDateString('en-IN')
        : 'Current Season',
    }
  }

  return (
    <div className="page-stack">
      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
          }}
        >
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '12px', fontSize: '0.95rem' }}>
            Loading your placement and application status...
          </p>
        </div>
      ) : (
        <>
          {/* Main Placement Status Banner */}
          <section
            style={{
              background: isPlaced ? '#f0fdf4' : '#ffffff',
              border: isPlaced ? '2px solid #86efac' : '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '28px 32px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: isPlaced ? '#047857' : '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Current Placement Status
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '8px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: isPlaced ? '#10b981' : '#f59e0b',
                    }}
                  />
                  <h1
                    style={{
                      margin: 0,
                      fontSize: '2rem',
                      fontWeight: 800,
                      color: isPlaced ? '#065f46' : '#0f172a',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {isPlaced ? 'Placed' : 'Not Yet Placed'}
                  </h1>
                </div>

                <p
                  style={{
                    margin: '8px 0 0',
                    fontSize: '0.96rem',
                    color: isPlaced ? '#047857' : '#64748b',
                    maxWidth: '650px',
                    lineHeight: 1.5,
                  }}
                >
                  {isPlaced
                    ? 'Congratulations! You have secured a confirmed placement / internship for this season.'
                    : 'You are currently participating in the placement season. Your status will update to Placed as soon as your internship or job selection is confirmed.'}
                </p>
              </div>

              {/* Big Status Pill */}
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    borderRadius: '999px',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    background: isPlaced ? '#dcfce7' : '#fef3c7',
                    color: isPlaced ? '#15803d' : '#92400e',
                    border: isPlaced ? '1px solid #86efac' : '1px solid #fde68a',
                  }}
                >
                  {isPlaced ? (
                    <>
                      <CheckCircle2 size={18} /> Placed
                    </>
                  ) : (
                    <>
                      <Clock size={18} /> Not Yet Placed
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Placed Details Matrix (Visible when Placed) */}
            {isPlaced && placedDetails && (
              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid #bbf7d0',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#047857',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Company
                  </div>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginTop: '4px',
                    }}
                  >
                    {placedDetails.companyName}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#047857',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Job Role / Internship
                  </div>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginTop: '4px',
                    }}
                  >
                    {placedDetails.roleTitle}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#047857',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Compensation / Stipend
                  </div>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#059669',
                      marginTop: '4px',
                    }}
                  >
                    {placedDetails.compensation}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#047857',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Confirmation Status
                  </div>
                  <div
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#065f46',
                      marginTop: '4px',
                    }}
                  >
                    {placedDetails.statusLabel}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action when Not Placed */}
            {!isPlaced && (
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '18px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                  Explore active recruitment drives accepting applications now.
                </div>
                <Link
                  to="/student"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#0b1f3a',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <span>View Companies on Home</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </section>

          {/* Official Offers Pending Action (if any) */}
          {offers.some((o) => o.offerStatus === 'OFFERED') && (
            <section
              className="panel"
              style={{
                borderLeft: '4px solid #10b981',
                background: '#f0fdf4',
                marginTop: '24px',
              }}
            >
              <div
                className="panel-head"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Award size={22} style={{ color: '#059669' }} />
                <div>
                  <h2 style={{ color: '#065f46', margin: 0 }}>
                    Official Placement Offer Received
                  </h2>
                  <p style={{ color: '#047857', margin: '0.2rem 0 0' }}>
                    You have an official offer awaiting your acceptance.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginTop: '1rem',
                }}
              >
                {offers
                  .filter((o) => o.offerStatus === 'OFFERED')
                  .map((offer) => (
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
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                          }}
                        >
                          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                            {offer.companyName}
                          </h3>
                          <StatusBadge value={offer.offerStatus} />
                        </div>
                        <p
                          style={{
                            margin: '0.25rem 0',
                            color: '#4b5563',
                            fontSize: '0.9rem',
                          }}
                        >
                          Role: <strong>{offer.roleTitle}</strong> • Package:{' '}
                          <strong
                            style={{ color: '#059669', fontSize: '1.05rem' }}
                          >
                            {formatPackage(offer.offeredPackageLpa)}
                          </strong>
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.5rem 1rem',
                          }}
                          onClick={() =>
                            handleOfferAction(offer.offerId, 'ACCEPTED')
                          }
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
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                          onClick={() =>
                            handleOfferAction(offer.offerId, 'REJECTED')
                          }
                        >
                          <X size={16} /> Decline
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Applications Progression Table (Only shown if student has applied) */}
          {applications.length > 0 && (
            <section
              className="panel"
              style={{
                padding: '0',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  background: '#0b1f3a',
                  padding: '16px 24px',
                  borderBottom: '2px solid #c59b27',
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#ffffff',
                  }}
                >
                  My Applications &amp; Stage Tracking
                </h2>
              </div>

              <div style={{ padding: '20px 24px', overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Company</th>
                      <th style={{ textAlign: 'left' }}>Role</th>
                      <th style={{ textAlign: 'left' }}>Applied Date</th>
                      <th style={{ textAlign: 'left' }}>Stage / Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.applicationId}>
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>
                          {app.companyName}
                        </td>
                        <td>{app.roleTitle}</td>
                        <td style={{ color: '#64748b' }}>
                          {app.appliedAt
                            ? new Date(app.appliedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              background:
                                app.status === 'SELECTED'
                                  ? '#dcfce7'
                                  : app.status === 'REJECTED'
                                  ? '#fee2e2'
                                  : '#eff6ff',
                              color:
                                app.status === 'SELECTED'
                                  ? '#15803d'
                                  : app.status === 'REJECTED'
                                  ? '#991b1b'
                                  : '#1d4ed8',
                              border:
                                app.status === 'SELECTED'
                                  ? '1px solid #86efac'
                                  : app.status === 'REJECTED'
                                  ? '1px solid #fca5a5'
                                  : '1px solid #bfdbfe',
                            }}
                          >
                            {app.status === 'SELECTED'
                              ? 'Selected / Placed'
                              : app.status === 'UNDER_REVIEW'
                              ? 'Under Review'
                              : app.status === 'APPLIED'
                              ? 'Submitted'
                              : app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

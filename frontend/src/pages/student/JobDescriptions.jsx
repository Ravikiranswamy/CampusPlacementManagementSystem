import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client.js'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  Building2,
  Calendar,
  Clock,
  Briefcase,
  Loader2,
  ChevronRight,
  Sparkles,
  FileDown,
} from 'lucide-react'

export default function JobDescriptions() {
  const query = usePageQuery()
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadDrives() {
      try {
        setLoading(true)
        const data = await api.getPublishedDrives()
        setDrives(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        console.error('Error fetching drives for JDs:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadDrives()
  }, [])

  const filtered = drives.filter((d) => {
    const q = (search || query || '').toLowerCase().trim()
    if (!q) return true
    return matchesQuery(q, [
      d.companyName,
      d.roleTitle,
      d.workLocation,
      d.jobType,
      d.driveTitle,
    ])
  })

  function renderJdPill(label, url) {
    if (!url) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.78rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '6px',
            background: '#f1f5f9',
            color: '#94a3b8',
            border: '1px solid #e2e8f0',
          }}
        >
          {label}: N/A
        </span>
      )
    }

    return (
      <a
        href={url.startsWith('http') ? url : `https://${url}`}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '0.78rem',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '6px',
          background: '#eff6ff',
          color: '#1d4ed8',
          border: '1px solid #bfdbfe',
          textDecoration: 'none',
          transition: 'all 0.15s ease',
        }}
      >
        <FileDown size={13} />
        <span>{label}</span>
        <ExternalLink size={11} />
      </a>
    )
  }

  return (
    <div className="page-stack">
      {error && (
        <div style={{ padding: '0.85rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {/* Header Banner */}
      <section className="panel" style={{ background: '#f8fafc', borderLeft: '4px solid #0b1f3a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
                Company Job Descriptions (JDs)
              </h2>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  background: '#0b1f3a',
                  color: '#ffffff',
                  padding: '3px 9px',
                  borderRadius: '12px',
                }}
              >
                {drives.length} Drives
              </span>
            </div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
              Download official recruiter Job Description attachments (JD1, JD2, JD3), salary compensation structures, and drive deadlines.
            </p>
          </div>

          <Link
            to="/student/drives"
            className="register-btn"
            style={{ textDecoration: 'none', fontSize: '0.88rem', padding: '8px 16px' }}
          >
            <span>Register for Drives →</span>
          </Link>
        </div>
      </section>

      {/* Search Bar & Drives Table / Cards */}
      <section className="panel">
        <div style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search companies or job roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '8px' }}>Loading job descriptions from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: '#f8fafc', borderRadius: '10px', color: '#64748b' }}>
            <FileText size={40} style={{ color: '#cbd5e1', marginBottom: '8px' }} />
            <h3 style={{ margin: '0 0 6px', color: '#1e293b' }}>No Job Descriptions Available</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              {drives.length === 0
                ? 'The placement team has not published any recruitment drives yet.'
                : 'No companies match your search filter.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '14px' }}>
            {filtered.map((drive) => {
              const deadlineDate = drive.registrationDeadline ? new Date(drive.registrationDeadline) : null
              const driveDate = drive.driveDate ? new Date(drive.driveDate) : null
              const elig = drive.eligibility || {}

              return (
                <div
                  key={drive.driveId}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* Top: Company, Role & Package */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building2 size={18} color="#0b1f3a" />
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>
                          {drive.companyName}
                        </h3>
                        <span
                          style={{
                            fontSize: '0.74rem',
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
                      <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '2px' }}>
                        {drive.roleTitle} {drive.workLocation ? `• ${drive.workLocation}` : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#047857', fontSize: '1.2rem' }}>
                          {formatPackage(drive.packageLpa)}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                          FULL-TIME CTC
                        </div>
                      </div>

                      {drive.stipendMonthly && (
                        <div style={{ textAlign: 'right', borderLeft: '1px solid #e2e8f0', paddingLeft: '14px' }}>
                          <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '1.1rem' }}>
                            ₹{drive.stipendMonthly}/mo
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                            MONTHLY STIPEND
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle Strip: Schedule & Deadlines */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                      fontSize: '0.85rem',
                      color: '#475569',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={14} color="#d97706" />
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

                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={14} color="#2563eb" />
                        Drive Date:{' '}
                        <strong>
                          {driveDate
                            ? driveDate.toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'TBA'}
                        </strong>
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      Cutoff: <strong>{elig.minCgpa ? `${elig.minCgpa} CGPA` : 'None'}</strong> • Backlogs: <strong>{elig.maxActiveBacklogs ?? 0} max</strong>
                    </div>
                  </div>

                  {/* Bottom: Up to 3 Downloadable JD Files (JD1, JD2, JD3) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginRight: '4px' }}>
                        Job Description Files:
                      </span>
                      {renderJdPill('JD 1', drive.jd1Url)}
                      {renderJdPill('JD 2', drive.jd2Url)}
                      {renderJdPill('JD 3', drive.jd3Url)}
                    </div>

                    <Link
                      to="/student/drives"
                      className="secondary-button compact"
                      style={{ fontSize: '0.82rem', textDecoration: 'none' }}
                    >
                      Check Eligibility &amp; Register <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

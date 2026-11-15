import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import { matchesQuery } from '../../data/mockData.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'
import {
  Download,
  Search,
  Loader2,
  Ban,
  Building2,
  FileText,
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

  function formatDateTime(dateVal) {
    if (!dateVal) return 'To Be Announced'
    const d = new Date(dateVal)
    if (isNaN(d.getTime())) return String(dateVal)
    const month = d.getMonth() + 1
    const day = d.getDate()
    const year = d.getFullYear()
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
    return `${month}/${day}/${year}, ${timeStr}`
  }

  function renderJdButton(label, url) {
    if (!url) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '6px',
            border: '1px solid #fca5a5',
            background: '#ffffff',
            color: '#ef4444',
            fontSize: '0.84rem',
            fontWeight: 600,
          }}
        >
          <Ban size={14} />
          <span>{label} (N/A)</span>
        </span>
      )
    }

    const targetUrl = url.startsWith('http') ? url : `https://${url}`

    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 14px',
          borderRadius: '6px',
          border: '1px solid #93c5fd',
          background: '#ffffff',
          color: '#1d4ed8',
          fontSize: '0.84rem',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 1px 2px rgba(37, 99, 235, 0.05)',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#eff6ff'
          e.currentTarget.style.borderColor = '#60a5fa'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ffffff'
          e.currentTarget.style.borderColor = '#93c5fd'
        }}
      >
        <Download size={14} />
        <span>{label}</span>
      </a>
    )
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4px 0 32px' }}>
      {/* Title */}
      <h1
        style={{
          fontSize: '1.65rem',
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 16px 0',
          letterSpacing: '-0.01em',
        }}
      >
        Job Descriptions
      </h1>

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

      {/* Search Input Box */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
          }}
        />
        <input
          type="text"
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px 12px 42px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            background: '#ffffff',
            fontSize: '0.95rem',
            color: '#111827',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
            background: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <Loader2 size={26} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '10px', fontSize: '0.92rem' }}>
            Loading recruitment job descriptions...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            color: '#64748b',
          }}
        >
          <FileText size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1f2937' }}>
            No matching job descriptions found
          </h3>
          <p style={{ margin: '6px 0 0', fontSize: '0.88rem' }}>
            Try adjusting your search query or check back as more companies publish their drives.
          </p>
        </div>
      ) : (
        /* List of Company Cards */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filtered.map((drive) => {
            const title =
              drive.driveTitle ||
              `${drive.companyName} ${drive.roleTitle || 'Internship'}`

            const packageStr = drive.packageLpa
              ? `${Number(drive.packageLpa)} LPA`
              : 'Best in Industry'

            const stipendStr = drive.stipendMonthly
              ? Number(drive.stipendMonthly).toLocaleString('en-IN')
              : null

            return (
              <div
                key={drive.driveId}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '22px 26px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                  transition: 'box-shadow 0.15s ease',
                }}
              >
                {/* Title */}
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#1f2937',
                    margin: '0 0 10px 0',
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </h2>

                {/* Pills Row: CTC and Stipend */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '14px',
                  }}
                >
                  {/* CTC Pill */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '3px 12px',
                      borderRadius: '999px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#059669',
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                    }}
                  >
                    CTC: {packageStr}
                  </span>

                  {/* Stipend Pill */}
                  {stipendStr && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '3px 12px',
                        borderRadius: '999px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#0284c7',
                        background: '#f0f9ff',
                        border: '1px solid #bae6fd',
                      }}
                    >
                      Stipend: {stipendStr}
                    </span>
                  )}
                </div>

                {/* Drive Date */}
                <div
                  style={{
                    fontSize: '0.92rem',
                    color: '#374151',
                    fontWeight: 500,
                    marginBottom: '4px',
                  }}
                >
                  Drive Date: {formatDateTime(drive.driveDate)}
                </div>

                {/* Deadline */}
                <div
                  style={{
                    fontSize: '0.92rem',
                    color: '#374151',
                    fontWeight: 500,
                    marginBottom: '14px',
                  }}
                >
                  Deadline: {formatDateTime(drive.registrationDeadline)}
                </div>

                {/* Job Description Files Header */}
                <div
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: '#1f2937',
                    marginBottom: '10px',
                  }}
                >
                  Job Description Files:
                </div>

                {/* JD Buttons: JD1, JD2, JD3 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                  }}
                >
                  {renderJdButton('JD1', drive.jd1Url)}
                  {renderJdButton('JD2', drive.jd2Url)}
                  {renderJdButton('JD3', drive.jd3Url)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../api/client.js'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { matchesQuery } from '../../data/mockData.js'
import { formatDeadline } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

export default function MyApplications() {
  const query = usePageQuery()
  const { session } = useAuth()
  const studentId = session?.studentId

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  async function loadData() {
    if (!studentId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await api.getStudentApplications(studentId)
      setApplications(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      console.error('Error fetching applications:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId])

  async function handleWithdraw(applicationId, companyName) {
    if (!confirm(`Are you sure you want to withdraw your application for ${companyName}? This action cannot be undone.`)) {
      return
    }
    try {
      await api.withdrawApplication(applicationId, studentId)
      alert('Application successfully withdrawn.')
      await loadData()
    } catch (err) {
      alert(`Failed to withdraw application: ${err.message}`)
    }
  }

  const rows = applications.filter((app) => {
    const statusMatch = statusFilter === 'all' || app.status === statusFilter
    return (
      statusMatch &&
      matchesQuery(query, [
        app.applicationId,
        app.companyName,
        app.roleTitle,
        app.status,
      ])
    )
  })

  return (
    <div className="page-stack">
      {error && (
        <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>My Placement Applications</h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Track the live status of all drives you have registered for in the 2026-27 placement season.
            </p>
          </div>
          <FilterSelect
            label="Application Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Applications' },
              { value: 'APPLIED', label: 'APPLIED' },
              { value: 'UNDER_REVIEW', label: 'UNDER_REVIEW' },
              { value: 'SELECTED', label: 'SELECTED' },
              { value: 'REJECTED', label: 'REJECTED' },
              { value: 'WITHDRAWN', label: 'WITHDRAWN' },
            ]}
          />
        </div>

        {loading ? (
          <p className="table-empty">Loading applications from database...</p>
        ) : (
          <DataTable
            columns={[
              {
                key: 'applicationId',
                header: 'App ID',
                render: (row) => `#APP-${row.applicationId}`,
              },
              {
                key: 'company',
                header: 'Company & Role',
                render: (row) => (
                  <div>
                    <strong>{row.companyName}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{row.roleTitle}</div>
                  </div>
                ),
              },
              {
                key: 'appliedAt',
                header: 'Applied On',
                render: (row) => (
                  <span style={{ fontSize: '0.85rem' }}>
                    {row.appliedAt ? formatDeadline(row.appliedAt.split('T')[0]) : 'Recently'}
                  </span>
                ),
              },
              {
                key: 'eligibility',
                header: 'Eligibility Verified',
                render: (row) =>
                  row.eligibilityVerified ? (
                    <span style={{ color: '#059669', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <CheckCircle size={14} /> Verified
                    </span>
                  ) : (
                    <span style={{ color: '#d97706', fontSize: '0.85rem' }}>Pending Check</span>
                  ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) => <StatusBadge value={row.status} />,
              },
              {
                key: 'action',
                header: 'Actions',
                render: (row) => {
                  if (row.status === 'APPLIED' || row.status === 'UNDER_REVIEW') {
                    return (
                      <button
                        type="button"
                        style={{
                          background: 'transparent',
                          border: '1px solid #dc2626',
                          color: '#dc2626',
                          borderRadius: '4px',
                          padding: '0.25rem 0.6rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                        onClick={() => handleWithdraw(row.applicationId, row.companyName)}
                      >
                        Withdraw
                      </button>
                    )
                  }
                  return <span style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>None</span>
                },
              },
            ]}
            rows={rows}
            empty="You have not submitted any placement applications yet."
          />
        )}
      </section>
    </div>
  )
}

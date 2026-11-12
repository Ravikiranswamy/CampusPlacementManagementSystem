import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { matchesQuery } from '../../data/mockData.js'
import { formatDeadline } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'
import { CheckCircle2, UserCheck, Award } from 'lucide-react'

export default function Selections() {
  const query = usePageQuery()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  // Status Update Modal
  const [editingApp, setEditingApp] = useState(null)
  const [newStatus, setNewStatus] = useState('SELECTED')
  const [statusRemarks, setStatusRemarks] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  async function loadData() {
    try {
      setLoading(true)
      const data = await api.getApplications()
      setApplications(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching applications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleUpdateStatus(e) {
    e.preventDefault()
    if (!editingApp) return
    try {
      setActionLoading(true)
      await api.updateApplicationStatus(editingApp.applicationId, {
        status: newStatus,
        remarks: statusRemarks,
      })
      setEditingApp(null)
      await loadData()
    } catch (err) {
      alert(`Failed to update status: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  const rows = applications.filter((app) => {
    const statusMatch = statusFilter === 'all' || app.status === statusFilter
    return (
      statusMatch &&
      matchesQuery(query, [
        app.applicationId,
        app.studentName,
        app.companyName,
        app.roleTitle,
        app.departmentCode,
        app.status,
      ])
    )
  })

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Candidate Selections & Application Pipeline</h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Review candidate progress across recruitment drives, promote finalists, and monitor selection stages.
            </p>
          </div>
          <FilterSelect
            label="Application Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'APPLIED', label: 'APPLIED' },
              { value: 'UNDER_REVIEW', label: 'UNDER_REVIEW' },
              { value: 'SELECTED', label: 'SELECTED' },
              { value: 'REJECTED', label: 'REJECTED' },
            ]}
          />
        </div>

        {loading ? (
          <p className="table-empty">Loading candidate applications from database...</p>
        ) : (
          <DataTable
            columns={[
              { key: 'applicationId', header: 'App ID', render: (row) => `#APP-${row.applicationId}` },
              { key: 'studentName', header: 'Student Name', render: (row) => <strong>{row.studentName}</strong> },
              { key: 'departmentCode', header: 'Dept' },
              { key: 'cgpa', header: 'CGPA' },
              { key: 'companyName', header: 'Company' },
              { key: 'roleTitle', header: 'Role' },
              {
                key: 'appliedAt',
                header: 'Applied Date',
                render: (row) => (row.appliedAt ? formatDeadline(row.appliedAt.split('T')[0]) : 'Recent'),
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) => <StatusBadge value={row.status} />,
              },
              {
                key: 'actions',
                header: 'Action',
                render: (row) => (
                  <button
                    type="button"
                    className="btn"
                    style={{ padding: '0.25rem 0.65rem', fontSize: '0.8rem' }}
                    onClick={() => {
                      setEditingApp(row)
                      setNewStatus(row.status)
                      setStatusRemarks(row.remarks || '')
                    }}
                  >
                    Change Status
                  </button>
                ),
              },
            ]}
            rows={rows}
            empty="No candidate records match your search."
          />
        )}
      </section>

      {/* Change Status Modal */}
      {editingApp && (
        <Modal
          title={`Update Selection Status: ${editingApp.studentName}`}
          onClose={() => setEditingApp(null)}
        >
          <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              Drive: {editingApp.companyName} — {editingApp.roleTitle}
            </p>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>
                Application Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                <option value="APPLIED">APPLIED</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="SELECTED">SELECTED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>
                Remarks / Evaluation Note
              </label>
              <textarea
                rows="3"
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
                placeholder="e.g. Cleared final executive HR interview round."
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn" onClick={() => setEditingApp(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                {actionLoading ? 'Updating...' : 'Update Application'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

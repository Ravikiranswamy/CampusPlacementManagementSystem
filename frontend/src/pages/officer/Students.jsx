import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import Modal from '../../components/ui/Modal.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { matchesQuery } from '../../data/mockData.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'
import { Users, Ban, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react'

export default function Students() {
  const query = usePageQuery()
  const [students, setStudents] = useState([])
  const [departments, setDepartments] = useState([])
  const [restrictions, setRestrictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDept, setSelectedDept] = useState('all')

  // Block Modal
  const [blockingStudent, setBlockingStudent] = useState(null)
  const [blockReason, setBlockReason] = useState('Disciplinary violation of campus recruitment code of conduct')
  const [actionLoading, setActionLoading] = useState(false)

  async function loadData() {
    try {
      setLoading(true)
      const [studentsData, deptsData, restrictionsData] = await Promise.all([
        api.getStudents(),
        api.getDepartments(),
        api.getRestrictions(),
      ])
      setStudents(Array.isArray(studentsData) ? studentsData : [])
      setDepartments(Array.isArray(deptsData) ? deptsData : [])
      setRestrictions(Array.isArray(restrictionsData) ? restrictionsData : [])
    } catch (err) {
      console.error('Error loading students:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Map of active restrictions by studentId
  const activeRestrictionsMap = new Map()
  restrictions.forEach((r) => {
    if (r.isActive) {
      activeRestrictionsMap.set(r.studentId, r)
    }
  })

  async function handleBlockStudent(e) {
    e.preventDefault()
    if (!blockingStudent) return
    try {
      setActionLoading(true)
      await api.blockStudent({
        studentId: blockingStudent.studentId,
        officerUserId: 2,
        reason: blockReason,
      })
      alert(`Student ${blockingStudent.fullName} has been placed under placement restriction. (Triggers will block drive registrations).`)
      setBlockingStudent(null)
      await loadData()
    } catch (err) {
      alert(`Failed to block student: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleUnblockStudent(student) {
    const activeRest = activeRestrictionsMap.get(student.studentId)
    if (!activeRest) return
    const unblockReason = prompt('Enter justification for lifting placement restriction:', 'Disciplinary probation completed satisfactorily')
    if (!unblockReason) return

    try {
      await api.unblockStudent(activeRest.restrictionId, {
        officerUserId: 2,
        unblockReason,
      })
      alert(`Restriction lifted for ${student.fullName}!`)
      await loadData()
    } catch (err) {
      alert(`Failed to unblock: ${err.message}`)
    }
  }

  const deptOptions = [
    { value: 'all', label: 'All Departments' },
    ...departments.map((d) => ({ value: d.departmentCode, label: `${d.departmentCode} — ${d.departmentName}` })),
  ]

  const rows = students.filter((s) => {
    const deptMatch = selectedDept === 'all' || s.departmentCode === selectedDept
    const isBlocked = activeRestrictionsMap.has(s.studentId)
    return (
      deptMatch &&
      matchesQuery(query, [
        s.usn,
        s.fullName,
        s.email,
        s.departmentCode,
        isBlocked ? 'Blocked' : 'Active',
      ])
    )
  })

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Registered Students & Placement Eligibility Standing</h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Comprehensive student roster across academic departments with policy restriction controls.
            </p>
          </div>
          <FilterSelect
            label="Department"
            value={selectedDept}
            onChange={setSelectedDept}
            options={deptOptions}
          />
        </div>

        {loading ? (
          <p className="table-empty">Loading student records from Neon database...</p>
        ) : (
          <DataTable
            columns={[
              { key: 'usn', header: 'USN', render: (row) => <strong>{row.usn}</strong> },
              { key: 'fullName', header: 'Student Name' },
              { key: 'departmentCode', header: 'Dept' },
              { key: 'cgpa', header: 'CGPA', render: (row) => <strong>{row.cgpa}</strong> },
              {
                key: 'backlogs',
                header: 'Backlogs',
                render: (row) => (
                  <span style={{ color: row.activeBacklogs > 0 ? '#dc2626' : '#16a34a', fontWeight: 500 }}>
                    {row.activeBacklogs}
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Placement Status',
                render: (row) => {
                  const isBlocked = activeRestrictionsMap.has(row.studentId)
                  if (isBlocked) {
                    return (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#dc2626', fontWeight: 600, fontSize: '0.85rem' }}>
                        <Ban size={14} /> Restricted
                      </span>
                    )
                  }
                  return (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#059669', fontWeight: 500, fontSize: '0.85rem' }}>
                      <CheckCircle size={14} /> Eligible
                    </span>
                  )
                },
              },
              {
                key: 'actions',
                header: 'Policy Enforcement',
                render: (row) => {
                  const isBlocked = activeRestrictionsMap.has(row.studentId)
                  if (isBlocked) {
                    return (
                      <button
                        type="button"
                        style={{
                          background: 'transparent',
                          border: '1px solid #059669',
                          color: '#059669',
                          borderRadius: '4px',
                          padding: '0.25rem 0.65rem',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleUnblockStudent(row)}
                      >
                        Revoke Restriction
                      </button>
                    )
                  }
                  return (
                    <button
                      type="button"
                      style={{
                        background: 'transparent',
                        border: '1px solid #dc2626',
                        color: '#dc2626',
                        borderRadius: '4px',
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => setBlockingStudent(row)}
                    >
                      Impose Block
                    </button>
                  )
                },
              },
            ]}
            rows={rows}
            empty="No students found matching your criteria."
          />
        )}
      </section>

      {/* Block Student Modal */}
      {blockingStudent && (
        <Modal
          title={`Impose Placement Restriction: ${blockingStudent.fullName} (${blockingStudent.usn})`}
          onClose={() => setBlockingStudent(null)}
        >
          <form onSubmit={handleBlockStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#991b1b', fontWeight: 600, fontSize: '0.9rem' }}>
                <ShieldAlert size={18} /> Administrative Action
              </div>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#b91c1c' }}>
                Imposing this restriction will activate DB trigger <code>trg_prevent_blocked_student_apply</code>. The student will be prevented from registering for any placement drives until unblocked.
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                Restriction Reason
              </label>
              <textarea
                rows="3"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="secondary-button" onClick={() => setBlockingStudent(null)}>
                Cancel
              </button>
              <button type="submit" className="primary-button" style={{ background: '#dc2626', borderColor: '#dc2626' }} disabled={actionLoading}>
                {actionLoading ? 'Applying...' : 'Confirm Restriction'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

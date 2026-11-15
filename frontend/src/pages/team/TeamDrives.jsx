import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../api/client.js'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import Modal from '../../components/ui/Modal.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { formatDeadline } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'
import { Plus, Calendar, CheckCircle2, AlertCircle } from 'lucide-react'

export default function TeamDrives() {
  const query = usePageQuery()
  const { session } = useAuth()
  const [drives, setDrives] = useState([])
  const [companies, setCompanies] = useState([])
  const [jobRoles, setJobRoles] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  // Create Drive Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [driveTitle, setDriveTitle] = useState('')
  const [deadline, setDeadline] = useState('2026-12-15')
  const [driveDate, setDriveDate] = useState('2026-12-20')
  const [minCgpa, setMinCgpa] = useState('0.0')
  const [maxBacklogs, setMaxBacklogs] = useState('2')
  const [targetGradYear, setTargetGradYear] = useState('2028')
  const [monthlyStipend, setMonthlyStipend] = useState('')
  const [jd1Url, setJd1Url] = useState('')
  const [jd2Url, setJd2Url] = useState('')
  const [jd3Url, setJd3Url] = useState('')
  const [description, setDescription] = useState('Campus recruitment drive for engineering graduates.')
  const [selectedDeptIds, setSelectedDeptIds] = useState([1, 2, 6, 7])
  const [actionLoading, setActionLoading] = useState(false)

  // Status Change Modal
  const [statusDrive, setStatusDrive] = useState(null)
  const [newStatus, setNewStatus] = useState('PUBLISHED')

  async function loadData() {
    try {
      setLoading(true)
      const [drivesData, companiesData, rolesData, deptsData] = await Promise.all([
        api.getDrives(),
        api.getCompanies(),
        api.getJobRoles(),
        api.getDepartments(),
      ])
      const dList = Array.isArray(drivesData) ? drivesData : []
      const cList = Array.isArray(companiesData) ? companiesData : []
      const rList = Array.isArray(rolesData) ? rolesData : []
      setDrives(dList)
      setCompanies(cList)
      setJobRoles(rList)
      setDepartments(Array.isArray(deptsData) ? deptsData : [])

      if (cList.length > 0) {
        setSelectedCompanyId(cList[0].companyId)
      }
    } catch (err) {
      console.error('Error fetching drives:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter job roles for the selected company in the create modal
  const filteredRoles = jobRoles.filter(
    (r) => String(r.companyId) === String(selectedCompanyId),
  )

  useEffect(() => {
    if (filteredRoles.length > 0) {
      setSelectedRoleId(filteredRoles[0].jobRoleId)
      const comp = companies.find((c) => String(c.companyId) === String(selectedCompanyId))
      setDriveTitle(`${comp?.companyName || 'Company'} Campus Drive - ${filteredRoles[0].roleTitle}`)
    } else {
      setSelectedRoleId('')
    }
  }, [selectedCompanyId, jobRoles])

  async function handleCreateDrive(e) {
    e.preventDefault()
    if (!selectedCompanyId || !selectedRoleId) {
      alert('Please select both a company and a job role.')
      return
    }
    try {
      setActionLoading(true)
      await api.createDrive({
        companyId: Number(selectedCompanyId),
        jobRoleId: Number(selectedRoleId),
        driveTitle,
        registrationDeadline: `${deadline}T23:59:59`,
        driveDate,
        createdByUserId: session?.userId || 8,
        stipendMonthly: monthlyStipend ? Number(monthlyStipend) : null,
        jd1Url: jd1Url.trim() || null,
        jd2Url: jd2Url.trim() || null,
        jd3Url: jd3Url.trim() || null,
        description,
        eligibility: {
          minCgpa: Number(minCgpa || 0),
          maxActiveBacklogs: Number(maxBacklogs || 0),
          eligibleGraduationYear: Number(targetGradYear || 2028),
          eligibleDepartmentIds: selectedDeptIds,
        },
      })
      alert('Placement drive scheduled and published successfully!')
      setIsCreateOpen(false)
      await loadData()
    } catch (err) {
      alert(`Failed to create drive: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleUpdateStatus(e) {
    e.preventDefault()
    if (!statusDrive) return
    try {
      setActionLoading(true)
      await api.updateDriveStatus(statusDrive.driveId, newStatus)
      setStatusDrive(null)
      await loadData()
    } catch (err) {
      alert(`Failed to update status: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  const rows = drives.filter((drive) => {
    const statusMatch = statusFilter === 'all' || drive.status === statusFilter
    return (
      statusMatch &&
      matchesQuery(query, [
        drive.driveId,
        drive.companyName,
        drive.roleTitle,
        drive.workLocation,
        drive.status,
      ])
    )
  })

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Placement Drives Management</h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Schedule, publish, and monitor recruitment drives for partner companies.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <FilterSelect
              label="Drive Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'PUBLISHED', label: 'PUBLISHED' },
                { value: 'DRAFT', label: 'DRAFT' },
                { value: 'CLOSED', label: 'CLOSED' },
                { value: 'CANCELLED', label: 'CANCELLED' },
              ]}
            />
            <button
              type="button"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.85rem' }}
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus size={16} /> Schedule Drive
            </button>
          </div>
        </div>

        {loading ? (
          <p className="table-empty">Loading drives from Neon database...</p>
        ) : (
          <DataTable
            columns={[
              { key: 'driveId', header: 'Drive ID', render: (row) => `#DRV-${row.driveId}` },
              { key: 'companyName', header: 'Company', render: (row) => <strong>{row.companyName}</strong> },
              { key: 'roleTitle', header: 'Role' },
              {
                key: 'package',
                header: 'Package',
                render: (row) => (
                  <span style={{ fontWeight: 600, color: '#047857' }}>
                    {formatPackage(row.packageLpa)}
                  </span>
                ),
              },
              {
                key: 'criteria',
                header: 'Criteria',
                render: (row) => (
                  <span style={{ fontSize: '0.82rem', color: '#4b5563' }}>
                    Min {row.eligibility?.minCgpa ?? 'N/A'} CGPA, {row.eligibility?.maxActiveBacklogs ?? 0} Backlogs
                  </span>
                ),
              },
              {
                key: 'deadline',
                header: 'Deadline',
                render: (row) => (row.registrationDeadline ? formatDeadline(row.registrationDeadline.split('T')[0]) : '—'),
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
                      setStatusDrive(row)
                      setNewStatus(row.status)
                    }}
                  >
                    Change Status
                  </button>
                ),
              },
            ]}
            rows={rows}
            empty="No placement drives found."
          />
        )}
      </section>

      {/* Schedule Drive Modal */}
      {isCreateOpen && (
        <Modal title="Schedule New Placement Drive" onClose={() => setIsCreateOpen(false)}>
          <form onSubmit={handleCreateDrive} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500 }}>Recruiting Company</label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #ccc' }}
                >
                  {companies.map((c) => (
                    <option key={c.companyId} value={c.companyId}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500 }}>Target Job Role</label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #ccc' }}
                >
                  {filteredRoles.length === 0 ? (
                    <option value="">No roles defined for company</option>
                  ) : (
                    filteredRoles.map((r) => (
                      <option key={r.jobRoleId} value={r.jobRoleId}>
                        {r.roleTitle} ({r.packageLpa} LPA)
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500 }}>Drive Title</label>
              <input
                type="text"
                value={driveTitle}
                onChange={(e) => setDriveTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500 }}>Registration Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500 }}>Drive Event Date</label>
                <input
                  type="date"
                  value={driveDate}
                  onChange={(e) => setDriveDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500 }}>Minimum Cutoff CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500 }}>Maximum Backlogs Allowed</label>
                <input
                  type="number"
                  min="0"
                  value={maxBacklogs}
                  onChange={(e) => setMaxBacklogs(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500 }}>Eligible Departments</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                {departments.map((d) => (
                  <label key={d.departmentId} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={selectedDeptIds.includes(d.departmentId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDeptIds([...selectedDeptIds, d.departmentId])
                        } else {
                          setSelectedDeptIds(selectedDeptIds.filter((id) => id !== d.departmentId))
                        }
                      }}
                    />
                    {d.departmentCode}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                {actionLoading ? 'Scheduling...' : 'Publish Drive'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Change Status Modal */}
      {statusDrive && (
        <Modal title={`Update Drive Status: ${statusDrive.companyName}`} onClose={() => setStatusDrive(null)}>
          <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>Drive Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="CLOSED">CLOSED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn" onClick={() => setStatusDrive(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                {actionLoading ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

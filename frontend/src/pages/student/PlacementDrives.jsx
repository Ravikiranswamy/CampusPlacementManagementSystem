import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../api/client.js'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { formatDeadline } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'
import { Briefcase, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function PlacementDrives() {
  const query = usePageQuery()
  const { session } = useAuth()
  const studentId = session?.studentId || 1

  const [drives, setDrives] = useState([])
  const [myApplications, setMyApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('all')
  const [applyingDriveId, setApplyingDriveId] = useState(null)

  async function loadData() {
    try {
      setLoading(true)
      const [drivesData, appsData] = await Promise.all([
        api.getPublishedDrives(),
        api.getStudentApplications(studentId),
      ])
      setDrives(Array.isArray(drivesData) ? drivesData : [])
      setMyApplications(Array.isArray(appsData) ? appsData : [])
      setError(null)
    } catch (err) {
      console.error('Error fetching drives:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId])

  async function handleApply(drive) {
    if (!confirm(`Are you sure you want to apply for ${drive.companyName} - ${drive.roleTitle}?`)) return
    try {
      setApplyingDriveId(drive.driveId)
      await api.applyForDrive({
        studentId,
        driveId: drive.driveId,
        remarks: 'Applied through student university web portal',
      })
      alert(`Application successfully submitted for ${drive.companyName}!`)
      await loadData()
    } catch (err) {
      alert(`Application failed: ${err.message}`)
    } finally {
      setApplyingDriveId(null)
    }
  }

  const appliedDriveIds = new Set(myApplications.map((a) => a.driveId))

  const rows = drives.filter((drive) => {
    const isApplied = appliedDriveIds.has(drive.driveId)
    const statusMatch =
      status === 'all' ||
      (status === 'applied' && isApplied) ||
      (status === 'open' && !isApplied && drive.status === 'PUBLISHED')

    return (
      statusMatch &&
      matchesQuery(query, [
        drive.companyName,
        drive.roleTitle,
        drive.workLocation,
        drive.driveTitle,
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
            <h2>Campus Placement Drives</h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Browse verified recruitment opportunities from leading organizations. Check criteria and apply directly.
            </p>
          </div>
          <FilterSelect
            label="Filter Drives"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All Drives' },
              { value: 'open', label: 'Open to Apply' },
              { value: 'applied', label: 'Already Applied' },
            ]}
          />
        </div>

        {loading ? (
          <p className="table-empty">Loading active placement drives from database...</p>
        ) : (
          <DataTable
            columns={[
              {
                key: 'companyName',
                header: 'Company & Role',
                render: (row) => (
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>{row.companyName}</strong>
                    <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{row.roleTitle}</div>
                  </div>
                ),
              },
              {
                key: 'packageLpa',
                header: 'CTC Package',
                render: (row) => (
                  <span style={{ fontWeight: 600, color: '#047857' }}>
                    {formatPackage(row.packageLpa)}
                  </span>
                ),
              },
              {
                key: 'eligibility',
                header: 'Academic Criteria',
                render: (row) => (
                  <div style={{ fontSize: '0.82rem', color: '#4b5563' }}>
                    <div>Min CGPA: <strong>{row.eligibility?.minCgpa ?? 'N/A'}</strong></div>
                    <div>Max Backlogs: <strong>{row.eligibility?.maxActiveBacklogs ?? 0}</strong></div>
                    <div>
                      Depts:{' '}
                      {row.eligibility?.eligibleDepartments?.map((d) => d.departmentCode).join(', ') || 'All'}
                    </div>
                  </div>
                ),
              },
              {
                key: 'registrationDeadline',
                header: 'Deadline',
                render: (row) => (
                  <div style={{ fontSize: '0.85rem' }}>
                    {formatDeadline(row.registrationDeadline?.split('T')[0])}
                  </div>
                ),
              },
              {
                key: 'workLocation',
                header: 'Location',
                render: (row) => row.workLocation || 'Bangalore',
              },
              {
                key: 'action',
                header: 'Application Action',
                render: (row) => {
                  const isApplied = appliedDriveIds.has(row.driveId)
                  if (isApplied) {
                    return (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          color: '#059669',
                          fontWeight: 500,
                          fontSize: '0.85rem',
                        }}
                      >
                        <CheckCircle size={15} /> Applied
                      </span>
                    )
                  }
                  return (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}
                      disabled={applyingDriveId === row.driveId}
                      onClick={() => handleApply(row)}
                    >
                      {applyingDriveId === row.driveId ? 'Submitting...' : 'Apply Now'}
                    </button>
                  )
                },
              },
            ]}
            rows={rows}
            empty="No placement drives found matching your criteria."
          />
        )}
      </section>
    </div>
  )
}

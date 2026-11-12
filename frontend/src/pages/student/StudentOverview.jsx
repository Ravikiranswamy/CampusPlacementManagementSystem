import { useEffect, useState } from 'react'
import { Briefcase, FileText, BadgeCheck, Send, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../api/client.js'
import DataTable from '../../components/ui/DataTable.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { formatDeadline } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

export default function StudentOverview() {
  const query = usePageQuery()
  const { session } = useAuth()
  const studentId = session?.studentId || 1

  const [student, setStudent] = useState(null)
  const [drives, setDrives] = useState([])
  const [applications, setApplications] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadData() {
    try {
      setLoading(true)
      const [studentData, drivesData, appsData, offersData] = await Promise.all([
        api.getStudentById(studentId),
        api.getPublishedDrives(),
        api.getStudentApplications(studentId),
        api.getStudentOffers(studentId),
      ])
      setStudent(studentData)
      setDrives(Array.isArray(drivesData) ? drivesData : [])
      setApplications(Array.isArray(appsData) ? appsData : [])
      setOffers(Array.isArray(offersData) ? offersData : [])
    } catch (err) {
      console.error('Error loading student overview:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId])

  async function handleApply(drive) {
    try {
      await api.applyForDrive({
        studentId,
        driveId: drive.driveId,
        remarks: 'Applied from student dashboard overview',
      })
      alert(`Applied successfully to ${drive.companyName}!`)
      await loadData()
    } catch (err) {
      alert(`Application failed: ${err.message}`)
    }
  }

  const appliedDriveIds = new Set(applications.map((a) => a.driveId))

  const visibleDrives = drives.filter((drive) =>
    matchesQuery(query, [drive.companyName, drive.roleTitle, drive.workLocation]),
  )

  const visibleApplications = applications.filter((app) =>
    matchesQuery(query, [app.companyName, app.roleTitle, app.status]),
  )

  return (
    <div className="page-stack">
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
          value={`CGPA ${student?.cgpa || '8.75'}`}
          hint={`${student?.activeBacklogs ?? 0} active backlogs`}
        />
        <StatCard
          icon={Send}
          label="Offers Received"
          value={offers.length}
          hint={offers.length > 0 ? 'Offer letter ready' : 'In review'}
        />
      </section>

      {/* Open Placement Drives */}
      <section className="panel">
        <div className="panel-head">
          <h2>Active Placement Drives</h2>
          <p style={{ color: 'var(--color-muted)' }}>
            Recruitment drives accepting applications from the 2027 graduating batch.
          </p>
        </div>
        <DataTable
          columns={[
            {
              key: 'company',
              header: 'Company',
              render: (row) => <strong>{row.companyName}</strong>,
            },
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
              key: 'deadline',
              header: 'Deadline',
              render: (row) => formatDeadline(row.registrationDeadline?.split('T')[0]),
            },
            {
              key: 'action',
              header: 'Action',
              render: (row) => {
                const isApplied = appliedDriveIds.has(row.driveId)
                if (isApplied) {
                  return (
                    <span style={{ color: '#059669', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <CheckCircle2 size={15} /> Applied
                    </span>
                  )
                }
                return (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => handleApply(row)}
                  >
                    Apply Now
                  </button>
                )
              },
            },
          ]}
          rows={visibleDrives}
          empty="No active drives currently scheduled."
        />
      </section>

      {/* Recent Applications */}
      <section className="panel">
        <div className="panel-head">
          <h2>My Recent Applications</h2>
          <p style={{ color: 'var(--color-muted)' }}>Real-time status updates from recruitment drives.</p>
        </div>
        <DataTable
          columns={[
            {
              key: 'applicationId',
              header: 'App ID',
              render: (row) => `#APP-${row.applicationId}`,
            },
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
          ]}
          rows={visibleApplications}
          empty="You have not submitted any applications yet."
        />
      </section>
    </div>
  )
}

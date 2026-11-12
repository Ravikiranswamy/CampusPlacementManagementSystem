import { useEffect, useState } from 'react'
import { Building, Briefcase, CalendarDays, Users, CheckCircle } from 'lucide-react'
import { api } from '../../api/client.js'
import DataTable from '../../components/ui/DataTable.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { formatDeadline } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

export default function TeamOverview() {
  const query = usePageQuery()
  const [companies, setCompanies] = useState([])
  const [jobRoles, setJobRoles] = useState([])
  const [drives, setDrives] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadData() {
    try {
      setLoading(true)
      const [companiesData, rolesData, drivesData, appsData] = await Promise.all([
        api.getCompanies(),
        api.getJobRoles(),
        api.getDrives(),
        api.getApplications(),
      ])
      setCompanies(Array.isArray(companiesData) ? companiesData : [])
      setJobRoles(Array.isArray(rolesData) ? rolesData : [])
      setDrives(Array.isArray(drivesData) ? drivesData : [])
      setApplications(Array.isArray(appsData) ? appsData : [])
    } catch (err) {
      console.error('Error loading team overview:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const publishedDrives = drives.filter((d) => d.status === 'PUBLISHED')

  const visibleDrives = drives.filter((drive) =>
    matchesQuery(query, [drive.companyName, drive.roleTitle, drive.workLocation, drive.status]),
  )

  return (
    <div className="page-stack">
      {/* Team KPI Cards */}
      <section className="stat-grid" aria-label="Placement team recruitment metrics">
        <StatCard
          icon={Building}
          label="Partner Companies"
          value={companies.length}
          hint="Active hiring recruiters"
        />
        <StatCard
          icon={Briefcase}
          label="Job Roles"
          value={jobRoles.length}
          hint="Profiles in talent catalog"
        />
        <StatCard
          icon={CalendarDays}
          label="Active Drives"
          value={publishedDrives.length}
          hint="Accepting applications"
        />
        <StatCard
          icon={Users}
          label="Total Applications"
          value={applications.length}
          hint="Across all drives"
        />
      </section>

      {/* Recruitment Drives Pipeline */}
      <section className="panel">
        <div className="panel-head">
          <h2>Recruitment Drives Pipeline</h2>
          <p style={{ color: 'var(--color-muted)' }}>
            Active and scheduled placement drives managed by the university placement cell.
          </p>
        </div>
        <DataTable
          columns={[
            { key: 'driveId', header: 'Drive ID', render: (row) => `#DRV-${row.driveId}` },
            { key: 'companyName', header: 'Company', render: (row) => <strong>{row.companyName}</strong> },
            { key: 'roleTitle', header: 'Role Title' },
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
              render: (row) => (row.registrationDeadline ? formatDeadline(row.registrationDeadline.split('T')[0]) : '—'),
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusBadge value={row.status} />,
            },
          ]}
          rows={visibleDrives}
          empty="No placement drives found."
        />
      </section>
    </div>
  )
}

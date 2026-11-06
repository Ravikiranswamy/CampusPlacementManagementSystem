import { BadgeCheck, Briefcase, Building, CalendarDays } from 'lucide-react'
import DataTable from '../../components/ui/DataTable.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { useData } from '../../context/DataContext.jsx'
import { usePageQuery } from '../../hooks/usePageQuery.js'

export default function TeamOverview() {
  const query = usePageQuery()
  const { companies, drives, jobRoles } = useData()
  const openDrives = drives.filter((drive) => drive.status === 'Open')
  const visible = openDrives.filter((drive) =>
    matchesQuery(query, [drive.company, drive.role, drive.location, drive.id]),
  )

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="stat-grid" aria-label="Placement team summary">
        <StatCard icon={Building} label="Companies" value={companies.length} hint="On the sample roster" />
        <StatCard icon={Briefcase} label="Job roles" value={jobRoles.length} hint="Including internships" />
        <StatCard icon={CalendarDays} label="Open drives" value={openDrives.length} hint="Currently accepting" />
        <StatCard icon={BadgeCheck} label="Eligibility rules" value={drives.length} hint="One rule set per drive" />
      </section>
      <section className="panel">
        <div className="panel-head">
          <h2>Active drives</h2>
          <p>Drives the placement team is still running.</p>
        </div>
        <DataTable
          columns={[
            { key: 'id', header: 'Drive' },
            { key: 'company', header: 'Company' },
            { key: 'role', header: 'Role' },
            { key: 'package', header: 'Package', render: (row) => formatPackage(row.packageLpa) },
            { key: 'applicants', header: 'Applicants' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          rows={visible}
          empty="No active drives match that search."
        />
      </section>
    </div>
  )
}

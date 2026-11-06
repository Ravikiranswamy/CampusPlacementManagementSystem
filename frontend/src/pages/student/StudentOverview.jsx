import { BadgeCheck, Briefcase, FileText, Send } from 'lucide-react'
import DataTable from '../../components/ui/DataTable.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import {
  applications,
  formatPackage,
  isEligible,
  matchesQuery,
  sampleStudent,
} from '../../data/mockData.js'
import { useData } from '../../context/DataContext.jsx'
import { formatDeadline } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

export default function StudentOverview() {
  const query = usePageQuery()
  const { drives } = useData()
  const openDrives = drives.filter((drive) => drive.status === 'Open')
  const eligibleCount = openDrives.filter((drive) => isEligible(sampleStudent, drive)).length
  const visibleDrives = openDrives.filter((drive) =>
    matchesQuery(query, [drive.company, drive.role, drive.location, drive.id]),
  )
  const visibleApplications = applications.filter((item) =>
    matchesQuery(query, [item.company, item.role, item.status, item.id]),
  )

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="stat-grid" aria-label="Student summary">
        <StatCard icon={Briefcase} label="Open drives" value={openDrives.length} hint="Accepting applications" />
        <StatCard icon={FileText} label="My applications" value={applications.length} hint="Across this placement season" />
        <StatCard icon={BadgeCheck} label="Eligible now" value={eligibleCount} hint="Open drives you can apply to" />
        <StatCard icon={Send} label="Offers" value={applications.filter((item) => item.status === 'Offered').length} hint="Sample offer count" />
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Open placement drives</h2>
          <p>Upcoming drives from the sample calendar.</p>
        </div>
        <DataTable
          columns={[
            { key: 'company', header: 'Company' },
            { key: 'role', header: 'Role' },
            { key: 'package', header: 'Package', render: (row) => formatPackage(row.packageLpa) },
            { key: 'deadline', header: 'Deadline', render: (row) => formatDeadline(row.deadline) },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          rows={visibleDrives}
          empty="No open drives match that search."
        />
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Recent applications</h2>
          <p>Status for {sampleStudent.name}.</p>
        </div>
        <DataTable
          columns={[
            { key: 'id', header: 'Application' },
            { key: 'company', header: 'Company' },
            { key: 'role', header: 'Role' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          rows={visibleApplications}
          empty="No applications match that search."
        />
      </section>
    </div>
  )
}

import { ListChecks, ScrollText, UserCheck, Users } from 'lucide-react'
import DataTable from '../../components/ui/DataTable.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { departmentStats, matchesQuery } from '../../data/mockData.js'
import { useData } from '../../context/DataContext.jsx'
import { usePageQuery } from '../../hooks/usePageQuery.js'

export default function OfficerOverview() {
  const query = usePageQuery()
  const { offers, selections, students } = useData()
  const placed = departmentStats.reduce((sum, row) => sum + row.placed, 0)
  const registered = departmentStats.reduce((sum, row) => sum + row.registered, 0)
  const visibleOffers = offers.filter((offer) =>
    matchesQuery(query, [offer.student, offer.company, offer.role, offer.status]),
  )

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="stat-grid" aria-label="Placement officer summary">
        <StatCard icon={Users} label="Students" value={students.length} hint="Rows in the sample list" />
        <StatCard icon={UserCheck} label="Placed" value={placed} hint={`Of ${registered} registered in the batch summary`} />
        <StatCard icon={ListChecks} label="Selection rows" value={selections.length} hint="Latest round updates" />
        <StatCard
          icon={ScrollText}
          label="Open offers"
          value={offers.filter((offer) => offer.status === 'Released').length}
          hint="Waiting for a student response"
        />
      </section>
      <section className="panel">
        <div className="panel-head">
          <h2>Latest offers</h2>
          <p>Offer letters in the sample season.</p>
        </div>
        <DataTable
          columns={[
            { key: 'student', header: 'Student' },
            { key: 'company', header: 'Company' },
            { key: 'role', header: 'Role' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          rows={visibleOffers}
          empty="No offers match that search."
        />
      </section>
    </div>
  )
}

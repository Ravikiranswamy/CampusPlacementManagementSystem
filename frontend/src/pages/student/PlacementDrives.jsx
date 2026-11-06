import { useState } from 'react'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { useData } from '../../context/DataContext.jsx'
import { formatDeadline } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

export default function PlacementDrives() {
  const query = usePageQuery()
  const { drives } = useData()
  const [status, setStatus] = useState('all')
  const rows = drives.filter((drive) => {
    const statusOk = status === 'all' || drive.status === status
    return statusOk && matchesQuery(query, [drive.company, drive.role, drive.location, drive.id, drive.status])
  })

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="panel">
        <div className="panel-head">
          <h2>Available placement drives</h2>
          <p>Search from the top bar, or narrow the list by drive status.</p>
        </div>
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'Open', label: 'Open' },
            { value: 'Closed', label: 'Closed' },
          ]}
        />
        <DataTable
          columns={[
            { key: 'id', header: 'Drive' },
            { key: 'company', header: 'Company' },
            { key: 'role', header: 'Role' },
            { key: 'location', header: 'Location' },
            { key: 'package', header: 'Package', render: (row) => formatPackage(row.packageLpa) },
            { key: 'deadline', header: 'Deadline', render: (row) => formatDeadline(row.deadline) },
            { key: 'applicants', header: 'Applicants' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          rows={rows}
          empty="No drives match those filters."
        />
      </section>
    </div>
  )
}

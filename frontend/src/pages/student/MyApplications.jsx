import { useState } from 'react'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { applications, matchesQuery } from '../../data/mockData.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

const statuses = ['Applied', 'Shortlisted', 'Offered', 'Rejected']

export default function MyApplications() {
  const query = usePageQuery()
  const [status, setStatus] = useState('all')
  const rows = applications.filter((item) => {
    const statusOk = status === 'all' || item.status === status
    return statusOk && matchesQuery(query, [item.id, item.company, item.role, item.status])
  })

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="panel">
        <div className="panel-head">
          <h2>My applications</h2>
          <p>Applications filed by the sample student.</p>
        </div>
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'all', label: 'All statuses' },
            ...statuses.map((item) => ({ value: item, label: item })),
          ]}
        />
        <DataTable
          columns={[
            { key: 'id', header: 'Application' },
            { key: 'company', header: 'Company' },
            { key: 'role', header: 'Role' },
            { key: 'appliedOn', header: 'Applied' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          rows={rows}
          empty="No applications match those filters."
        />
      </section>
    </div>
  )
}

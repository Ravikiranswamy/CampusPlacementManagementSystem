import DataTable from '../../components/ui/DataTable.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import { matchesQuery } from '../../data/mockData.js'
import { useData } from '../../context/DataContext.jsx'
import { usePageQuery } from '../../hooks/usePageQuery.js'

export default function TeamEligibility() {
  const query = usePageQuery()
  const { drives } = useData()
  const rows = drives
    .map((drive) => ({
      ...drive,
      branchesLabel: drive.branches.join(', '),
    }))
    .filter((drive) => matchesQuery(query, [drive.company, drive.role, drive.branchesLabel, drive.id]))

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="panel">
        <div className="panel-head">
          <h2>Eligibility management</h2>
          <p>Criteria attached to each sample drive.</p>
        </div>
        <DataTable
          columns={[
            { key: 'id', header: 'Drive' },
            { key: 'company', header: 'Company' },
            { key: 'role', header: 'Role' },
            { key: 'minCgpa', header: 'Min CGPA' },
            { key: 'maxBacklogs', header: 'Max backlogs' },
            { key: 'branchesLabel', header: 'Branches' },
          ]}
          rows={rows}
          empty="No rules match that search."
        />
      </section>
    </div>
  )
}

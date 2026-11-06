import DataTable from '../../components/ui/DataTable.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { isEligible, matchesQuery, sampleStudent } from '../../data/mockData.js'
import { useData } from '../../context/DataContext.jsx'
import { usePageQuery } from '../../hooks/usePageQuery.js'

export default function Eligibility() {
  const query = usePageQuery()
  const { drives } = useData()
  const rows = drives
    .map((drive) => ({
      ...drive,
      result: isEligible(sampleStudent, drive) ? 'Eligible' : 'Not eligible',
      rule: `${drive.minCgpa} CGPA, ${drive.maxBacklogs} backlog, ${drive.branches.join(', ')}`,
    }))
    .filter((drive) => matchesQuery(query, [drive.company, drive.role, drive.result, drive.rule]))

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="panel">
        <div className="panel-head">
          <h2>Eligibility for {sampleStudent.name}</h2>
          <p>
            {sampleStudent.department}, CGPA {sampleStudent.cgpa}, {sampleStudent.backlogs} active backlogs.
          </p>
        </div>
        <DataTable
          columns={[
            { key: 'company', header: 'Company' },
            { key: 'role', header: 'Role' },
            { key: 'rule', header: 'Criteria' },
            { key: 'result', header: 'Result', render: (row) => <StatusBadge value={row.result} /> },
          ]}
          rows={rows}
          empty="No drives match that search."
        />
      </section>
    </div>
  )
}

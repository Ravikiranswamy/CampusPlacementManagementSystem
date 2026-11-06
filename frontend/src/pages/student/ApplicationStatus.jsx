import SampleNote from '../../components/ui/SampleNote.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { applications, matchesQuery } from '../../data/mockData.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

const flow = ['Applied', 'Shortlisted', 'Selected', 'Offered']

function reachedIndex(status) {
  if (status === 'Rejected') return 0
  if (status === 'Offered') return 3
  if (status === 'Selected') return 2
  if (status === 'Shortlisted') return 1
  return 0
}

export default function ApplicationStatus() {
  const query = usePageQuery()
  const rows = applications.filter((item) =>
    matchesQuery(query, [item.id, item.company, item.role, item.status]),
  )

  return (
    <div className="page-stack">
      <SampleNote />
      {rows.length === 0 ? (
        <section className="panel">
          <p className="table-empty">No applications match that search.</p>
        </section>
      ) : (
        rows.map((item) => {
          const current = reachedIndex(item.status)
          return (
            <section className="panel" key={item.id}>
              <div className="panel-head row-head">
                <div>
                  <h2>
                    {item.company} · {item.role}
                  </h2>
                  <p>
                    {item.id} · applied {item.appliedOn}
                  </p>
                </div>
                <StatusBadge value={item.status} />
              </div>
              <ol className="timeline">
                {flow.map((step, index) => {
                  let state = 'upcoming'
                  if (item.status === 'Rejected' && index === 0) state = 'rejected'
                  else if (index < current) state = 'done'
                  else if (index === current && item.status !== 'Rejected') state = 'current'
                  return (
                    <li key={step} className={`timeline-step ${state}`}>
                      {step}
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })
      )}
    </div>
  )
}

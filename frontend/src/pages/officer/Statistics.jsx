import SampleNote from '../../components/ui/SampleNote.jsx'
import { departmentStats, matchesQuery } from '../../data/mockData.js'
import { useData } from '../../context/DataContext.jsx'
import { usePageQuery } from '../../hooks/usePageQuery.js'

export default function Statistics() {
  const query = usePageQuery()
  const { offers } = useData()
  const departments = departmentStats.filter((row) =>
    matchesQuery(query, [row.department, row.registered, row.placed]),
  )
  const byCompany = Object.values(
    offers.reduce((groups, offer) => {
      const current = groups[offer.company] ?? { id: offer.company, company: offer.company, count: 0 }
      current.count += 1
      groups[offer.company] = current
      return groups
    }, {}),
  ).filter((row) => matchesQuery(query, [row.company]))

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="panel">
        <div className="panel-head">
          <h2>Placement by department</h2>
          <p>Placed students against the registered batch in the sample summary.</p>
        </div>
        {departments.length === 0 ? (
          <p className="table-empty">No departments match that search.</p>
        ) : (
          <div className="bar-list">
            {departments.map((row) => {
              const percent = Math.round((row.placed / row.registered) * 100)
              return (
                <div className="bar-row" key={row.id}>
                  <div className="bar-label">
                    <span>{row.department}</span>
                    <span>
                      {row.placed} / {row.registered} · {percent}%
                    </span>
                  </div>
                  <div className="bar-track" aria-hidden="true">
                    <div className="bar-fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
      <section className="panel">
        <div className="panel-head">
          <h2>Offers by company</h2>
          <p>Count of sample offer letters, not a live placement report.</p>
        </div>
        {byCompany.length === 0 ? (
          <p className="table-empty">No companies match that search.</p>
        ) : (
          <div className="bar-list">
            {byCompany.map((row) => (
              <div className="bar-row" key={row.id}>
                <div className="bar-label">
                  <span>{row.company}</span>
                  <span>{row.count}</span>
                </div>
                <div className="bar-track" aria-hidden="true">
                  <div className="bar-fill gold" style={{ width: `${(row.count / offers.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

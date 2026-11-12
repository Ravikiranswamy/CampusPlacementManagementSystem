import { useData } from '../../context/DataContext.jsx'
import { matchesQuery } from '../../data/mockData.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

export default function Statistics() {
  const query = usePageQuery()
  const { placementReports, packageReports, offers } = useData()

  const filteredPlacementReports = (placementReports || []).filter((row) =>
    matchesQuery(query, [row.companyName, row.departmentCode, row.departmentName]),
  )

  const filteredPackageReports = (packageReports || []).filter((row) =>
    matchesQuery(query, [row.companyName]),
  )

  return (
    <div className="page-stack">
      {/* REPORT 1: Company-wise & Department-wise Placement Statistics */}
      <section className="panel">
        <div className="panel-head">
          <h2>Report 1: Department & Company Placement Analytics</h2>
          <p>
            Real-time aggregate data from Neon PostgreSQL database tracking applications, selections, and accepted offers.
          </p>
        </div>

        {filteredPlacementReports.length === 0 ? (
          <p className="table-empty">No placement records match that query.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Dept Code</th>
                  <th>Department Name</th>
                  <th>Applications</th>
                  <th>Selected</th>
                  <th>Offers Issued</th>
                  <th>Accepted Offers</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlacementReports.map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.companyName}</strong></td>
                    <td>{row.departmentCode}</td>
                    <td>{row.departmentName}</td>
                    <td>{row.totalApplications}</td>
                    <td>{row.selectedStudents}</td>
                    <td>{row.totalOffers}</td>
                    <td><span className="badge badge-success">{row.acceptedOffers}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* REPORT 2: Average and Highest Package Analysis */}
      <section className="panel">
        <div className="panel-head">
          <h2>Report 2: CTC Package Analysis (Highest & Average)</h2>
          <p>
            Statistical breakdown of compensation packages (LPA) across participating recruitment companies.
          </p>
        </div>

        {filteredPackageReports.length === 0 ? (
          <p className="table-empty">No package records match that query.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Accepted Placements</th>
                  <th>Average Package (LPA)</th>
                  <th>Highest Package (LPA)</th>
                  <th>Lowest Package (LPA)</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackageReports.map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.companyName}</strong></td>
                    <td>{row.acceptedPlacements}</td>
                    <td><strong>₹ {Number(row.averagePackageLpa).toFixed(2)} LPA</strong></td>
                    <td style={{ color: '#16a34a' }}>₹ {Number(row.highestPackageLpa).toFixed(2)} LPA</td>
                    <td>₹ {Number(row.lowestPackageLpa).toFixed(2)} LPA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

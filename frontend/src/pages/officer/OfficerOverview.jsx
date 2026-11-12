import { useEffect, useState } from 'react'
import { Users, Briefcase, Award, TrendingUp, CheckCircle, ArrowUpRight } from 'lucide-react'
import { api } from '../../api/client.js'
import DataTable from '../../components/ui/DataTable.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { formatDeadline } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

export default function OfficerOverview() {
  const query = usePageQuery()
  const [students, setStudents] = useState([])
  const [drives, setDrives] = useState([])
  const [applications, setApplications] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadData() {
    try {
      setLoading(true)
      const [studentsData, drivesData, appsData, offersData] = await Promise.all([
        api.getStudents(),
        api.getDrives(),
        api.getApplications(),
        api.getOffers(),
      ])
      setStudents(Array.isArray(studentsData) ? studentsData : [])
      setDrives(Array.isArray(drivesData) ? drivesData : [])
      setApplications(Array.isArray(appsData) ? appsData : [])
      setOffers(Array.isArray(offersData) ? offersData : [])
    } catch (err) {
      console.error('Error loading officer overview:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const acceptedOffers = offers.filter((o) => o.offerStatus === 'ACCEPTED')
  const placedCount = new Set(acceptedOffers.map((o) => o.studentId || o.studentName)).size

  const visibleOffers = offers.filter((offer) =>
    matchesQuery(query, [offer.studentName, offer.companyName, offer.roleTitle, offer.offerStatus]),
  )

  const visibleApplications = applications.filter((app) =>
    matchesQuery(query, [app.studentName, app.companyName, app.roleTitle, app.status]),
  )

  return (
    <div className="page-stack">
      {/* Officer KPI Cards */}
      <section className="stat-grid" aria-label="Placement Officer summary">
        <StatCard
          icon={Users}
          label="Registered Students"
          value={students.length}
          hint="Active graduating batch (2027)"
        />
        <StatCard
          icon={Briefcase}
          label="Placement Drives"
          value={drives.length}
          hint="Scheduled & ongoing recruitment"
        />
        <StatCard
          icon={Award}
          label="Offers Issued"
          value={offers.length}
          hint={`${placedCount} students placed`}
        />
        <StatCard
          icon={TrendingUp}
          label="Applications Filed"
          value={applications.length}
          hint="Across all participating companies"
        />
      </section>

      {/* Latest Offers Table */}
      <section className="panel">
        <div className="panel-head">
          <h2>Campus Placement Offers</h2>
          <p style={{ color: 'var(--color-muted)' }}>
            Official offers released by partner companies in the 2026-27 placement season.
          </p>
        </div>
        <DataTable
          columns={[
            {
              key: 'offerId',
              header: 'Offer ID',
              render: (row) => `#OFF-${row.offerId}`,
            },
            { key: 'studentName', header: 'Student Name', render: (row) => <strong>{row.studentName}</strong> },
            { key: 'companyName', header: 'Company' },
            { key: 'roleTitle', header: 'Role' },
            {
              key: 'package',
              header: 'Package',
              render: (row) => (
                <span style={{ fontWeight: 600, color: '#047857' }}>
                  {formatPackage(row.offeredPackageLpa)}
                </span>
              ),
            },
            {
              key: 'offerDate',
              header: 'Offer Date',
              render: (row) => (row.offerDate ? formatDeadline(row.offerDate) : 'Recent'),
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusBadge value={row.offerStatus} />,
            },
          ]}
          rows={visibleOffers}
          empty="No offer records to display."
        />
      </section>

      {/* Recent Applications Activity */}
      <section className="panel">
        <div className="panel-head">
          <h2>Candidate Application Pipeline</h2>
          <p style={{ color: 'var(--color-muted)' }}>Recent student submissions across scheduled drives.</p>
        </div>
        <DataTable
          columns={[
            { key: 'applicationId', header: 'App ID', render: (row) => `#APP-${row.applicationId}` },
            { key: 'studentName', header: 'Candidate' },
            { key: 'departmentCode', header: 'Department' },
            { key: 'companyName', header: 'Company' },
            { key: 'roleTitle', header: 'Role' },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusBadge value={row.status} />,
            },
          ]}
          rows={visibleApplications}
          empty="No student applications recorded."
        />
      </section>
    </div>
  )
}

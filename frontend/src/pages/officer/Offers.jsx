import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import Modal from '../../components/ui/Modal.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { formatDeadline } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'
import { Plus, Award, ShieldCheck, ExternalLink } from 'lucide-react'

export default function Offers() {
  const query = usePageQuery()
  const [offers, setOffers] = useState([])
  const [selectedApps, setSelectedApps] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  // Issue Offer Modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState('')
  const [packageLpa, setPackageLpa] = useState('18.0')
  const [joiningDate, setJoiningDate] = useState('2027-07-01')
  const [offerLetterUrl, setOfferLetterUrl] = useState('https://storage.placement.edu/offers/letter.pdf')
  const [notes, setNotes] = useState('Base salary with performance incentives and health benefits.')
  const [actionLoading, setActionLoading] = useState(false)

  async function loadData() {
    try {
      setLoading(true)
      const [offersData, appsData, logsData] = await Promise.all([
        api.getOffers(),
        api.getApplications(),
        api.getAuditLogs(),
      ])
      setOffers(Array.isArray(offersData) ? offersData : [])
      const apps = Array.isArray(appsData) ? appsData : []
      const eligibleForOffer = apps.filter((a) => a.status === 'SELECTED' || a.status === 'UNDER_REVIEW')
      setSelectedApps(eligibleForOffer)
      if (eligibleForOffer.length > 0) setSelectedAppId(eligibleForOffer[0].applicationId)
      setAuditLogs(Array.isArray(logsData) ? logsData : [])
    } catch (err) {
      console.error('Error loading offers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleIssueOffer(e) {
    e.preventDefault()
    if (!selectedAppId) return
    try {
      setActionLoading(true)
      await api.createOffer({
        applicationId: Number(selectedAppId),
        offeredPackageLpa: Number(packageLpa),
        joiningDate: joiningDate || null,
        offerLetterUrl: offerLetterUrl || null,
        additionalInfo: notes || null,
      })
      alert('Offer letter formally issued! DB trigger trg_audit_offer_insert has logged this event.')
      setIsIssueModalOpen(false)
      await loadData()
    } catch (err) {
      alert(`Failed to issue offer: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  const rows = offers.filter((offer) => {
    const statusMatch = statusFilter === 'all' || offer.offerStatus === statusFilter
    return (
      statusMatch &&
      matchesQuery(query, [
        offer.offerId,
        offer.studentName,
        offer.companyName,
        offer.roleTitle,
        offer.offerStatus,
      ])
    )
  })

  return (
    <div className="page-stack">
      {/* Offers Management Panel */}
      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Official Offer Letters & Compensation</h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Issue formal employment offers to selected students. All issuances are auto-audited via database triggers.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <FilterSelect
              label="Offer Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Offers' },
                { value: 'OFFERED', label: 'OFFERED' },
                { value: 'ACCEPTED', label: 'ACCEPTED' },
                { value: 'REJECTED', label: 'REJECTED' },
              ]}
            />
            <button
              type="button"
              className="primary-button compact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.85rem' }}
              onClick={() => setIsIssueModalOpen(true)}
            >
              <Plus size={16} /> Issue Offer
            </button>
          </div>
        </div>

        {loading ? (
          <p className="table-empty">Loading offers from database...</p>
        ) : (
          <DataTable
            columns={[
              { key: 'offerId', header: 'Offer ID', render: (row) => `#OFF-${row.offerId}` },
              { key: 'studentName', header: 'Student', render: (row) => <strong>{row.studentName}</strong> },
              { key: 'companyName', header: 'Company' },
              { key: 'roleTitle', header: 'Role' },
              {
                key: 'package',
                header: 'Offered CTC',
                render: (row) => (
                  <span style={{ fontWeight: 600, color: '#059669' }}>
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
            rows={rows}
            empty="No offer letters have been issued yet."
          />
        )}
      </section>

      {/* Database Trigger Audit Trail */}
      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} style={{ color: '#2563eb' }} />
          <div>
            <h2 style={{ margin: 0 }}>Automated Database Audit Trail (Trigger: trg_audit_offer_insert)</h2>
            <p style={{ color: 'var(--color-muted)', margin: '0.2rem 0 0' }}>
              Tamper-proof PostgreSQL system logs automatically populated whenever an offer record is inserted.
            </p>
          </div>
        </div>

        {auditLogs.length === 0 ? (
          <p className="table-empty">No audit logs recorded yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Action Type</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>System Action Detail</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.logId}>
                    <td>#{log.logId}</td>
                    <td>
                      <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {log.actionType}
                      </span>
                    </td>
                    <td>{log.entityName}</td>
                    <td>#{log.entityId}</td>
                    <td>{log.actionDetail}</td>
                    <td style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                      {log.performedAt ? log.performedAt.replace('T', ' ').substring(0, 19) : 'Just now'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Issue Offer Modal */}
      {isIssueModalOpen && (
        <Modal title="Issue Official Employment Offer" onClose={() => setIsIssueModalOpen(false)}>
          <form onSubmit={handleIssueOffer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>
                Select Candidate & Drive
              </label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                {selectedApps.map((a) => (
                  <option key={a.applicationId} value={a.applicationId}>
                    #APP-{a.applicationId}: {a.studentName} ({a.departmentCode}) — {a.companyName} ({a.roleTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>
                Offered Package (LPA)
              </label>
              <input
                type="number"
                step="0.25"
                min="1"
                value={packageLpa}
                onChange={(e) => setPackageLpa(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>
                Anticipated Joining Date
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>
                Offer Letter Document Link
              </label>
              <input
                type="url"
                value={offerLetterUrl}
                onChange={(e) => setOfferLetterUrl(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>
                Additional Notes
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="secondary-button" onClick={() => setIsIssueModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="primary-button" disabled={actionLoading}>
                {actionLoading ? 'Issuing...' : 'Issue Offer Letter'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

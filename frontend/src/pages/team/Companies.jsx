import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import Modal from '../../components/ui/Modal.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { Loader2, AlertCircle, Plus, RefreshCw } from 'lucide-react'

const emptyCompany = {
  companyId: null,
  name: '',
  industry: '',
  contactPerson: '',
  contactEmail: '',
  website: '',
  isActive: true,
}

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')

  async function loadCompanies() {
    setLoading(true)
    setError('')
    try {
      const data = await api.getCompanies()
      setCompanies(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load companies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCompanies() }, [])

  const filtered = companies.filter((c) => {
    const q = search.toLowerCase()
    return (
      !q ||
      (c.name || '').toLowerCase().includes(q) ||
      (c.industry || '').toLowerCase().includes(q) ||
      (c.contactPerson || '').toLowerCase().includes(q)
    )
  })

  async function handleSave(e) {
    e.preventDefault()
    setFormError('')
    const form = new FormData(e.target)
    const values = Object.fromEntries(form.entries())

    if (!values.name?.trim()) return setFormError('Company name is required.')
    if (!values.industry?.trim()) return setFormError('Industry is required.')
    if (!values.contactPerson?.trim()) return setFormError('Contact person is required.')
    if (values.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail)) {
      return setFormError('Enter a valid contact email.')
    }

    setSaving(true)
    try {
      const payload = {
        name: values.name.trim(),
        industry: values.industry.trim(),
        contactPerson: values.contactPerson.trim(),
        contactEmail: values.contactEmail?.trim() || null,
        website: values.website?.trim() || null,
        isActive: values.isActive === 'true',
      }

      if (editing.companyId) {
        await api.updateCompany(editing.companyId, payload)
      } else {
        await api.createCompany(payload)
      }
      setEditing(null)
      await loadCompanies()
    } catch (err) {
      setFormError(err.message || 'Failed to save company.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleStatus(company) {
    try {
      await api.toggleCompanyStatus(company.companyId)
      await loadCompanies()
    } catch (err) {
      setError(err.message || 'Failed to toggle status.')
    }
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-head row-head">
          <div>
            <h2>Company Management</h2>
            <p>Add and manage recruiting companies. Data is saved to the database.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="secondary-button compact"
              onClick={loadCompanies}
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            <button
              type="button"
              className="primary-button compact"
              onClick={() => setEditing({ ...emptyCompany })}
            >
              <Plus size={15} /> Add Company
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search by name, industry, or contact…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '0.55rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: '#f1f5f9',
              width: '100%',
              maxWidth: '360px',
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '0.5rem' }}>Loading companies…</p>
          </div>
        ) : error ? (
          <div className="login-error-alert">
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        ) : (
          <DataTable
            columns={[
              { key: 'companyId', header: 'ID' },
              { key: 'name', header: 'Company' },
              { key: 'industry', header: 'Industry' },
              { key: 'contactPerson', header: 'Contact' },
              { key: 'contactEmail', header: 'Email' },
              {
                key: 'isActive',
                header: 'Status',
                render: (row) => (
                  <StatusBadge value={row.isActive ? 'Active' : 'Inactive'} />
                ),
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => (
                  <div className="row-actions">
                    <button type="button" className="action-button" onClick={() => setViewing(row)}>
                      View
                    </button>
                    <button type="button" className="action-button" onClick={() => { setEditing(row); setFormError('') }}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="action-button"
                      onClick={() => handleToggleStatus(row)}
                      title={row.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {row.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                ),
              },
            ]}
            rows={filtered}
            empty="No companies found. Add your first company using the button above."
          />
        )}
      </section>

      {/* Add/Edit Modal */}
      {editing !== null && (
        <Modal
          title={editing.companyId ? 'Edit Company' : 'Add Company'}
          onClose={() => { setEditing(null); setFormError('') }}
        >
          <form onSubmit={handleSave} noValidate>
            {[
              { name: 'name', label: 'Company Name *', placeholder: 'e.g. Google India', defaultValue: editing.name },
              { name: 'industry', label: 'Industry *', placeholder: 'e.g. Technology', defaultValue: editing.industry },
              { name: 'contactPerson', label: 'Contact Person *', placeholder: 'e.g. HR Manager', defaultValue: editing.contactPerson },
              { name: 'contactEmail', label: 'Contact Email', placeholder: 'hr@company.com', defaultValue: editing.contactEmail || '' },
              { name: 'website', label: 'Website', placeholder: 'https://company.com', defaultValue: editing.website || '' },
            ].map((f) => (
              <div key={f.name} style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                  {f.label}
                </label>
                <input
                  name={f.name}
                  type="text"
                  placeholder={f.placeholder}
                  defaultValue={f.defaultValue}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    background: '#1e293b',
                    color: '#f1f5f9',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                Status
              </label>
              <select
                name="isActive"
                defaultValue={editing.isActive ? 'true' : 'false'}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#1e293b',
                  color: '#f1f5f9',
                }}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {formError && (
              <div className="login-error-alert" style={{ marginBottom: '0.75rem' }}>
                <AlertCircle size={14} /> <span>{formError}</span>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => { setEditing(null); setFormError('') }}
              >
                Cancel
              </button>
              <button type="submit" className="primary-button compact" disabled={saving}>
                {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                {editing.companyId ? 'Save Changes' : 'Add Company'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {viewing && (
        <Modal title={viewing.name} onClose={() => setViewing(null)}>
          <dl className="detail-list">
            {[
              ['ID', viewing.companyId],
              ['Industry', viewing.industry],
              ['Contact Person', viewing.contactPerson],
              ['Contact Email', viewing.contactEmail || '—'],
              ['Website', viewing.website || '—'],
              ['Status', viewing.isActive ? 'Active' : 'Inactive'],
            ].map(([dt, dd]) => (
              <div key={dt}>
                <dt>{dt}</dt>
                <dd>{dd}</dd>
              </div>
            ))}
          </dl>
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={() => setViewing(null)}>
              Close
            </button>
            <button
              type="button"
              className="primary-button compact"
              onClick={() => { setEditing(viewing); setViewing(null); setFormError('') }}
            >
              Edit
            </button>
          </div>
        </Modal>
      )}

      {/* Confirm Delete */}
      {pendingDelete && (
        <ConfirmDialog
          title="Remove Company"
          message={`Remove ${pendingDelete.name} from the platform?`}
          confirmLabel="Remove"
          onCancel={() => setPendingDelete(null)}
          onConfirm={async () => {
            setPendingDelete(null)
          }}
        />
      )}
    </div>
  )
}

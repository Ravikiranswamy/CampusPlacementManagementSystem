import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import Modal from '../../components/ui/Modal.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { Loader2, AlertCircle, Plus, RefreshCw, Building } from 'lucide-react'

const emptyCompany = {
  companyId: null,
  companyName: '',
  industry: '',
  contactEmail: '',
  contactPhone: '',
  website: '',
  address: '',
  description: '',
  isActive: true,
}

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
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

  useEffect(() => {
    loadCompanies()
  }, [])

  const filtered = companies.filter((c) => {
    const q = search.toLowerCase().trim()
    return (
      !q ||
      (c.companyName || '').toLowerCase().includes(q) ||
      (c.industry || '').toLowerCase().includes(q) ||
      (c.contactEmail || '').toLowerCase().includes(q)
    )
  })

  async function handleSave(e) {
    e.preventDefault()
    setFormError('')
    const form = new FormData(e.target)
    const values = Object.fromEntries(form.entries())

    const trimmedName = values.companyName?.trim()
    const trimmedEmail = values.contactEmail?.trim()

    if (!trimmedName) return setFormError('Company name is required.')
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return setFormError('A valid contact email is required.')
    }

    setSaving(true)
    try {
      const payload = {
        companyName: trimmedName,
        industry: values.industry?.trim() || null,
        contactEmail: trimmedEmail,
        contactPhone: values.contactPhone?.trim() || null,
        website: values.website?.trim() || null,
        address: values.address?.trim() || null,
        description: values.description?.trim() || null,
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
            <p>Add and manage recruiting partner companies registered with the placement cell.</p>
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
            placeholder="Search by company name, industry, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '0.55rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              width: '100%',
              maxWidth: '360px',
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
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
              { key: 'companyId', header: 'ID', render: (row) => `#CMP-${row.companyId}` },
              {
                key: 'companyName',
                header: 'Company',
                render: (row) => <strong>{row.companyName}</strong>,
              },
              { key: 'industry', header: 'Industry', render: (row) => row.industry || '—' },
              { key: 'contactEmail', header: 'Contact Email', render: (row) => row.contactEmail || '—' },
              {
                key: 'website',
                header: 'Website',
                render: (row) =>
                  row.website ? (
                    <a
                      href={row.website.startsWith('http') ? row.website : `https://${row.website}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#2563eb', textDecoration: 'none' }}
                    >
                      {row.website.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    '—'
                  ),
              },
              {
                key: 'isActive',
                header: 'Status',
                render: (row) => <StatusBadge value={row.isActive ? 'Active' : 'Inactive'} />,
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => (
                  <div className="row-actions">
                    <button type="button" className="action-button" onClick={() => setViewing(row)}>
                      View
                    </button>
                    <button
                      type="button"
                      className="action-button"
                      onClick={() => {
                        setEditing(row)
                        setFormError('')
                      }}
                    >
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
            empty="No companies found. Add your first recruiting company using the button above."
          />
        )}
      </section>

      {/* Add / Edit Modal */}
      {editing !== null && (
        <Modal
          title={editing.companyId ? 'Edit Company' : 'Add Recruiting Company'}
          onClose={() => {
            setEditing(null)
            setFormError('')
          }}
        >
          <form onSubmit={handleSave} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Company Name *
              </label>
              <input
                name="companyName"
                type="text"
                placeholder="e.g. Google India"
                defaultValue={editing.companyName || ''}
                required
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Industry Domain
              </label>
              <input
                name="industry"
                type="text"
                placeholder="e.g. Software & Artificial Intelligence"
                defaultValue={editing.industry || ''}
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Contact Email *
                </label>
                <input
                  name="contactEmail"
                  type="email"
                  placeholder="careers@company.com"
                  defaultValue={editing.contactEmail || ''}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Contact Phone
                </label>
                <input
                  name="contactPhone"
                  type="text"
                  placeholder="+91 80 1234 5678"
                  defaultValue={editing.contactPhone || ''}
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Official Website
              </label>
              <input
                name="website"
                type="url"
                placeholder="https://company.com"
                defaultValue={editing.website || ''}
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Office / Campus Address
              </label>
              <input
                name="address"
                type="text"
                placeholder="City, State, Country"
                defaultValue={editing.address || ''}
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>

            {formError && (
              <div className="login-error-alert" style={{ margin: '4px 0' }}>
                <AlertCircle size={14} /> <span>{formError}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setEditing(null)
                  setFormError('')
                }}
              >
                Cancel
              </button>
              <button type="submit" className="primary-button compact" disabled={saving}>
                {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                <span>{editing.companyId ? 'Save Changes' : 'Add Company'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {viewing && (
        <Modal title={viewing.companyName} onClose={() => setViewing(null)}>
          <dl className="detail-list">
            {[
              ['Company ID', `#CMP-${viewing.companyId}`],
              ['Industry', viewing.industry || '—'],
              ['Contact Email', viewing.contactEmail || '—'],
              ['Contact Phone', viewing.contactPhone || '—'],
              ['Website', viewing.website || '—'],
              ['Address', viewing.address || '—'],
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
              onClick={() => {
                setEditing(viewing)
                setViewing(null)
                setFormError('')
              }}
            >
              Edit
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

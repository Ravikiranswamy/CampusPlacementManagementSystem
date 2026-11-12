import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { Loader2, AlertCircle, Plus, RefreshCw } from 'lucide-react'

const jobTypeOptions = ['Full-time', 'Internship', 'Full-time + PPO']

export default function JobRoles() {
  const [jobRoles, setJobRoles] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [roles, comps] = await Promise.all([api.getJobRoles(), api.getCompanies()])
      setJobRoles(Array.isArray(roles) ? roles : [])
      setCompanies(Array.isArray(comps) ? comps : [])
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const filtered = jobRoles.filter((r) => {
    const q = search.toLowerCase()
    return (
      !q ||
      (r.title || '').toLowerCase().includes(q) ||
      (r.companyName || '').toLowerCase().includes(q) ||
      (r.jobType || '').toLowerCase().includes(q)
    )
  })

  const activeCompanies = companies.filter((c) => c.isActive)

  async function handleSave(e) {
    e.preventDefault()
    setFormError('')
    const form = new FormData(e.target)
    const values = Object.fromEntries(form.entries())

    if (!values.title?.trim()) return setFormError('Role title is required.')
    if (!values.companyId) return setFormError('Please select a company.')
    if (!values.jobType) return setFormError('Please select a job type.')
    const pkg = parseFloat(values.packageLpa)
    if (isNaN(pkg) || pkg <= 0) return setFormError('Package must be a positive number.')
    const openings = parseInt(values.openings)
    if (isNaN(openings) || openings < 1) return setFormError('Openings must be at least 1.')

    setSaving(true)
    try {
      const payload = {
        title: values.title.trim(),
        companyId: parseInt(values.companyId),
        jobType: values.jobType,
        packageLpa: pkg,
        openings: openings,
        description: values.description?.trim() || null,
      }

      if (editing.jobRoleId) {
        await api.updateJobRole(editing.jobRoleId, payload)
      } else {
        await api.createJobRole(payload)
      }
      setEditing(null)
      await loadData()
    } catch (err) {
      setFormError(err.message || 'Failed to save job role.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-head row-head">
          <div>
            <h2>Job Role Management</h2>
            <p>Add and manage job roles linked to recruiting companies.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="secondary-button compact" onClick={loadData} title="Refresh">
              <RefreshCw size={15} />
            </button>
            <button
              type="button"
              className="primary-button compact"
              onClick={() => setEditing({
                jobRoleId: null,
                title: '',
                companyId: activeCompanies[0]?.companyId || '',
                jobType: 'Full-time',
                packageLpa: '',
                openings: '',
                description: '',
              })}
              disabled={activeCompanies.length === 0}
              title={activeCompanies.length === 0 ? 'Add a company first' : 'Add job role'}
            >
              <Plus size={15} /> Add Role
            </button>
          </div>
        </div>

        {activeCompanies.length === 0 && !loading && (
          <div style={{
            background: 'rgba(234,179,8,0.1)',
            border: '1px solid rgba(234,179,8,0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#fbbf24',
            fontSize: '0.9rem',
            marginBottom: '1rem',
          }}>
            ⚠️ No active companies found. Please add a company in the Companies section first.
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search by role, company, or type…"
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
            <p style={{ marginTop: '0.5rem' }}>Loading job roles…</p>
          </div>
        ) : error ? (
          <div className="login-error-alert">
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        ) : (
          <DataTable
            columns={[
              { key: 'jobRoleId', header: 'ID' },
              { key: 'title', header: 'Role Title' },
              { key: 'companyName', header: 'Company' },
              { key: 'jobType', header: 'Type' },
              {
                key: 'packageLpa',
                header: 'Package',
                render: (row) => row.packageLpa ? `${row.packageLpa} LPA` : '—',
              },
              { key: 'openings', header: 'Openings' },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => (
                  <div className="row-actions">
                    <button
                      type="button"
                      className="action-button"
                      onClick={() => { setEditing(row); setFormError('') }}
                    >
                      Edit
                    </button>
                  </div>
                ),
              },
            ]}
            rows={filtered}
            empty="No job roles found. Add your first role using the button above."
          />
        )}
      </section>

      {/* Add/Edit Modal */}
      {editing !== null && (
        <Modal
          title={editing.jobRoleId ? 'Edit Job Role' : 'Add Job Role'}
          onClose={() => { setEditing(null); setFormError('') }}
        >
          <form onSubmit={handleSave} noValidate>
            <div style={{ marginBottom: '0.9rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                Role Title *
              </label>
              <input
                name="title"
                type="text"
                placeholder="e.g. Software Development Engineer I"
                defaultValue={editing.title}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '0.9rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                Company *
              </label>
              <select
                name="companyId"
                defaultValue={editing.companyId || (activeCompanies[0]?.companyId ?? '')}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9' }}
              >
                <option value="">— Select Company —</option>
                {activeCompanies.map((c) => (
                  <option key={c.companyId} value={c.companyId}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '0.9rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                Job Type *
              </label>
              <select
                name="jobType"
                defaultValue={editing.jobType || 'Full-time'}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9' }}
              >
                {jobTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                  Package (LPA) *
                </label>
                <input
                  name="packageLpa"
                  type="number"
                  step="0.5"
                  min="0.5"
                  placeholder="e.g. 12.5"
                  defaultValue={editing.packageLpa || ''}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                  Openings *
                </label>
                <input
                  name="openings"
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
                  defaultValue={editing.openings || ''}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                Description (optional)
              </label>
              <textarea
                name="description"
                placeholder="Role description, responsibilities, requirements…"
                defaultValue={editing.description || ''}
                rows={3}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            {formError && (
              <div className="login-error-alert" style={{ marginBottom: '0.75rem' }}>
                <AlertCircle size={14} /> <span>{formError}</span>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => { setEditing(null); setFormError('') }}>
                Cancel
              </button>
              <button type="submit" className="primary-button compact" disabled={saving}>
                {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                {editing.jobRoleId ? 'Save Changes' : 'Add Role'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Remove Job Role"
          message={`Remove "${pendingDelete.title}" role?`}
          confirmLabel="Remove"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}

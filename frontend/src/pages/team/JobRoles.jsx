import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import DataTable from '../../components/ui/DataTable.jsx'
import Modal from '../../components/ui/Modal.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { Loader2, AlertCircle, Plus, RefreshCw, Briefcase } from 'lucide-react'

const jobTypeMap = {
  FULL_TIME: 'Full-time',
  INTERNSHIP: 'Internship',
  CONTRACT: 'Contract',
}

export default function JobRoles() {
  const [jobRoles, setJobRoles] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
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
      setError(err.message || 'Failed to load job roles.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = jobRoles.filter((r) => {
    const q = search.toLowerCase().trim()
    return (
      !q ||
      (r.roleTitle || '').toLowerCase().includes(q) ||
      (r.companyName || '').toLowerCase().includes(q) ||
      (r.jobType || '').toLowerCase().includes(q) ||
      (r.workLocation || '').toLowerCase().includes(q)
    )
  })

  const activeCompanies = companies.filter((c) => c.isActive)

  async function handleSave(e) {
    e.preventDefault()
    setFormError('')
    const form = new FormData(e.target)
    const values = Object.fromEntries(form.entries())

    const roleTitle = values.roleTitle?.trim()
    if (!roleTitle) return setFormError('Role title is required.')
    if (!values.companyId) return setFormError('Please select a company.')
    if (!values.jobType) return setFormError('Please select a valid job type.')

    const pkg = parseFloat(values.packageLpa)
    if (isNaN(pkg) || pkg <= 0) return setFormError('Package (LPA) must be greater than 0.')

    setSaving(true)
    try {
      const payload = {
        roleTitle: roleTitle,
        companyId: parseInt(values.companyId),
        jobType: values.jobType.toUpperCase(),
        packageLpa: pkg,
        workLocation: values.workLocation?.trim() || 'Pan-India',
        jobDescription: values.jobDescription?.trim() || null,
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
            <p>Add and manage open recruitment job profiles linked to recruiting partner companies.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="secondary-button compact" onClick={loadData} title="Refresh">
              <RefreshCw size={15} />
            </button>
            <button
              type="button"
              className="primary-button compact"
              onClick={() =>
                setEditing({
                  jobRoleId: null,
                  roleTitle: '',
                  companyId: activeCompanies[0]?.companyId || '',
                  jobType: 'FULL_TIME',
                  packageLpa: '',
                  workLocation: 'Bengaluru',
                  jobDescription: '',
                })
              }
              disabled={activeCompanies.length === 0}
              title={activeCompanies.length === 0 ? 'Add a company first' : 'Add job role'}
            >
              <Plus size={15} /> Add Role
            </button>
          </div>
        </div>

        {activeCompanies.length === 0 && !loading && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              color: '#991b1b',
              fontSize: '0.9rem',
              marginBottom: '1rem',
            }}
          >
            ⚠️ No active companies found. Please register a company in the Companies section first.
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search by role title, company, or location…"
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
            <p style={{ marginTop: '0.5rem' }}>Loading job roles…</p>
          </div>
        ) : error ? (
          <div className="login-error-alert">
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        ) : (
          <DataTable
            columns={[
              { key: 'jobRoleId', header: 'ID', render: (row) => `#ROL-${row.jobRoleId}` },
              {
                key: 'roleTitle',
                header: 'Role Title',
                render: (row) => <strong>{row.roleTitle}</strong>,
              },
              { key: 'companyName', header: 'Company' },
              {
                key: 'jobType',
                header: 'Type',
                render: (row) => (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: row.jobType === 'INTERNSHIP' ? '#fef3c7' : '#eff6ff',
                      color: row.jobType === 'INTERNSHIP' ? '#92400e' : '#1d4ed8',
                    }}
                  >
                    {jobTypeMap[row.jobType] || row.jobType}
                  </span>
                ),
              },
              {
                key: 'packageLpa',
                header: 'Package',
                render: (row) =>
                  row.packageLpa ? (
                    <strong style={{ color: '#047857' }}>{row.packageLpa} LPA</strong>
                  ) : (
                    '—'
                  ),
              },
              { key: 'workLocation', header: 'Location', render: (row) => row.workLocation || 'Pan-India' },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => (
                  <div className="row-actions">
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
                  </div>
                ),
              },
            ]}
            rows={filtered}
            empty="No job roles found. Register your first role using the button above."
          />
        )}
      </section>

      {/* Add / Edit Modal */}
      {editing !== null && (
        <Modal
          title={editing.jobRoleId ? 'Edit Job Role' : 'Add Job Role'}
          onClose={() => {
            setEditing(null)
            setFormError('')
          }}
        >
          <form onSubmit={handleSave} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Role Title *
              </label>
              <input
                name="roleTitle"
                type="text"
                placeholder="e.g. Software Development Engineer"
                defaultValue={editing.roleTitle || ''}
                required
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Company *
              </label>
              <select
                name="companyId"
                defaultValue={editing.companyId || (activeCompanies[0]?.companyId ?? '')}
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
              >
                <option value="">— Select Company —</option>
                {activeCompanies.map((c) => (
                  <option key={c.companyId} value={c.companyId}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Job Type *
                </label>
                <select
                  name="jobType"
                  defaultValue={editing.jobType || 'FULL_TIME'}
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                >
                  <option value="FULL_TIME">Full-time (FTE)</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Package (LPA) *
                </label>
                <input
                  name="packageLpa"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 12.5"
                  defaultValue={editing.packageLpa || ''}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Work Location
              </label>
              <input
                name="workLocation"
                type="text"
                placeholder="e.g. Bengaluru / Hyderabad / Remote"
                defaultValue={editing.workLocation || 'Bengaluru'}
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Role Description / Tech Stack Notes
              </label>
              <textarea
                name="jobDescription"
                rows={3}
                placeholder="Key responsibilities, skills required, etc."
                defaultValue={editing.jobDescription || ''}
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
                <span>{editing.jobRoleId ? 'Save Changes' : 'Add Role'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

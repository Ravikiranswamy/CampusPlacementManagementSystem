import { useState } from 'react'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import Modal from '../../components/ui/Modal.jsx'
import RecordForm from '../../components/ui/RecordForm.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { useData } from '../../context/DataContext.jsx'
import { matchesQuery } from '../../data/mockData.js'
import { required, validEmail } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

const emptyCompany = {
  id: '',
  name: '',
  industry: '',
  contact: '',
  email: '',
  status: 'Active',
}

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'On hold', label: 'On hold' },
]

export default function Companies() {
  const query = usePageQuery()
  const { companies, saveCompany, deleteCompany } = useData()
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [formError, setFormError] = useState('')

  const rows = companies.filter((company) => {
    const statusOk = status === 'all' || company.status === status
    return statusOk && matchesQuery(query, [company.name, company.industry, company.contact, company.email, company.status])
  })

  const fields = [
    { name: 'name', label: 'Company name', autoFocus: true, validate: required('Company name') },
    { name: 'industry', label: 'Industry', validate: required('Industry') },
    { name: 'contact', label: 'Contact name', validate: required('Contact name') },
    { name: 'email', label: 'Contact email', type: 'email', validate: validEmail('Contact email') },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions, validate: required('Status') },
  ]

  function closeForm() {
    setEditing(null)
    setFormError('')
  }

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="panel">
        <div className="panel-head row-head">
          <div>
            <h2>Company management</h2>
            <p>Add, edit, or remove recruiters. Changes stay in this browser.</p>
          </div>
          <button type="button" className="primary-button compact" onClick={() => setEditing(emptyCompany)}>
            Add company
          </button>
        </div>
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[{ value: 'all', label: 'All statuses' }, ...statusOptions]}
        />
        <DataTable
          columns={[
            { key: 'id', header: 'Code' },
            { key: 'name', header: 'Company' },
            { key: 'industry', header: 'Industry' },
            { key: 'contact', header: 'Contact' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="row-actions">
                  <button type="button" className="action-button" onClick={() => setViewing(row)}>
                    View
                  </button>
                  <button type="button" className="action-button" onClick={() => setEditing(row)}>
                    Edit
                  </button>
                  <button type="button" className="action-button danger" onClick={() => setPendingDelete(row)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          rows={rows}
          empty="No companies match those filters."
        />
      </section>

      {editing ? (
        <Modal title={editing.id ? 'Edit company' : 'Add company'} onClose={closeForm}>
          <RecordForm
            key={editing.id || 'new-company'}
            fields={fields}
            initial={editing}
            formError={formError}
            submitLabel={editing.id ? 'Save changes' : 'Add company'}
            onCancel={closeForm}
            onSubmit={(values) => {
              const message = saveCompany(values)
              if (message) {
                setFormError(message)
                return
              }
              closeForm()
            }}
          />
        </Modal>
      ) : null}

      {viewing ? (
        <Modal title={viewing.name} onClose={() => setViewing(null)}>
          <dl className="detail-list">
            <div>
              <dt>Code</dt>
              <dd>{viewing.id}</dd>
            </div>
            <div>
              <dt>Industry</dt>
              <dd>{viewing.industry}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{viewing.contact}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{viewing.email}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge value={viewing.status} />
              </dd>
            </div>
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
              }}
            >
              Edit
            </button>
          </div>
        </Modal>
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          title="Delete company"
          message={`Delete ${pendingDelete.name}? This removes it from this browser.`}
          confirmLabel="Delete"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            deleteCompany(pendingDelete.id)
            setPendingDelete(null)
          }}
        />
      ) : null}
    </div>
  )
}

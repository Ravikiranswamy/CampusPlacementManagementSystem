import { useState } from 'react'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import Modal from '../../components/ui/Modal.jsx'
import RecordForm from '../../components/ui/RecordForm.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import { useData } from '../../context/DataContext.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { positiveNumber, required, wholeNumber } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

const typeOptions = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Internship', label: 'Internship' },
]

export default function JobRoles() {
  const query = usePageQuery()
  const { companies, jobRoles, saveRole, deleteRole } = useData()
  const [type, setType] = useState('all')
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const companyOptions = companies.map((company) => ({ value: company.name, label: company.name }))
  const rows = jobRoles.filter((role) => {
    const typeOk = type === 'all' || role.type === type
    return typeOk && matchesQuery(query, [role.title, role.company, role.type])
  })

  const fields = [
    { name: 'title', label: 'Role title', autoFocus: true, validate: required('Role title') },
    {
      name: 'company',
      label: 'Company',
      type: 'select',
      options: companyOptions,
      validate: required('Company'),
    },
    { name: 'type', label: 'Type', type: 'select', options: typeOptions, validate: required('Type') },
    {
      name: 'packageLpa',
      label: 'Package (LPA)',
      type: 'number',
      min: '0.1',
      step: '0.1',
      validate: positiveNumber('Package'),
    },
    {
      name: 'openings',
      label: 'Openings',
      type: 'number',
      min: '1',
      step: '1',
      validate: wholeNumber('Openings', { min: 1 }),
    },
  ]

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="panel">
        <div className="panel-head row-head">
          <div>
            <h2>Job role management</h2>
            <p>Roles linked to the companies saved in this browser.</p>
          </div>
          <button
            type="button"
            className="primary-button compact"
            onClick={() =>
              setEditing({
                id: '',
                title: '',
                company: companyOptions[0]?.value || '',
                type: 'Full-time',
                packageLpa: '',
                openings: '',
              })
            }
            disabled={companyOptions.length === 0}
          >
            Add role
          </button>
        </div>
        <FilterSelect
          label="Type"
          value={type}
          onChange={setType}
          options={[{ value: 'all', label: 'All types' }, ...typeOptions]}
        />
        <DataTable
          columns={[
            { key: 'id', header: 'Code' },
            { key: 'title', header: 'Role' },
            { key: 'company', header: 'Company' },
            { key: 'type', header: 'Type' },
            { key: 'package', header: 'Package', render: (row) => formatPackage(row.packageLpa) },
            { key: 'openings', header: 'Openings' },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="row-actions">
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
          empty="No roles match those filters."
        />
      </section>

      {editing ? (
        <Modal title={editing.id ? 'Edit job role' : 'Add job role'} onClose={() => setEditing(null)}>
          <RecordForm
            key={editing.id || 'new-role'}
            fields={fields}
            initial={editing}
            submitLabel={editing.id ? 'Save changes' : 'Add role'}
            onCancel={() => setEditing(null)}
            onSubmit={(values) => {
              saveRole(values)
              setEditing(null)
            }}
          />
        </Modal>
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          title="Delete job role"
          message={`Delete ${pendingDelete.title} at ${pendingDelete.company}?`}
          confirmLabel="Delete"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            deleteRole(pendingDelete.id)
            setPendingDelete(null)
          }}
        />
      ) : null}
    </div>
  )
}

import { useState } from 'react'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import Modal from '../../components/ui/Modal.jsx'
import RecordForm from '../../components/ui/RecordForm.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { useData } from '../../context/DataContext.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { positiveNumber, required } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

const statusOptions = [
  { value: 'Released', label: 'Released' },
  { value: 'Accepted', label: 'Accepted' },
  { value: 'Declined', label: 'Declined' },
]

export default function Offers() {
  const query = usePageQuery()
  const { companies, offers, saveOffer } = useData()
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState(null)
  const [statusEdit, setStatusEdit] = useState(null)

  const companyOptions = companies.map((company) => ({ value: company.name, label: company.name }))
  const rows = offers.filter((offer) => {
    const statusOk = status === 'all' || offer.status === status
    return statusOk && matchesQuery(query, [offer.student, offer.company, offer.role, offer.status, offer.id])
  })

  const fields = [
    { name: 'student', label: 'Student name', autoFocus: true, validate: required('Student name') },
    {
      name: 'company',
      label: 'Company',
      type: 'select',
      options: companyOptions,
      validate: required('Company'),
    },
    { name: 'role', label: 'Role', validate: required('Role') },
    {
      name: 'packageLpa',
      label: 'Package (LPA)',
      type: 'number',
      min: '0.1',
      step: '0.1',
      validate: positiveNumber('Package'),
    },
    { name: 'status', label: 'Offer status', type: 'select', options: statusOptions, validate: required('Offer status') },
  ]

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="panel">
        <div className="panel-head row-head">
          <div>
            <h2>Offer management</h2>
            <p>Add or edit offer letters and update their status. Saved in this browser.</p>
          </div>
          <button
            type="button"
            className="primary-button compact"
            disabled={companyOptions.length === 0}
            onClick={() =>
              setEditing({
                id: '',
                student: '',
                company: companyOptions[0]?.value || '',
                role: '',
                packageLpa: '',
                status: 'Released',
              })
            }
          >
            Add offer
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
            { key: 'id', header: 'Offer' },
            { key: 'student', header: 'Student' },
            { key: 'company', header: 'Company' },
            { key: 'role', header: 'Role' },
            { key: 'package', header: 'Package', render: (row) => formatPackage(row.packageLpa) },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="row-actions">
                  <button type="button" className="action-button" onClick={() => setStatusEdit(row)}>
                    Status
                  </button>
                  <button type="button" className="action-button" onClick={() => setEditing({ ...row, packageLpa: String(row.packageLpa) })}>
                    Edit
                  </button>
                </div>
              ),
            },
          ]}
          rows={rows}
          empty="No offers match those filters."
        />
      </section>

      {editing ? (
        <Modal title={editing.id ? 'Edit offer' : 'Add offer'} onClose={() => setEditing(null)}>
          <RecordForm
            key={editing.id || 'new-offer'}
            fields={fields}
            initial={editing}
            submitLabel={editing.id ? 'Save changes' : 'Add offer'}
            onCancel={() => setEditing(null)}
            onSubmit={(values) => {
              saveOffer(values)
              setEditing(null)
            }}
          />
        </Modal>
      ) : null}

      {statusEdit ? (
        <Modal title={`Offer status for ${statusEdit.student}`} onClose={() => setStatusEdit(null)}>
          <RecordForm
            key={`${statusEdit.id}-status`}
            fields={[{ name: 'status', label: 'Offer status', type: 'select', options: statusOptions }]}
            initial={{ status: statusEdit.status }}
            submitLabel="Update status"
            onCancel={() => setStatusEdit(null)}
            onSubmit={(values) => {
              saveOffer({ ...statusEdit, status: values.status })
              setStatusEdit(null)
            }}
          />
        </Modal>
      ) : null}
    </div>
  )
}

import { useState } from 'react'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import Modal from '../../components/ui/Modal.jsx'
import RecordForm from '../../components/ui/RecordForm.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { useData } from '../../context/DataContext.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import {
  cgpaValue,
  driveDeadline,
  formatDeadline,
  todayIso,
  positiveNumber,
  required,
  wholeNumber,
} from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

const statusOptions = [
  { value: 'Open', label: 'Open' },
  { value: 'Closed', label: 'Closed' },
]

const emptyDrive = {
  id: '',
  company: '',
  role: '',
  packageLpa: '',
  location: '',
  deadline: '',
  minCgpa: '',
  maxBacklogs: '0',
  branches: '',
  status: 'Open',
  applicants: '0',
}

export default function TeamDrives() {
  const query = usePageQuery()
  const { companies, drives, saveDrive, deleteDrive } = useData()
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState(null)
  const [statusEdit, setStatusEdit] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const companyOptions = companies.map((company) => ({ value: company.name, label: company.name }))
  const rows = drives.filter((drive) => {
    const statusOk = status === 'all' || drive.status === status
    return statusOk && matchesQuery(query, [drive.id, drive.company, drive.role, drive.location, drive.status])
  })

  const fields = [
    {
      name: 'company',
      label: 'Company',
      type: 'select',
      options: companyOptions,
      validate: required('Company'),
    },
    { name: 'role', label: 'Role', autoFocus: true, validate: required('Role') },
    {
      name: 'packageLpa',
      label: 'Package (LPA)',
      type: 'number',
      min: '0.1',
      step: '0.1',
      validate: positiveNumber('Package'),
    },
    { name: 'location', label: 'Location', validate: required('Location') },
    { name: 'deadline', label: 'Deadline', type: 'date', validate: driveDeadline() },
    { name: 'minCgpa', label: 'Minimum CGPA', type: 'number', min: '0', max: '10', step: '0.1', validate: cgpaValue() },
    {
      name: 'maxBacklogs',
      label: 'Maximum backlogs',
      type: 'number',
      min: '0',
      step: '1',
      validate: wholeNumber('Maximum backlogs'),
    },
    {
      name: 'branches',
      label: 'Branches',
      validate: (value) =>
        String(value || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean).length
          ? ''
          : 'Enter at least one branch.',
    },
    {
      name: 'applicants',
      label: 'Applicants',
      type: 'number',
      min: '0',
      step: '1',
      validate: wholeNumber('Applicants'),
    },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions, validate: required('Status') },
  ]

  function toForm(drive) {
    return {
      ...drive,
      branches: drive.branches.join(', '),
      packageLpa: String(drive.packageLpa),
      minCgpa: String(drive.minCgpa),
      maxBacklogs: String(drive.maxBacklogs),
      applicants: String(drive.applicants),
    }
  }

  function saveFromForm(values) {
    saveDrive({
      ...values,
      branches: values.branches
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    })
  }

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="panel">
        <div className="panel-head row-head">
          <div>
            <h2>Placement drive management</h2>
            <p>Create drives, update their details, or change status. Saved in this browser.</p>
          </div>
          <button
            type="button"
            className="primary-button compact"
            disabled={companyOptions.length === 0}
            onClick={() => setEditing({ ...emptyDrive, company: companyOptions[0]?.value || '' })}
          >
            Create drive
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
            { key: 'id', header: 'Drive' },
            { key: 'company', header: 'Company' },
            { key: 'role', header: 'Role' },
            { key: 'location', header: 'Location' },
            { key: 'deadline', header: 'Deadline', render: (row) => formatDeadline(row.deadline) },
            { key: 'package', header: 'Package', render: (row) => formatPackage(row.packageLpa) },
            { key: 'applicants', header: 'Applicants' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="row-actions">
                  <button type="button" className="action-button" onClick={() => setStatusEdit(row)}>
                    Status
                  </button>
                  <button type="button" className="action-button" onClick={() => setEditing(toForm(row))}>
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
          empty="No drives match those filters."
        />
      </section>

      {editing ? (
        <Modal title={editing.id ? 'Edit placement drive' : 'Create placement drive'} onClose={() => setEditing(null)}>
          <RecordForm
            key={editing.id || 'new-drive'}
            fields={fields}
            initial={editing}
            submitLabel={editing.id ? 'Save changes' : 'Create drive'}
            onCancel={() => setEditing(null)}
            onSubmit={(values) => {
              saveFromForm(values)
              setEditing(null)
            }}
          />
        </Modal>
      ) : null}

      {statusEdit ? (
        <Modal title={`Status for ${statusEdit.id}`} onClose={() => setStatusEdit(null)}>
          <RecordForm
            key={`${statusEdit.id}-status`}
            fields={[
              {
                name: 'status',
                label: 'Drive status',
                type: 'select',
                options: statusOptions,
                validate: (value) =>
                  value === 'Open' && statusEdit.deadline < todayIso()
                    ? 'An open drive needs a deadline of today or later. Edit the deadline first.'
                    : '',
              },
            ]}
            initial={{ status: statusEdit.status }}
            submitLabel="Update status"
            onCancel={() => setStatusEdit(null)}
            onSubmit={(values) => {
              saveDrive({ ...statusEdit, status: values.status })
              setStatusEdit(null)
            }}
          />
        </Modal>
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          title="Delete placement drive"
          message={`Delete ${pendingDelete.id} for ${pendingDelete.company}?`}
          confirmLabel="Delete"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            deleteDrive(pendingDelete.id)
            setPendingDelete(null)
          }}
        />
      ) : null}
    </div>
  )
}

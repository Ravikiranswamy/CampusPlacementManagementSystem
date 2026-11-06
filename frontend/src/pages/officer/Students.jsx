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
import { cgpaValue, required, validEmail } from '../../data/records.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

const departmentOptions = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Information Technology', label: 'Information Technology' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Mechanical', label: 'Mechanical' },
]

const placementOptions = [
  { value: 'Registered', label: 'Registered' },
  { value: 'In process', label: 'In process' },
  { value: 'Selected', label: 'Selected' },
  { value: 'Offered', label: 'Offered' },
]

const emptyStudent = {
  id: '',
  name: '',
  email: '',
  department: 'Computer Science',
  cgpa: '',
  status: 'Registered',
  blocked: false,
}

export default function Students() {
  const query = usePageQuery()
  const { students, saveStudent, deleteStudent, setStudentBlocked } = useData()
  const [department, setDepartment] = useState('all')
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [formError, setFormError] = useState('')

  const departments = [
    ...new Set([...departmentOptions.map((item) => item.value), ...students.map((student) => student.department)]),
  ]
  const rows = students.filter((student) => {
    const departmentOk = department === 'all' || student.department === department
    const access = student.blocked ? 'Blocked' : 'Active'
    return departmentOk && matchesQuery(query, [student.name, student.email, student.department, student.status, student.id, access])
  })

  const fields = [
    { name: 'name', label: 'Student name', autoFocus: true, validate: required('Student name') },
    { name: 'email', label: 'Email', type: 'email', validate: validEmail('Email') },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      options: departmentOptions,
      validate: required('Department'),
    },
    { name: 'cgpa', label: 'CGPA', type: 'number', min: '0', max: '10', step: '0.1', validate: cgpaValue() },
    { name: 'status', label: 'Placement status', type: 'select', options: placementOptions, validate: required('Placement status') },
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
            <h2>Student management</h2>
            <p>Add or edit students, or block and unblock a demo account. Saved in this browser.</p>
          </div>
          <button type="button" className="primary-button compact" onClick={() => setEditing(emptyStudent)}>
            Add student
          </button>
        </div>
        <FilterSelect
          label="Department"
          value={department}
          onChange={setDepartment}
          options={[{ value: 'all', label: 'All departments' }, ...departments.map((item) => ({ value: item, label: item }))]}
        />
        <DataTable
          columns={[
            { key: 'id', header: 'Roll' },
            { key: 'name', header: 'Student' },
            { key: 'department', header: 'Department' },
            { key: 'cgpa', header: 'CGPA' },
            { key: 'status', header: 'Placement', render: (row) => <StatusBadge value={row.status} /> },
            {
              key: 'access',
              header: 'Access',
              render: (row) => <StatusBadge value={row.blocked ? 'Blocked' : 'Active'} />,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="row-actions">
                  <button type="button" className="action-button" onClick={() => setEditing({ ...row, cgpa: String(row.cgpa) })}>
                    Edit
                  </button>
                  <button type="button" className="action-button" onClick={() => setStudentBlocked(row.id, !row.blocked)}>
                    {row.blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button type="button" className="action-button danger" onClick={() => setPendingDelete(row)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          rows={rows}
          empty="No students match those filters."
        />
      </section>

      {editing ? (
        <Modal title={editing.id ? 'Edit student' : 'Add student'} onClose={closeForm}>
          <RecordForm
            key={editing.id || 'new-student'}
            fields={fields}
            initial={editing}
            formError={formError}
            submitLabel={editing.id ? 'Save changes' : 'Add student'}
            onCancel={closeForm}
            onSubmit={(values) => {
              const message = saveStudent({ ...editing, ...values })
              if (message) {
                setFormError(message)
                return
              }
              closeForm()
            }}
          />
        </Modal>
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          title="Delete student"
          message={`Delete ${pendingDelete.name}? This removes the student from this browser.`}
          confirmLabel="Delete"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            deleteStudent(pendingDelete.id)
            setPendingDelete(null)
          }}
        />
      ) : null}
    </div>
  )
}

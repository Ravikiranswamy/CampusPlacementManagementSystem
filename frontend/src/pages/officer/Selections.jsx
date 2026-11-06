import { useState } from 'react'
import DataTable from '../../components/ui/DataTable.jsx'
import FilterSelect from '../../components/ui/FilterSelect.jsx'
import Modal from '../../components/ui/Modal.jsx'
import RecordForm from '../../components/ui/RecordForm.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { useData } from '../../context/DataContext.jsx'
import { matchesQuery } from '../../data/mockData.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

const resultOptions = [
  { value: 'Shortlisted', label: 'Shortlisted' },
  { value: 'Selected', label: 'Selected' },
  { value: 'Cleared', label: 'Cleared' },
  { value: 'Waiting', label: 'Waiting' },
  { value: 'Rejected', label: 'Rejected' },
]

export default function Selections() {
  const query = usePageQuery()
  const { selections, saveSelection } = useData()
  const [result, setResult] = useState('all')
  const [editing, setEditing] = useState(null)
  const rows = selections.filter((item) => {
    const resultOk = result === 'all' || item.result === result
    return resultOk && matchesQuery(query, [item.student, item.company, item.round, item.result])
  })

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="panel">
        <div className="panel-head">
          <h2>Selection monitoring</h2>
          <p>Update the latest round result. The change stays in this browser.</p>
        </div>
        <FilterSelect
          label="Result"
          value={result}
          onChange={setResult}
          options={[{ value: 'all', label: 'All results' }, ...resultOptions]}
        />
        <DataTable
          columns={[
            { key: 'id', header: 'Record' },
            { key: 'student', header: 'Student' },
            { key: 'company', header: 'Company' },
            { key: 'round', header: 'Round' },
            { key: 'result', header: 'Result', render: (row) => <StatusBadge value={row.result} /> },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <button type="button" className="action-button" onClick={() => setEditing(row)}>
                  Update status
                </button>
              ),
            },
          ]}
          rows={rows}
          empty="No selection rows match those filters."
        />
      </section>

      {editing ? (
        <Modal title={`Update ${editing.student}`} onClose={() => setEditing(null)}>
          <p className="modal-note">
            {editing.company} · {editing.round}
          </p>
          <RecordForm
            key={editing.id}
            fields={[{ name: 'result', label: 'Selection status', type: 'select', options: resultOptions }]}
            initial={{ result: editing.result }}
            submitLabel="Update status"
            onCancel={() => setEditing(null)}
            onSubmit={(values) => {
              saveSelection({ ...editing, result: values.result })
              setEditing(null)
            }}
          />
        </Modal>
      ) : null}
    </div>
  )
}

import { useAuth } from '../../context/AuthContext.jsx'
import SampleNote from '../../components/ui/SampleNote.jsx'
import { matchesQuery, sampleStudent } from '../../data/mockData.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'

const fields = [
  ['Name', sampleStudent.name],
  ['Roll number', sampleStudent.rollNo],
  ['Department', sampleStudent.department],
  ['Batch', sampleStudent.batch],
  ['CGPA', sampleStudent.cgpa],
  ['Active backlogs', sampleStudent.backlogs],
  ['Class 10', `${sampleStudent.tenth}%`],
  ['Class 12', `${sampleStudent.twelfth}%`],
  ['Phone', sampleStudent.phone],
  ['Skills', sampleStudent.skills.join(', ')],
]

export default function StudentProfile() {
  const { session } = useAuth()
  const query = usePageQuery()
  const visible = fields.filter(([, value]) => matchesQuery(query, [value, session?.email]))

  return (
    <div className="page-stack">
      <SampleNote />
      <section className="panel">
        <div className="panel-head">
          <h2>Academic profile</h2>
          <p>Signed in as {session?.email}. The academic record below is the sample student profile.</p>
        </div>
        {visible.length === 0 ? (
          <p className="table-empty">No profile fields match that search.</p>
        ) : (
          <dl className="profile-grid">
            {visible.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </div>
  )
}

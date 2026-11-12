import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../api/client.js'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { BookOpen, GraduationCap, Award, Plus, Trash2, ExternalLink } from 'lucide-react'

export default function StudentProfile() {
  const { session } = useAuth()
  const studentId = session?.studentId || 1

  const [student, setStudent] = useState(null)
  const [skills, setSkills] = useState([])
  const [catalogSkills, setCatalogSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Add Skill Modal
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false)
  const [selectedSkillId, setSelectedSkillId] = useState('')
  const [proficiency, setProficiency] = useState('INTERMEDIATE')
  const [certUrl, setCertUrl] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  async function loadData() {
    try {
      setLoading(true)
      const [studentData, studentSkills, allSkills] = await Promise.all([
        api.getStudentById(studentId),
        api.getStudentSkills(studentId),
        api.getSkills(),
      ])
      setStudent(studentData)
      setSkills(Array.isArray(studentSkills) ? studentSkills : [])
      setCatalogSkills(Array.isArray(allSkills) ? allSkills : [])
      if (allSkills?.length > 0) setSelectedSkillId(allSkills[0].skillId)
      setError(null)
    } catch (err) {
      console.error('Failed to load student profile:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId])

  async function handleAddSkill(e) {
    e.preventDefault()
    if (!selectedSkillId) return
    try {
      setActionLoading(true)
      await api.addStudentSkill(studentId, {
        skillId: Number(selectedSkillId),
        proficiencyLevel: proficiency,
        certificationUrl: certUrl || null,
      })
      setIsAddSkillOpen(false)
      setCertUrl('')
      await loadData()
    } catch (err) {
      alert(`Error adding skill: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleRemoveSkill(skillId) {
    if (!confirm('Are you sure you want to remove this skill from your profile?')) return
    try {
      await api.removeStudentSkill(studentId, skillId)
      await loadData()
    } catch (err) {
      alert(`Error removing skill: ${err.message}`)
    }
  }

  if (loading) {
    return <div className="panel"><p>Loading student profile from database...</p></div>
  }

  return (
    <div className="page-stack">
      {error && (
        <div className="banner banner-error" style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Academic Bio Card */}
      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Academic Profile</h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Verified University Record • USN: <strong>{student?.usn || '4XX23CS001'}</strong>
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              CGPA {student?.cgpa || '0.00'}
            </span>
            <div style={{ marginTop: '0.25rem' }}>
              <StatusBadge value={student?.activeBacklogs === 0 ? 'Eligible' : `${student?.activeBacklogs} Backlogs`} />
            </div>
          </div>
        </div>

        <dl className="profile-grid">
          <div>
            <dt>Full Name</dt>
            <dd>{student?.fullName || session?.name}</dd>
          </div>
          <div>
            <dt>University Seat Number (USN)</dt>
            <dd>{student?.usn}</dd>
          </div>
          <div>
            <dt>Department</dt>
            <dd>{student?.departmentName} ({student?.departmentCode})</dd>
          </div>
          <div>
            <dt>Section & Batch</dt>
            <dd>Section {student?.section || 'A'} • Graduating {student?.graduationYear}</dd>
          </div>
          <div>
            <dt>Cumulative GPA</dt>
            <dd>{student?.cgpa} / 10.00</dd>
          </div>
          <div>
            <dt>Active Backlogs</dt>
            <dd>{student?.activeBacklogs}</dd>
          </div>
          <div>
            <dt>Institutional Email</dt>
            <dd>{student?.email || session?.email}</dd>
          </div>
          <div>
            <dt>Contact Phone</dt>
            <dd>{student?.phone || 'Not provided'}</dd>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <dt>Resume Link</dt>
            <dd>
              {student?.resumeUrl ? (
                <a href={student.resumeUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-primary)' }}>
                  View Verified Resume <ExternalLink size={14} />
                </a>
              ) : (
                'No resume uploaded'
              )}
            </dd>
          </div>
        </dl>
      </section>

      {/* Verified Skills Catalog Card */}
      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Technical Skills & Certifications</h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Skills registered for automated drive eligibility matching (5-attribute relational mapping).
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem' }}
            onClick={() => setIsAddSkillOpen(true)}
          >
            <Plus size={16} /> Add Skill
          </button>
        </div>

        {skills.length === 0 ? (
          <p className="table-empty">No skills attached to this profile yet. Click "Add Skill" above.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {skills.map((item) => (
              <div
                key={item.skillId}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#fafafa',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{item.skillName}</h3>
                    <StatusBadge value={item.proficiencyLevel} />
                  </div>
                  <p style={{ margin: '0.25rem 0 0.5rem', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                    Category: {item.category || 'Technical'}
                  </p>
                  {item.certificationUrl && (
                    <a
                      href={item.certificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      Certificate <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(item.skillId)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Skill Modal */}
      {isAddSkillOpen && (
        <Modal title="Add Technical Skill" onClose={() => setIsAddSkillOpen(false)}>
          <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                Select Skill
              </label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                {catalogSkills.map((s) => (
                  <option key={s.skillId} value={s.skillId}>
                    {s.skillName} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                Proficiency Level
              </label>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                Certification URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={certUrl}
                onChange={(e) => setCertUrl(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn" onClick={() => setIsAddSkillOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                {actionLoading ? 'Saving...' : 'Add to Profile'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { ListChecks, Plus, CheckCircle, XCircle, UserCheck } from 'lucide-react'

export default function TeamEligibility() {
  const [drives, setDrives] = useState([])
  const [selectedDriveId, setSelectedDriveId] = useState('')
  const [rounds, setRounds] = useState([])
  const [applications, setApplications] = useState([])
  const [selectedRoundId, setSelectedRoundId] = useState('')
  const [roundResults, setRoundResults] = useState([])
  const [loading, setLoading] = useState(true)

  // Add Round Modal
  const [isAddRoundOpen, setIsAddRoundOpen] = useState(false)
  const [newRoundNumber, setNewRoundNumber] = useState(1)
  const [newRoundName, setNewRoundName] = useState('')
  const [newRoundDesc, setNewRoundDesc] = useState('')

  // Grade Candidate Modal
  const [gradingApp, setGradingApp] = useState(null)
  const [gradeStatus, setGradeStatus] = useState('QUALIFIED')
  const [gradeScore, setGradeScore] = useState('85.0')
  const [gradeRemarks, setGradeRemarks] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  async function loadInitial() {
    try {
      setLoading(true)
      const drivesData = await api.getDrives()
      const list = Array.isArray(drivesData) ? drivesData : []
      setDrives(list)
      if (list.length > 0) {
        setSelectedDriveId(list[0].driveId)
      }
    } catch (err) {
      console.error('Error fetching drives:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitial()
  }, [])

  async function loadDriveRoundsAndApps(driveId) {
    if (!driveId) return
    try {
      const [roundsData, appsData] = await Promise.all([
        api.getRoundsByDrive(driveId),
        api.getDriveApplications(driveId),
      ])
      const rList = Array.isArray(roundsData) ? roundsData : []
      setRounds(rList)
      setApplications(Array.isArray(appsData) ? appsData : [])
      if (rList.length > 0) {
        setSelectedRoundId(rList[0].roundId)
      } else {
        setSelectedRoundId('')
        setRoundResults([])
      }
      setNewRoundNumber(rList.length + 1)
    } catch (err) {
      console.error('Error fetching drive rounds:', err)
    }
  }

  useEffect(() => {
    if (selectedDriveId) {
      loadDriveRoundsAndApps(selectedDriveId)
    }
  }, [selectedDriveId])

  async function loadRoundResults(roundId) {
    if (!roundId) {
      setRoundResults([])
      return
    }
    try {
      const results = await api.getRoundResults(roundId)
      setRoundResults(Array.isArray(results) ? results : [])
    } catch (err) {
      console.error('Error fetching round results:', err)
    }
  }

  useEffect(() => {
    if (selectedRoundId) {
      loadRoundResults(selectedRoundId)
    }
  }, [selectedRoundId])

  async function handleCreateRound(e) {
    e.preventDefault()
    try {
      setActionLoading(true)
      await api.createRound({
        driveId: Number(selectedDriveId),
        roundNumber: Number(newRoundNumber),
        roundName: newRoundName,
        roundDescription: newRoundDesc,
        roundStatus: 'PENDING',
      })
      setIsAddRoundOpen(false)
      setNewRoundName('')
      setNewRoundDesc('')
      await loadDriveRoundsAndApps(selectedDriveId)
    } catch (err) {
      alert(`Error creating round: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleGradeCandidate(e) {
    e.preventDefault()
    if (!gradingApp || !selectedRoundId) return
    try {
      setActionLoading(true)
      await api.recordRoundResult({
        applicationId: gradingApp.applicationId,
        roundId: Number(selectedRoundId),
        resultStatus: gradeStatus,
        score: gradeScore ? Number(gradeScore) : null,
        remarks: gradeRemarks,
      })
      setGradingApp(null)
      await loadRoundResults(selectedRoundId)
      await loadDriveRoundsAndApps(selectedDriveId)
    } catch (err) {
      alert(`Failed to save grade: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  const resultsMap = new Map(roundResults.map((r) => [r.applicationId, r]))

  return (
    <div className="page-stack">
      {/* Drive Selector Header */}
      <section className="panel">
        <div className="panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Recruitment Rounds & Candidate Evaluation</h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Configure interview stages (Online Tests, Technical, HR) and record candidate scores.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Drive:</label>
            <select
              value={selectedDriveId}
              onChange={(e) => setSelectedDriveId(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
            >
              {drives.map((d) => (
                <option key={d.driveId} value={d.driveId}>
                  {d.companyName} — {d.roleTitle}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rounds Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {rounds.length === 0 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>No rounds created yet for this drive.</span>
            ) : (
              rounds.map((r) => (
                <button
                  key={r.roundId}
                  type="button"
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    border: selectedRoundId === r.roundId ? '2px solid var(--color-primary)' : '1px solid #d1d5db',
                    background: selectedRoundId === r.roundId ? '#f0f9ff' : '#ffffff',
                    fontWeight: selectedRoundId === r.roundId ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                  onClick={() => setSelectedRoundId(r.roundId)}
                >
                  Round {r.roundNumber}: {r.roundName}
                </button>
              ))
            )}
          </div>
          <button
            type="button"
            className="primary-button compact"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
            onClick={() => setIsAddRoundOpen(true)}
          >
            <Plus size={15} /> Add Round
          </button>
        </div>

        {/* Candidate Evaluation Table */}
        <div style={{ marginTop: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem' }}>
            Registered Candidates ({applications.length})
          </h3>
          {applications.length === 0 ? (
            <p className="table-empty">No student applications received for this drive yet.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Student Name</th>
                    <th>Department</th>
                    <th>CGPA</th>
                    <th>Overall Status</th>
                    <th>Current Round Status</th>
                    <th>Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => {
                    const res = resultsMap.get(app.applicationId)
                    return (
                      <tr key={app.applicationId}>
                        <td>#APP-{app.applicationId}</td>
                        <td><strong>{app.studentName}</strong></td>
                        <td>{app.departmentCode}</td>
                        <td>{app.cgpa}</td>
                        <td><StatusBadge value={app.status} /></td>
                        <td>
                          {res ? (
                            <StatusBadge value={res.resultStatus} />
                          ) : (
                            <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Ungraded</span>
                          )}
                        </td>
                        <td>{res?.score != null ? res.score : '—'}</td>
                        <td>
                          <button
                            type="button"
                            className="action-button"
                            style={{ padding: '0.25rem 0.65rem', fontSize: '0.8rem' }}
                            disabled={!selectedRoundId}
                            onClick={() => {
                              setGradingApp(app)
                              setGradeStatus(res?.resultStatus || 'QUALIFIED')
                              setGradeScore(res?.score != null ? String(res.score) : '85.0')
                              setGradeRemarks(res?.remarks || '')
                            }}
                          >
                            Evaluate
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Add Round Modal */}
      {isAddRoundOpen && (
        <Modal title="Add Selection Round" onClose={() => setIsAddRoundOpen(false)}>
          <form onSubmit={handleCreateRound} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>Round Number</label>
              <input
                type="number"
                min="1"
                value={newRoundNumber}
                onChange={(e) => setNewRoundNumber(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>Round Name</label>
              <input
                type="text"
                placeholder="e.g. Technical Interview - Coding & Architecture"
                value={newRoundName}
                onChange={(e) => setNewRoundName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
              <textarea
                rows="3"
                placeholder="Details of what will be evaluated in this stage..."
                value={newRoundDesc}
                onChange={(e) => setNewRoundDesc(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="secondary-button" onClick={() => setIsAddRoundOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="primary-button" disabled={actionLoading}>
                {actionLoading ? 'Creating...' : 'Create Round'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Grade Candidate Modal */}
      {gradingApp && (
        <Modal
          title={`Evaluate Candidate: ${gradingApp.studentName}`}
          onClose={() => setGradingApp(null)}
        >
          <form onSubmit={handleGradeCandidate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              Application #APP-{gradingApp.applicationId} • {gradingApp.departmentCode} • CGPA {gradingApp.cgpa}
            </p>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>Evaluation Status</label>
              <select
                value={gradeStatus}
                onChange={(e) => setGradeStatus(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="ABSENT">ABSENT</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>Score (out of 100)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={gradeScore}
                onChange={(e) => setGradeScore(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>Interviewer Remarks</label>
              <textarea
                rows="3"
                placeholder="Feedback on candidate performance..."
                value={gradeRemarks}
                onChange={(e) => setGradeRemarks(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="secondary-button" onClick={() => setGradingApp(null)}>
                Cancel
              </button>
              <button type="submit" className="primary-button" disabled={actionLoading}>
                {actionLoading ? 'Saving...' : 'Submit Evaluation'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

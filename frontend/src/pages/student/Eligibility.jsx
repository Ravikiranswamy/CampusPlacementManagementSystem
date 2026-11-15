import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../api/client.js'
import DataTable from '../../components/ui/DataTable.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'
import { CheckCircle2, XCircle, AlertTriangle, Briefcase } from 'lucide-react'

export default function Eligibility() {
  const query = usePageQuery()
  const { session } = useAuth()
  const studentId = session?.studentId

  const [student, setStudent] = useState(null)
  const [drivesWithEligibility, setDrivesWithEligibility] = useState([])
  const [myApplications, setMyApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadData() {
    if (!studentId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const [studentData, drivesData, appsData] = await Promise.all([
        api.getStudentById(studentId),
        api.getPublishedDrives(),
        api.getStudentApplications(studentId),
      ])

      setStudent(studentData)
      setMyApplications(Array.isArray(appsData) ? appsData : [])

      if (Array.isArray(drivesData)) {
        // Run eligibility check concurrently for all published drives
        const results = await Promise.all(
          drivesData.map(async (drive) => {
            try {
              const res = await api.checkEligibility(studentId, drive.driveId)
              return {
                ...drive,
                isEligible: res.eligible,
                reasons: res.reasons || [],
              }
            } catch (err) {
              return {
                ...drive,
                isEligible: false,
                reasons: [err.message],
              }
            }
          }),
        )
        setDrivesWithEligibility(results)
      }
      setError(null)
    } catch (err) {
      console.error('Error checking eligibility:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId])

  async function handleApply(drive) {
    try {
      await api.applyForDrive({
        studentId,
        driveId: drive.driveId,
        remarks: 'Applied through live eligibility portal',
      })
      alert(`Applied successfully to ${drive.companyName}!`)
      await loadData()
    } catch (err) {
      alert(`Failed to apply: ${err.message}`)
    }
  }

  const appliedDriveIds = new Set(myApplications.map((a) => a.driveId))

  const rows = drivesWithEligibility.filter((drive) =>
    matchesQuery(query, [
      drive.companyName,
      drive.roleTitle,
      drive.isEligible ? 'Eligible' : 'Not eligible',
      ...(drive.reasons || []),
    ]),
  )

  return (
    <div className="page-stack">
      {error && (
        <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Student Academic Standing Banner */}
      <section className="panel" style={{ background: '#f8fafc', borderLeft: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
              Academic Standing for {student?.fullName || session?.name}
            </h3>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              Department: <strong>{student?.departmentCode || 'Not Assigned'}</strong> • CGPA: <strong>{student?.cgpa != null && Number(student.cgpa) > 0 ? Number(student.cgpa).toFixed(2) : 'Not Updated'}</strong> • Active Backlogs: <strong>{student?.activeBacklogs !== null && student?.activeBacklogs !== undefined ? student.activeBacklogs : '—'}</strong> • Graduating: <strong>{student?.graduationYear || '—'}</strong>
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#047857', background: '#ecfdf5', padding: '0.35rem 0.75rem', borderRadius: '20px', fontWeight: 600 }}>
            Automated DB Rule Engine
          </span>
        </div>
      </section>

      {/* Live Eligibility Table */}
      <section className="panel">
        <div className="panel-head">
          <h2>Drive Eligibility Matrix</h2>
          <p style={{ color: 'var(--color-muted)' }}>
            Real-time evaluation against database drive criteria (Minimum CGPA, Backlogs, Eligible Departments, and Disciplinary blocks).
          </p>
        </div>

        {loading ? (
          <p className="table-empty">Evaluating real-time eligibility with database engine...</p>
        ) : (
          <DataTable
            columns={[
              {
                key: 'company',
                header: 'Company & Role',
                render: (row) => (
                  <div>
                    <strong>{row.companyName}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{row.roleTitle}</div>
                  </div>
                ),
              },
              {
                key: 'package',
                header: 'CTC Package',
                render: (row) => (
                  <span style={{ fontWeight: 600, color: '#047857' }}>{formatPackage(row.packageLpa)}</span>
                ),
              },
              {
                key: 'criteria',
                header: 'Drive Criteria',
                render: (row) => (
                  <div style={{ fontSize: '0.82rem', color: '#4b5563' }}>
                    <div>Min CGPA: {row.eligibility?.minCgpa ?? 'N/A'}</div>
                    <div>Max Backlogs: {row.eligibility?.maxActiveBacklogs ?? 0}</div>
                    <div>Depts: {row.eligibility?.eligibleDepartments?.map((d) => d.departmentCode).join(', ') || 'All'}</div>
                  </div>
                ),
              },
              {
                key: 'verdict',
                header: 'Eligibility Verdict',
                render: (row) => (
                  <div>
                    {row.isEligible ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#059669', fontWeight: 600, fontSize: '0.85rem' }}>
                        <CheckCircle2 size={16} /> Eligible
                      </span>
                    ) : (
                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#dc2626', fontWeight: 600, fontSize: '0.85rem' }}>
                          <XCircle size={16} /> Ineligible
                        </span>
                        {row.reasons && row.reasons.length > 0 && (
                          <div style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '0.2rem' }}>
                            {row.reasons.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'action',
                header: 'Action',
                render: (row) => {
                  const isApplied = appliedDriveIds.has(row.driveId)
                  if (isApplied) {
                    return <span style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 500 }}>Applied</span>
                  }
                  if (!row.isEligible) {
                    return <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Not allowed</span>
                  }
                  return (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => handleApply(row)}
                    >
                      Apply
                    </button>
                  )
                },
              },
            ]}
            rows={rows}
            empty="No drives currently scheduled."
          />
        )}
      </section>
    </div>
  )
}

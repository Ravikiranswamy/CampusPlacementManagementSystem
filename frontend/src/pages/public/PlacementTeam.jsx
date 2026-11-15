import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import {
  Users,
  ShieldCheck,
  Mail,
  GraduationCap,
  Award,
  BookOpen,
  Phone,
  Building,
  Loader2,
} from 'lucide-react'

export default function PlacementTeam() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTeam() {
      try {
        setLoading(true)
        const depts = await api.getDepartments()
        setDepartments(Array.isArray(depts) ? depts : [])
      } catch (err) {
        console.error('Failed to load departments:', err)
        setDepartments([])
      } finally {
        setLoading(false)
      }
    }
    loadTeam()
  }, [])

  return (
    <div className="public-content-wrap">
      <div className="section-head" style={{ marginBottom: '32px' }}>
        <h2>Training &amp; Placement Team</h2>
        <p>
          The dedicated leadership, departmental coordinators, and branch placement secretaries driving student career development and campus recruitment.
        </p>
      </div>

      {/* Central Placement Leadership */}
      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0b1f3a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} color="#c4a35a" /> Central Placement Leadership
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#0b1f3a',
                color: '#ffffff',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={28} color="#c4a35a" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: '#0f172a' }}>
                Dr. Pradeep R.
              </h4>
              <p style={{ margin: '0 0 6px', color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>
                Head, Training &amp; Placement Officer
              </p>
              <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'grid', gap: '3px' }}>
                <span>Email: <strong>placement@jssstuniv.in</strong></span>
                <span>Office: Golden Jubilee Bhavan, Room 102</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#0b1f3a',
                color: '#ffffff',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <GraduationCap size={28} color="#c4a35a" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: '#0f172a' }}>
                Prof. M. S. Suresh
              </h4>
              <p style={{ margin: '0 0 6px', color: '#2563eb', fontSize: '0.85rem', fontWeight: 600 }}>
                Corporate Relations &amp; Industry Liaison
              </p>
              <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'grid', gap: '3px' }}>
                <span>Email: <strong>corporate.relations@jssstuniv.in</strong></span>
                <span>Office: Golden Jubilee Bhavan, Room 104</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departmental Coordinators & Branch Placement Secretaries */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#0b1f3a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="#c4a35a" /> Branch Placement Secretaries &amp; HODs
            </h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
              Branch coordinators are authorized to verify and update student academic records, marks, and attendance.
            </p>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#047857', background: '#ecfdf5', padding: '4px 10px', borderRadius: '16px', fontWeight: 700 }}>
            Live Database Sync (16 Tables)
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '8px' }}>Loading department coordinators from database...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {departments.map((dept) => (
              <div
                key={dept.departmentId}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      background: '#0b1f3a',
                      color: '#ffffff',
                      padding: '3px 9px',
                      borderRadius: '6px',
                    }}
                  >
                    {dept.departmentCode}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Academic Dept #{dept.departmentId}</span>
                </div>

                <h4 style={{ margin: '0 0 6px', fontSize: '1rem', color: '#0f172a' }}>
                  {dept.departmentName}
                </h4>

                <div style={{ fontSize: '0.86rem', color: '#475569', margin: '14px 0', display: 'grid', gap: '6px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                      Head of Department / Secretary
                    </span>
                    <strong>{dept.hodName || 'Departmental Coordinator'}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <Mail size={13} style={{ color: '#94a3b8' }} />
                    <span style={{ fontSize: '0.82rem', color: '#2563eb' }}>{dept.officeEmail}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem', color: '#94a3b8' }}>
                  Academic Verification Authorized
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Role of Branch Placement Secretary Note */}
      <section style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px' }}>
        <h4 style={{ margin: '0 0 8px', color: '#0b1f3a', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="#059669" /> Role of the Branch Placement Secretary
        </h4>
        <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
          To maintain institutional data integrity, students are restricted from altering their own academic records (CGPA, backlogs, semester marksheets) after registration. Any corrections resulting from re-evaluations, supplementary examinations, or backlog clearing must be officially routed and verified by your respective <strong>Branch Placement Secretary</strong>.
        </p>
      </section>
    </div>
  )
}

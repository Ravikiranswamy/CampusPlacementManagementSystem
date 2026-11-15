import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client.js'
import {
  GraduationCap,
  Building2,
  Briefcase,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react'

export default function Home() {
  const [stats, setStats] = useState({
    companiesCount: 0,
    departmentsCount: 0,
    openDrivesCount: 0,
    highestPackage: '24.5 LPA',
    averagePackage: '11.8 LPA',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLiveStats() {
      try {
        const [comps, depts, drives] = await Promise.all([
          api.getCompanies().catch(() => []),
          api.getDepartments().catch(() => []),
          api.getPublishedDrives().catch(() => []),
        ])

        setStats({
          companiesCount: Array.isArray(comps) ? comps.length : 0,
          departmentsCount: Array.isArray(depts) ? depts.length : 4,
          openDrivesCount: Array.isArray(drives) ? drives.length : 0,
          highestPackage: '24.5 LPA',
          averagePackage: '11.8 LPA',
        })
      } catch (err) {
        console.warn('Could not load live stats from DB:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLiveStats()
  }, [])

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-container">
          <div>
            <div className="hero-kicker">
              <Sparkles size={14} /> Training & Placement Cell • JSSSTU
            </div>
            <h1 className="hero-title">
              Empowering Careers, Bridging Global Industry.
            </h1>
            <p className="hero-lead">
              Welcome to the official Unified Training &amp; Placement portal of JSS Science &amp; Technology University. Explore top-tier corporate recruiters, track eligibility, participate in recruitment drives, and secure industry placements.
            </p>
            <div className="hero-cta-group">
              <Link to="/register" className="btn-primary-hero">
                <span>Student Registration</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/recruiters" className="btn-secondary-hero">
                <Building2 size={17} />
                <span>Visiting Recruiters</span>
              </Link>
            </div>
          </div>

          {/* Live DB Statistics Display */}
          <div className="hero-stats-card">
            <h3 style={{ color: '#ffffff', margin: '0 0 16px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#c4a35a" /> Campus Hiring Highlights
            </h3>
            <div className="hero-stats-grid">
              <div className="hero-stat-box">
                <div className="hero-stat-val">
                  {loading ? '...' : stats.companiesCount > 0 ? stats.companiesCount : '120+'}
                </div>
                <div className="hero-stat-lbl">Partner Recruiters</div>
              </div>

              <div className="hero-stat-box">
                <div className="hero-stat-val">
                  {loading ? '...' : stats.openDrivesCount > 0 ? stats.openDrivesCount : 'Active'}
                </div>
                <div className="hero-stat-lbl">Active Drives</div>
              </div>

              <div className="hero-stat-box">
                <div className="hero-stat-val">{stats.highestPackage}</div>
                <div className="hero-stat-lbl">Highest CTC Package</div>
              </div>

              <div className="hero-stat-box">
                <div className="hero-stat-val">
                  {loading ? '...' : stats.departmentsCount} Branches
                </div>
                <div className="hero-stat-lbl">Engg Disciplines</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="public-content-wrap">
        {/* About Section */}
        <section className="public-section">
          <div className="section-head">
            <h2>About the Training & Placement Cell</h2>
            <p>
              Operating since the inception of Sri Jayachamarajendra College of Engineering (SJCE), the Training and Placement Cell plays a pivotal role in counseling and guiding students towards high-impact professional careers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
              <div style={{ color: '#0b1f3a', marginBottom: '12px' }}>
                <Building2 size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', margin: '0 0 8px' }}>Corporate Linkages</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                Maintaining active collaborations with Fortune 500 corporations, innovative startups, and premier research organizations across software, semiconductor, core engineering, and consulting domains.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
              <div style={{ color: '#0b1f3a', marginBottom: '12px' }}>
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', margin: '0 0 8px' }}>Skill Enhancement</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                Continuous training modules in Data Structures, Algorithms, System Design, Aptitude, Group Discussions, and Technical Mock Interviews guided by senior industry mentors.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
              <div style={{ color: '#0b1f3a', marginBottom: '12px' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', margin: '0 0 8px' }}>Transparent Governance</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                Automated database checks against real academic cutoffs, one-offer guidelines, and strict integrity verification overseen by the university placement board.
              </p>
            </div>
          </div>
        </section>

        {/* 4-Step Recruitment Process */}
        <section className="public-section">
          <div className="section-head">
            <h2>Campus Recruitment Workflow</h2>
            <p>
              A structured, transparent lifecycle connecting corporate recruiters with verified student talent.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">1</div>
              <h3>Drive Announcement</h3>
              <p>Companies share Job Descriptions (JDs), role profiles, salary structures, and academic cutoff requirements with the placement cell.</p>
            </div>

            <div className="step-card">
              <div className="step-num">2</div>
              <h3>Automated Eligibility</h3>
              <p>The system evaluates candidate CGPAs, active backlogs, and departmental criteria directly against student database records.</p>
            </div>

            <div className="step-card">
              <div className="step-num">3</div>
              <h3>Selection Rounds</h3>
              <p>Shortlisted candidates appear for scheduled online assessments, technical interviews, and HR rounds tracked in real time.</p>
            </div>

            <div className="step-card">
              <div className="step-num">4</div>
              <h3>Offer Letter Issuance</h3>
              <p>Final selection results are processed and formal offer letters are issued with full database audit logging.</p>
            </div>
          </div>
        </section>

        {/* Placement Policy Callout */}
        <section style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 6px', color: '#0b1f3a', fontSize: '1.3rem' }}>
              Have questions regarding placement rules &amp; policies?
            </h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
              Review the mandatory Do&apos;s and Don&apos;ts, irreversible registration guidelines, and attendance policies before applying.
            </p>
          </div>
          <Link to="/faq" className="public-btn-login" style={{ background: '#0b1f3a', color: '#ffffff', padding: '12px 24px', fontSize: '0.95rem' }}>
            <span>Read Placement FAQ</span>
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  )
}


import { Link } from 'react-router-dom'
import {
  Briefcase,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-kicker">
              <Sparkles size={14} /> Campus Placement Platform • JSS Science &amp; Technology University
            </div>
            <h1 className="hero-title">
              Empowering Campus Careers &amp; Modern Recruitment.
            </h1>
            <p className="hero-lead">
              A unified placement management platform supporting JSS Science &amp; Technology University. Streamlining recruitment drives, automated eligibility validation, multi-round selection tracking, and transparent career placements.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="public-content-wrap">
        {/* About Section */}
        <section className="public-section">
          <div className="section-head">
            <h2>About the Campus Placement Platform</h2>
            <p>
              An integrated recruitment and database management system developed to support JSS Science &amp; Technology University. Designed to coordinate corporate recruitment drives, enforce automated academic cutoffs, and streamline student placement lifecycles.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#0b1f3a', marginBottom: '14px' }}>
                <Briefcase size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', margin: '0 0 8px', color: '#0b1f3a' }}>Automated Drive Management</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                Centralized publishing of placement drives with multi-JD attachments, dynamic CTC &amp; stipend structures, strict registration deadlines, and department eligibility mappings.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#0b1f3a', marginBottom: '14px' }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', margin: '0 0 8px', color: '#0b1f3a' }}>Role-Based Portals</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                Dedicated interfaces for Students, Placement Team coordinators, and Placement Officers, featuring locked academic records, verified CGPA standings, and secure role-based access.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#0b1f3a', marginBottom: '14px' }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', margin: '0 0 8px', color: '#0b1f3a' }}>Transparent Selection &amp; Feedbacks</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                End-to-end recruitment lifecycle from multi-round evaluations and offer letter issuance to past interview feedbacks archived for upcoming student batches.
              </p>
            </div>
          </div>
        </section>

        {/* 4-Step Recruitment Process */}
        <section className="public-section">
          <div className="section-head">
            <h2>Campus Recruitment Lifecycle</h2>
            <p>
              A structured, transparent process connecting corporate recruiters with verified university talent.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">1</div>
              <h3>Drive Announcement</h3>
              <p>Placement coordinators publish drives with multiple JD attachments, salary packages, and academic criteria.</p>
            </div>

            <div className="step-card">
              <div className="step-num">2</div>
              <h3>Automated Eligibility</h3>
              <p>The platform instantly checks student CGPAs, 10th/12th percentages, and active backlogs against drive cutoffs.</p>
            </div>

            <div className="step-card">
              <div className="step-num">3</div>
              <h3>Selection Rounds</h3>
              <p>Candidates progress through scheduled online assessments, technical rounds, and HR interviews tracked dynamically.</p>
            </div>

            <div className="step-card">
              <div className="step-num">4</div>
              <h3>Offer Letters &amp; Archival</h3>
              <p>Selected students receive verified offer letters, and candidate interview experiences are archived to guide peers.</p>
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

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../api/client.js'
import Modal from '../../components/ui/Modal.jsx'
import { formatPackage, matchesQuery } from '../../data/mockData.js'
import { usePageQuery } from '../../hooks/usePageQuery.js'
import {
  MessageSquareQuote,
  Star,
  Search,
  Filter,
  Plus,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  User,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  FileText,
  Loader2,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Laptop,
} from 'lucide-react'

export default function InterviewFeedback() {
  const query = usePageQuery()
  const { session } = useAuth()
  const studentId = session?.studentId || 1

  const [feedbacks, setFeedbacks] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedMode, setSelectedMode] = useState('all')

  // Modals
  const [viewingFeedback, setViewingFeedback] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  // Form State
  const [form, setForm] = useState({
    companyName: '',
    companyId: '',
    roleTitle: '',
    location: '',
    graduationYear: new Date().getFullYear(),
    interviewMode: 'Online',
    packageCtc: '',
    basePay: '',
    stipendMonthly: '',
    codingRating: 4,
    interviewRating: 4,
    overallRating: 4,
    technicalRoundDesc: '',
    hrRoundDesc: '',
    topicsCovered: '',
    valuableTips: '',
  })

  async function loadData() {
    try {
      setLoading(true)
      const [feedbacksData, companiesData] = await Promise.all([
        api.getFeedbacks().catch(() => []),
        api.getCompanies().catch(() => []),
      ])
      setFeedbacks(Array.isArray(feedbacksData) ? feedbacksData : [])
      setCompanies(Array.isArray(companiesData) ? companiesData : [])
      setError(null)
    } catch (err) {
      console.error('Error fetching feedbacks:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleAddSubmit(e) {
    e.preventDefault()
    if (!form.companyName.trim()) {
      setFormError('Company name is required.')
      return
    }
    if (!form.roleTitle.trim()) {
      setFormError('Role title is required.')
      return
    }

    setSubmitting(true)
    setFormError(null)

    try {
      await api.submitFeedback({
        studentId,
        companyId: form.companyId ? parseInt(form.companyId) : null,
        companyName: form.companyName.trim(),
        roleTitle: form.roleTitle.trim(),
        location: form.location.trim() || null,
        graduationYear: parseInt(form.graduationYear),
        interviewMode: form.interviewMode,
        packageCtc: form.packageCtc ? parseFloat(form.packageCtc) : null,
        basePay: form.basePay ? parseFloat(form.basePay) : null,
        stipendMonthly: form.stipendMonthly ? parseFloat(form.stipendMonthly) : null,
        codingRating: form.codingRating,
        interviewRating: form.interviewRating,
        overallRating: form.overallRating,
        technicalRoundDesc: form.technicalRoundDesc.trim() || null,
        hrRoundDesc: form.hrRoundDesc.trim() || null,
        topicsCovered: form.topicsCovered.trim() || null,
        valuableTips: form.valuableTips.trim() || null,
      })

      setIsAdding(false)
      // Reset form
      setForm({
        companyName: '',
        companyId: '',
        roleTitle: '',
        location: '',
        graduationYear: new Date().getFullYear(),
        interviewMode: 'Online',
        packageCtc: '',
        basePay: '',
        stipendMonthly: '',
        codingRating: 4,
        interviewRating: 4,
        overallRating: 4,
        technicalRoundDesc: '',
        hrRoundDesc: '',
        topicsCovered: '',
        valuableTips: '',
      })
      await loadData()
    } catch (err) {
      setFormError(err.message || 'Failed to submit interview experience.')
    } finally {
      setSubmitting(false)
    }
  }

  // Filter options
  const uniqueCompanies = ['all', ...new Set(feedbacks.map((f) => f.companyName).filter(Boolean))]
  const uniqueYears = ['all', ...new Set(feedbacks.map((f) => f.graduationYear).filter(Boolean))]

  const filtered = feedbacks.filter((f) => {
    const q = (search || query || '').toLowerCase().trim()
    const matchesSearch =
      !q ||
      matchesQuery(q, [
        f.companyName,
        f.roleTitle,
        f.studentName,
        f.studentUsn,
        f.departmentCode,
        f.location,
        f.topicsCovered,
      ])

    const matchesComp = selectedCompany === 'all' || f.companyName === selectedCompany
    const matchesYr = selectedYear === 'all' || String(f.graduationYear) === String(selectedYear)
    const matchesMd = selectedMode === 'all' || f.interviewMode === selectedMode

    return matchesSearch && matchesComp && matchesYr && matchesMd
  })

  function renderStars(count = 0) {
    return (
      <div style={{ display: 'inline-flex', gap: '2px', color: '#eab308' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={13}
            fill={i <= count ? '#eab308' : 'none'}
            stroke={i <= count ? '#eab308' : '#cbd5e1'}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="page-stack">
      {error && (
        <div style={{ padding: '0.85rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {/* Top Banner & Action */}
      <section className="panel" style={{ background: '#f8fafc', borderLeft: '4px solid #0b1f3a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
                Interview Experiences &amp; Feedback
              </h2>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  background: '#0b1f3a',
                  color: '#ffffff',
                  padding: '3px 9px',
                  borderRadius: '12px',
                }}
              >
                {feedbacks.length} Experiences
              </span>
            </div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
              Real recruitment experiences, coding test insights, HR discussions, and interview tips shared by placed students and seniors.
            </p>
          </div>

          <button
            type="button"
            className="register-btn"
            onClick={() => { setIsAdding(true); setFormError(null) }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Add My Experience</span>
          </button>
        </div>
      </section>

      {/* Filters Strip */}
      <section className="panel">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search company, student, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Filter Selects */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Company:</span>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
              >
                <option value="all">All Companies</option>
                {uniqueCompanies.filter((c) => c !== 'all').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Batch:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
              >
                <option value="all">All Years</option>
                {uniqueYears.filter((y) => y !== 'all').map((y) => (
                  <option key={y} value={y}>{y} Batch</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Mode:</span>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
              >
                <option value="all">All Modes</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline (Campus)</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedbacks Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '8px' }}>Loading interview experiences from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: '#f8fafc', borderRadius: '10px', color: '#64748b' }}>
            <MessageSquareQuote size={40} style={{ color: '#cbd5e1', marginBottom: '8px' }} />
            <h3 style={{ margin: '0 0 6px', color: '#1e293b' }}>No Interview Experiences Yet</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem' }}>
              Be the first to share your recruitment journey and help preparing juniors succeed!
            </p>
            <button
              type="button"
              className="register-btn"
              onClick={() => setIsAdding(true)}
            >
              Share Interview Experience
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
            {filtered.map((fb) => (
              <div
                key={fb.feedbackId}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s ease',
                }}
              >
                <div>
                  {/* Card Header: Company, Role & Mode */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building2 size={16} color="#0b1f3a" />
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
                          {fb.companyName}
                        </h3>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.86rem', marginTop: '2px' }}>
                        {fb.roleTitle} {fb.location ? `• ${fb.location}` : ''}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: fb.interviewMode === 'Online' ? '#e0e7ff' : '#fef3c7',
                        color: fb.interviewMode === 'Online' ? '#3730a3' : '#92400e',
                      }}
                    >
                      {fb.interviewMode}
                    </span>
                  </div>

                  {/* Student & Compensation Strip */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      margin: '12px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>
                        {fb.studentName || 'Placed Student'}
                      </div>
                      <div style={{ color: '#64748b' }}>
                        {fb.departmentCode || 'CSE'} • {fb.graduationYear} Batch
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#047857', fontSize: '0.92rem' }}>
                        {fb.packageCtc ? `${fb.packageCtc} LPA` : fb.stipendMonthly ? `₹${fb.stipendMonthly}/mo` : 'Confidential'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.74rem' }}>
                        {fb.packageCtc ? 'Full-Time CTC' : 'Monthly Stipend'}
                      </div>
                    </div>
                  </div>

                  {/* Ratings Row */}
                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#475569', marginBottom: '12px' }}>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', marginBottom: '2px' }}>Coding Round</span>
                      {renderStars(fb.codingRating || 3)}
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', marginBottom: '2px' }}>Tech Interview</span>
                      {renderStars(fb.interviewRating || 4)}
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', marginBottom: '2px' }}>Overall</span>
                      {renderStars(fb.overallRating || 4)}
                    </div>
                  </div>

                  {/* Short Tip Snippet */}
                  {fb.valuableTips && (
                    <p
                      style={{
                        fontSize: '0.84rem',
                        color: '#64748b',
                        lineHeight: 1.5,
                        margin: '0 0 14px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      💡 <em>&quot;{fb.valuableTips}&quot;</em>
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {fb.topicsCovered ? `Topics: ${fb.topicsCovered.split(',').slice(0, 2).join(', ')}...` : 'Verified Experience'}
                  </span>
                  <button
                    type="button"
                    className="secondary-button compact"
                    onClick={() => setViewingFeedback(fb)}
                    style={{ fontSize: '0.82rem', padding: '4px 12px' }}
                  >
                    View Details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* View Details Modal */}
      {viewingFeedback && (
        <Modal
          title={`Interview Experience: ${viewingFeedback.companyName}`}
          onClose={() => setViewingFeedback(null)}
        >
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Header Strip */}
            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div>
                  <h3 style={{ margin: '0 0 2px', fontSize: '1.2rem', color: '#0f172a' }}>
                    {viewingFeedback.roleTitle}
                  </h3>
                  <div style={{ color: '#64748b', fontSize: '0.88rem' }}>
                    {viewingFeedback.companyName} • {viewingFeedback.location || 'Pan-India'} • Mode: <strong>{viewingFeedback.interviewMode}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#047857' }}>
                    {viewingFeedback.packageCtc ? `${viewingFeedback.packageCtc} LPA` : viewingFeedback.stipendMonthly ? `₹${viewingFeedback.stipendMonthly}/mo` : 'N/A'}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {viewingFeedback.basePay ? `Base: ${viewingFeedback.basePay} LPA` : 'Compensation'}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '8px', fontSize: '0.84rem', color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                <span>Shared by: <strong>{viewingFeedback.studentName || 'Student'}</strong> ({viewingFeedback.departmentCode || 'CSE'})</span>
                <span>Graduation Batch: <strong>{viewingFeedback.graduationYear}</strong></span>
              </div>
            </div>

            {/* Ratings Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#fffbeb', border: '1px solid #fde68a', padding: '12px', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.76rem', color: '#92400e', display: 'block', fontWeight: 600 }}>Coding Test</span>
                {renderStars(viewingFeedback.codingRating)}
                <span style={{ fontSize: '0.76rem', color: '#78350f', display: 'block', marginTop: '2px' }}>{viewingFeedback.codingRating} / 5</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.76rem', color: '#92400e', display: 'block', fontWeight: 600 }}>Technical Round</span>
                {renderStars(viewingFeedback.interviewRating)}
                <span style={{ fontSize: '0.76rem', color: '#78350f', display: 'block', marginTop: '2px' }}>{viewingFeedback.interviewRating} / 5</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.76rem', color: '#92400e', display: 'block', fontWeight: 600 }}>Overall Experience</span>
                {renderStars(viewingFeedback.overallRating)}
                <span style={{ fontSize: '0.76rem', color: '#78350f', display: 'block', marginTop: '2px' }}>{viewingFeedback.overallRating} / 5</span>
              </div>
            </div>

            {/* Technical Round Description */}
            <div>
              <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', color: '#0b1f3a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Laptop size={16} color="#2563eb" /> Technical Round Description &amp; Questions
              </h4>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', fontSize: '0.88rem', lineHeight: 1.6, color: '#334155' }}>
                {viewingFeedback.technicalRoundDesc || 'No specific technical round notes provided.'}
              </div>
            </div>

            {/* HR Round Description */}
            <div>
              <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', color: '#0b1f3a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} color="#059669" /> HR / Behavioral Discussion
              </h4>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', fontSize: '0.88rem', lineHeight: 1.6, color: '#334155' }}>
                {viewingFeedback.hrRoundDesc || 'Standard HR inquiries covering background, teamwork scenarios, and willingness to relocate.'}
              </div>
            </div>

            {/* Topics Covered */}
            {viewingFeedback.topicsCovered && (
              <div>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', color: '#0b1f3a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} color="#d97706" /> Key Topics &amp; Questions Asked
                </h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {viewingFeedback.topicsCovered.split(',').map((topic, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: '#e2e8f0',
                        color: '#334155',
                        padding: '3px 10px',
                        borderRadius: '12px',
                      }}
                    >
                      {topic.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Valuable Tips */}
            {viewingFeedback.valuableTips && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px 14px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#059669" /> Valuable Tips for Aspirants
                </h4>
                <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: '#047857' }}>
                  {viewingFeedback.valuableTips}
                </p>
              </div>
            )}
          </div>

          <div className="modal-actions" style={{ marginTop: '16px' }}>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setViewingFeedback(null)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Add Experience Modal */}
      {isAdding && (
        <Modal
          title="Share Your Interview Experience"
          onClose={() => !submitting && setIsAdding(false)}
        >
          <form onSubmit={handleAddSubmit} style={{ display: 'grid', gap: '14px' }}>
            {formError && (
              <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.85rem' }}>
                {formError}
              </div>
            )}

            {/* Company & Role */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco Systems, Google"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer"
                  value={form.roleTitle}
                  onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Location & Year & Mode */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Batch (Year) *
                </label>
                <input
                  type="number"
                  required
                  value={form.graduationYear}
                  onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Interview Mode *
                </label>
                <select
                  value={form.interviewMode}
                  onChange={(e) => setForm({ ...form, interviewMode: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', background: '#ffffff', boxSizing: 'border-box' }}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* CTC / Stipend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Full-Time CTC (LPA)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 15.0"
                  value={form.packageCtc}
                  onChange={(e) => setForm({ ...form, packageCtc: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Base Pay (LPA)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 12.0"
                  value={form.basePay}
                  onChange={(e) => setForm({ ...form, basePay: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Stipend (₹/month)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.stipendMonthly}
                  onChange={(e) => setForm({ ...form, stipendMonthly: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Ratings (1 to 5) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Coding Difficulty (1–5)
                </label>
                <select
                  value={form.codingRating}
                  onChange={(e) => setForm({ ...form, codingRating: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value={1}>1 - Very Easy</option>
                  <option value={2}>2 - Easy</option>
                  <option value={3}>3 - Moderate</option>
                  <option value={4}>4 - Hard</option>
                  <option value={5}>5 - Very Hard</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Tech Round (1–5)
                </label>
                <select
                  value={form.interviewRating}
                  onChange={(e) => setForm({ ...form, interviewRating: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value={1}>1 - Basic</option>
                  <option value={2}>2 - Standard</option>
                  <option value={3}>3 - In-depth</option>
                  <option value={4}>4 - Rigorous</option>
                  <option value={5}>5 - Intensive</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Overall (1–5)
                </label>
                <select
                  value={form.overallRating}
                  onChange={(e) => setForm({ ...form, overallRating: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value={1}>1 - Poor</option>
                  <option value={2}>2 - Fair</option>
                  <option value={3}>3 - Good</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={5}>5 - Excellent</option>
                </select>
              </div>
            </div>

            {/* Technical Round Desc */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Technical Round Description &amp; Questions Asked
              </label>
              <textarea
                rows={3}
                placeholder="Mention coding problem statements, system design topics, OS/DBMS questions..."
                value={form.technicalRoundDesc}
                onChange={(e) => setForm({ ...form, technicalRoundDesc: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            {/* HR Round Desc */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                HR &amp; Behavioral Round Details
              </label>
              <textarea
                rows={2}
                placeholder="Questions about relocation, conflict handling, why this company..."
                value={form.hrRoundDesc}
                onChange={(e) => setForm({ ...form, hrRoundDesc: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            {/* Topics & Tips */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Topics Covered (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Trees, DP, OS Semaphore, SQL"
                  value={form.topicsCovered}
                  onChange={(e) => setForm({ ...form, topicsCovered: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Valuable Tips for Juniors
                </label>
                <input
                  type="text"
                  placeholder="e.g. Focus on core project fundamentals"
                  value={form.valuableTips}
                  onChange={(e) => setForm({ ...form, valuableTips: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions" style={{ marginTop: '8px' }}>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setIsAdding(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="register-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Submitting Experience...
                  </>
                ) : (
                  'Publish Experience'
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}


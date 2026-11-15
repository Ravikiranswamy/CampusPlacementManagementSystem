import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import {
  Building2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Briefcase,
  Loader2,
  Globe,
  Mail,
} from 'lucide-react'

export default function PastRecruiters() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true)
        const data = await api.getCompanies()
        setCompanies(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching recruiters:', err)
        setCompanies([])
      } finally {
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [])

  // Extract unique industries from database companies
  const industries = ['all', ...new Set(companies.map((c) => c.industry).filter(Boolean))]

  const filtered = companies.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.industry && c.industry.toLowerCase().includes(search.toLowerCase()))

    const matchesInd = selectedIndustry === 'all' || c.industry === selectedIndustry
    return matchesSearch && matchesInd
  })

  return (
    <div className="public-content-wrap">
      <div className="section-head" style={{ marginBottom: '24px' }}>
        <h2>Past &amp; Visiting Recruiters</h2>
        <p>
          Renowned multinational corporations and emerging engineering innovators actively recruiting graduating talent from JSS Science &amp; Technology University.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search company by name or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} style={{ color: '#64748b' }} />
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>Industry:</span>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.88rem',
              background: '#ffffff',
              outline: 'none',
              fontWeight: 500,
            }}
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind === 'all' ? 'All Industries' : ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '12px' }}>Loading recruiter directory from database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
            color: '#64748b',
          }}
        >
          <Building2 size={40} style={{ color: '#94a3b8', marginBottom: '12px' }} />
          <h3 style={{ margin: '0 0 6px', color: '#1e293b' }}>
            {companies.length === 0 ? 'No Recruiters Registered Yet' : 'No matching recruiters found'}
          </h3>
          <p style={{ margin: 0, fontSize: '0.92rem' }}>
            {companies.length === 0
              ? 'Placement team can log in to the portal console to add corporate recruiters and publish drives.'
              : 'Try clearing your search query or selecting a different industry filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((company) => (
            <div
              key={company.companyId}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '22px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: '#f1f5f9',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#0b1f3a',
                      }}
                    >
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{company.name}</h3>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{company.industry || 'Technology'}</span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: company.isActive ? '#ecfdf5' : '#f1f5f9',
                      color: company.isActive ? '#047857' : '#64748b',
                    }}
                  >
                    {company.isActive ? 'Active Recruiter' : 'Past Partner'}
                  </span>
                </div>

                <div style={{ fontSize: '0.88rem', color: '#475569', margin: '14px 0', display: 'grid', gap: '6px' }}>
                  {company.contactPerson && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Briefcase size={14} style={{ color: '#94a3b8' }} />
                      <span>Contact: <strong>{company.contactPerson}</strong></span>
                    </div>
                  )}
                  {company.contactEmail && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={14} style={{ color: '#94a3b8' }} />
                      <span style={{ color: '#64748b' }}>{company.contactEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Verified Recruiter</span>
                {company.website ? (
                  <a
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.85rem',
                      color: '#2563eb',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <span>Visit Website</span>
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Campus Partner</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


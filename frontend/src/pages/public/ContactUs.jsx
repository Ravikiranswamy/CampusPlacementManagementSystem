import { useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  GraduationCap,
} from 'lucide-react'

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Student Query',
    subject: '',
    message: '',
  })

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="public-content-wrap">
      <div className="section-head" style={{ marginBottom: '36px' }}>
        <h2>Contact the Placement Cell</h2>
        <p>
          Have questions regarding upcoming recruitment drives, corporate partnerships, or placement policies? Reach out to our training and placement office.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px' }}>
        {/* Contact Information Cards */}
        <div style={{ display: 'grid', gap: '20px', alignContent: 'start' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  color: '#0b1f3a',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <MapPin size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: '#0f172a' }}>
                  Office Location
                </h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Department of Training &amp; Placement<br />
                  Golden Jubilee Bhavan, 1st Floor<br />
                  JSS Science &amp; Technology University (SJCE Campus)<br />
                  Mysuru – 570006, Karnataka, India
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  color: '#0b1f3a',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Phone size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: '#0f172a' }}>
                  Telephone &amp; Helplines
                </h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Direct: +91 (0821) 2548285 / 2548286<br />
                  EPABX: +91 (0821) 2548287 Ext. 102<br />
                  Fax: +91 (0821) 2548290
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  color: '#0b1f3a',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Mail size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: '#0f172a' }}>
                  Official Emails
                </h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Student Inquiries: <strong>placement@jssstuniv.in</strong><br />
                  Corporate Relations: <strong>corporate.relations@jssstuniv.in</strong><br />
                  Grievances: <strong>tp.cell@jssstuniv.in</strong>
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  color: '#0b1f3a',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Clock size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: '#0f172a' }}>
                  Office Hours
                </h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Monday – Friday: 9:00 AM – 5:30 PM<br />
                  Saturday: 9:00 AM – 1:30 PM<br />
                  Sunday &amp; University Holidays: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message / Reach-Out Form */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '32px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
          }}
        >
          <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', color: '#0b1f3a' }}>
            Submit an Inquiry
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 24px' }}>
            Our placement coordinators review and respond to inquiries within 1 working day.
          </p>

          {submitted ? (
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '10px',
                padding: '28px',
                textAlign: 'center',
                color: '#065f46',
              }}
            >
              <CheckCircle2 size={40} style={{ marginBottom: '12px', color: '#059669' }} />
              <h4 style={{ margin: '0 0 6px', fontSize: '1.15rem' }}>Message Dispatched</h4>
              <p style={{ margin: '0 0 16px', fontSize: '0.92rem', color: '#047857' }}>
                Your message has been routed to the Training &amp; Placement office desk. A confirmation has been logged.
              </p>
              <button
                type="button"
                className="secondary-button compact"
                onClick={() => setSubmitted(false)}
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.edu or company@org.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Query Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.92rem',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="Student Query">Student Placement Query</option>
                  <option value="Recruiter Onboarding">Corporate Recruiter / Drive Proposal</option>
                  <option value="Academic Verification">Academic Record / Backlog Correction</option>
                  <option value="Other">General Administration</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide details regarding your question or proposal..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary-hero"
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  justifyContent: 'center',
                  padding: '12px',
                  fontSize: '0.95rem',
                  marginTop: '6px',
                }}
              >
                <Send size={16} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

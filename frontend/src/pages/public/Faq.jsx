import { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileText,
  Lock,
  UserCheck,
  ShieldAlert,
} from 'lucide-react'

const faqItems = [
  {
    q: 'Can I unregister from a drive after submitting my application?',
    a: 'No. As per strict university placement cell guidelines, registration for any company drive is final and irreversible. Once registered, the student is obligated to attend all selection rounds (online test, technical interview, HR interview). Failure to appear without prior written medical approval leads to disciplinary blocking.',
  },
  {
    q: 'How does the automated eligibility evaluation engine work?',
    a: 'The placement engine runs real-time SQL queries matching your academic credentials (CGPA, active backlogs count, and engineering branch) against the company cutoffs. If you meet all criteria and do not have an active placement restriction, the drive moves into your "Eligible" tab with a Register button.',
  },
  {
    q: 'Why can I not edit my CGPA or backlog count directly on the profile page?',
    a: 'To prevent fraudulent applications, academic records are strictly read-only for students. Only authorized Branch Placement Secretaries and the Placement Officer have administrative rights to update official CGPAs and backlog tallies after re-evaluation or semester grade cards.',
  },
  {
    q: 'What details am I allowed to edit on my student profile?',
    a: 'Students have write permissions to update their Contact Phone Number, Primary Resume / CV Link (Google Drive / PDF), and Confidential Portal Password at any time.',
  },
  {
    q: 'What is the "One Student, One Offer" policy?',
    a: 'The university follows a structured tier policy. A student who accepts a standard job offer is excluded from applying to other regular tier companies to ensure fair opportunities for all peers. Upgrades are only permitted for designated "Dream" or "Super Dream" tier opportunities (above prescribed CTC cutoffs).',
  },
  {
    q: 'What are the consequences of missing an interview round or being absent?',
    a: 'Unannounced absenteeism damages institutional relationships with corporate recruiters. Under database triggers and rules, absent students are flagged, assigned an active placement restriction, and prohibited from applying to upcoming campus recruitment drives.',
  },
  {
    q: 'How do I submit my interview experience and feedback for juniors?',
    a: 'Once you participate in a recruitment drive, you can navigate to the Feedback section to submit round-by-round tips, technical questions asked, HR discussion topics, and difficulty ratings to help prepare subsequent batches.',
  },
]

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(0)

  function toggle(idx) {
    setOpenIdx(openIdx === idx ? -1 : idx)
  }

  return (
    <div className="public-content-wrap">
      <div className="section-head" style={{ marginBottom: '32px' }}>
        <h2>Placement Policies &amp; FAQ</h2>
        <p>
          Essential code of conduct, mandatory Do&apos;s and Don&apos;ts, and frequently asked questions governing campus placements at JSS Science &amp; Technology University.
        </p>
      </div>

      {/* Do's and Don'ts Grid */}
      <div className="faq-grid">
        {/* DO's */}
        <div className="policy-card card-dos">
          <h3 style={{ color: '#047857' }}>
            <CheckCircle2 size={22} />
            <span>The Essential DO&apos;s</span>
          </h3>
          <ul className="policy-list">
            <li>
              <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong>Check university email daily:</strong> Drive schedules, shortlists, and test links are communicated with short notice windows.
              </div>
            </li>
            <li>
              <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong>Keep your CV and resume updated:</strong> Ensure your project links, GitHub profiles, and contact details are verified before applying.
              </div>
            </li>
            <li>
              <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong>Attend the Pre-Placement Talk (PPT):</strong> Research the recruiting company, role expectations, and tech stack thoroughly prior to interviews.
              </div>
            </li>
            <li>
              <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong>Adhere to formal dress code:</strong> Wear university-prescribed executive formal attire and arrive 15 minutes before reporting time.
              </div>
            </li>
            <li>
              <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong>Verify your academic records:</strong> Report any discrepancy in CGPA or backlogs to your Branch Placement Secretary immediately.
              </div>
            </li>
          </ul>
        </div>

        {/* DON'Ts */}
        <div className="policy-card card-donts">
          <h3 style={{ color: '#b91c1c' }}>
            <XCircle size={22} />
            <span>Strict DON&apos;Ts (Disciplinary Violations)</span>
          </h3>
          <ul className="policy-list">
            <li>
              <XCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong>Do NOT register and skip the process:</strong> Registration is irreversible. Absence from scheduled tests or rounds results in a permanent block.
              </div>
            </li>
            <li>
              <XCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong>Do NOT engage in malpractice:</strong> Cheating in online coding assessments or proxy interviews leads to immediate university debarment.
              </div>
            </li>
            <li>
              <XCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong>Do NOT falsify credentials:</strong> Fabricating CGPA, cleared backlogs, or past internships triggers disciplinary legal action.
              </div>
            </li>
            <li>
              <XCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong>Do NOT miss registration deadlines:</strong> Portal closes automatically at cutoff time; late registrations cannot be accommodated.
              </div>
            </li>
            <li>
              <XCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong>Do NOT contact recruiters directly:</strong> All communication must be officially routed through the Training &amp; Placement Cell.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Accordion FAQ Section */}
      <section style={{ maxWidth: '880px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.3rem', color: '#0b1f3a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={20} color="#c4a35a" /> Frequently Asked Questions
        </h3>

        <div>
          {faqItems.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <div key={idx} className="accordion-item">
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp size={18} color="#0b1f3a" /> : <ChevronDown size={18} color="#94a3b8" />}
                </button>
                {isOpen && <div className="accordion-body">{item.a}</div>}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

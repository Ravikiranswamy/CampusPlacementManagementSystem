import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  GraduationCap,
  Building2,
  Users,
  HelpCircle,
  Phone,
  LogIn,
  UserPlus,
  ArrowRight,
  Database,
  ExternalLink,
} from 'lucide-react'
import '../styles/public.css'

export default function PublicShell() {
  const { session } = useAuth()

  return (
    <div className="public-page">
      {/* Top University Placement Navigation Bar */}
      <header className="public-header">
        <div className="public-nav-container">
          <Link to="/" className="public-brand">
            <div className="public-brand-logo">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="public-brand-title">JSS Science & Technology University</div>
              <div className="public-brand-subtitle">Department of Training & Placement</div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation">
            <ul className="public-nav-links">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `public-nav-link ${isActive ? 'active' : ''}`}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/recruiters"
                  className={({ isActive }) => `public-nav-link ${isActive ? 'active' : ''}`}
                >
                  Past Recruiters
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/team-directory"
                  className={({ isActive }) => `public-nav-link ${isActive ? 'active' : ''}`}
                >
                  Placement Team
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/faq"
                  className={({ isActive }) => `public-nav-link ${isActive ? 'active' : ''}`}
                >
                  FAQ & Policies
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) => `public-nav-link ${isActive ? 'active' : ''}`}
                >
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* User Auth Buttons */}
          <div className="public-nav-actions">
            {session ? (
              <Link to={session.home} className="public-btn-login">
                <span>Enter Portal ({session.role})</span>
                <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="public-btn-register">
                  <UserPlus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  Student Register
                </Link>
                <Link to="/login" className="public-btn-login">
                  <LogIn size={14} />
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Outlet for Public Sub-Pages */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Institutional Footer */}
      <footer className="public-footer">
        <div className="footer-container">
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <GraduationCap size={20} color="#c4a35a" />
              <strong style={{ color: '#ffffff', fontSize: '1rem' }}>
                JSS Science & Technology University
              </strong>
            </div>
            <p style={{ lineHeight: 1.6, margin: '0 0 14px' }}>
              SJCE Campus, Mysuru - 570006, Karnataka, India.  
              The Training & Placement Cell bridges academic excellence and career success by partnering with top-tier global recruiters.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', fontSize: '0.76rem', padding: '4px 8px', borderRadius: '4px' }}>
                DBMS Course 24CS520
              </span>
              <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', fontSize: '0.76rem', padding: '4px 8px', borderRadius: '4px' }}>
                Neon PostgreSQL 18
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/recruiters">Visiting Companies</Link></li>
              <li><Link to="/team-directory">Branch Secretaries & HODs</Link></li>
              <li><Link to="/faq">Placement Rules & FAQ</Link></li>
              <li><Link to="/contact">Contact Office</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Portal Access</h4>
            <ul className="footer-links">
              <li><Link to="/login">Student Portal Login</Link></li>
              <li><Link to="/register">Student Self-Registration</Link></li>
              <li><Link to="/login">Placement Team Console</Link></li>
              <li><Link to="/login">Officer Administration</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Placement Office</h4>
            <p style={{ margin: '0 0 8px', lineHeight: 1.6 }}>
              <strong>T&P Cell, Golden Jubilee Bhavan</strong><br />
              Phone: +91 (0821) 2548285 / 86<br />
              Email: placement@jssstuniv.in<br />
              Mon – Sat: 9:00 AM – 5:30 PM
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} JSS Science & Technology University. All Rights Reserved.
          </div>
          <div style={{ color: '#64748b' }}>
            Built with React 19 • Spring Boot 4.1 • PostgreSQL
          </div>
        </div>
      </footer>
    </div>
  )
}


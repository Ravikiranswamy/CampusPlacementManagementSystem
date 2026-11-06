import { GraduationCap } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Sidebar({ brand, navItems, note, onNavigate }) {
  const home = navItems[0]?.items[0]?.to ?? '/'

  return (
    <aside className="sidebar">
      <NavLink to={home} end className="sidebar-brand" onClick={onNavigate}>
        <span className="brand-mark" aria-hidden="true">
          <GraduationCap size={22} />
        </span>
        <div>
          <p className="brand-kicker">University portal</p>
          <p className="brand-name">{brand}</p>
        </div>
      </NavLink>

      <nav className="sidebar-nav" aria-label="Primary">
        {navItems.map((group) => (
          <div className="nav-group" key={group.label}>
            <p className="nav-label">{group.label}</p>
            <ul>
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        isActive ? 'nav-link active' : 'nav-link'
                      }
                      onClick={onNavigate}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {note ? <p className="sidebar-note">{note}</p> : null}
    </aside>
  )
}

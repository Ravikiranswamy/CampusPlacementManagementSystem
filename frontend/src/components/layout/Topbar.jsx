import { LogOut, Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'

function pageTitle(pathname, navItems) {
  for (const group of navItems) {
    const match = group.items.find((item) => pathname === item.to)
    if (match) {
      return match.label
    }
  }
  return 'Campus Placement'
}

function initials(name) {
  if (!name) return 'U'
  return String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U'
}

export default function Topbar({ navItems, user, query, onQueryChange, onMenuClick, onLogout }) {
  const { pathname } = useLocation()
  const title = pageTitle(pathname, navItems)

  return (
    <header className="topbar">
      <div className="topbar-leading">
        <button
          type="button"
          className="menu-button"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <div>
          <p className="topbar-kicker">Campus Recruitment and Placement</p>
          <h1 className="topbar-title">{title}</h1>
        </div>
      </div>

      <label className="topbar-search">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search this page"
          aria-label="Search this page"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>

      <div className="topbar-user">
        <span className="avatar" aria-hidden="true">
          {initials(user?.name)}
        </span>
        <span className="user-meta">
          <span className="user-name">{user?.name || 'User'}</span>
          <span className="user-role">{user?.role || ''}</span>
        </span>
        <button type="button" className="sign-out" onClick={onLogout}>
          <LogOut size={16} aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  )
}

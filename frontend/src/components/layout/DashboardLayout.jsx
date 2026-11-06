import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

export default function DashboardLayout({ brand, navItems, note, user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { pathname } = useLocation()

  useEffect(() => {
    setQuery('')
    setSidebarOpen(false)
  }, [pathname])

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <div className={sidebarOpen ? 'app-shell sidebar-open' : 'app-shell'}>
      <Sidebar
        brand={brand}
        navItems={navItems}
        note={note}
        onNavigate={closeSidebar}
      />
      {sidebarOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      ) : null}
      <div className="app-main">
        <Topbar
          navItems={navItems}
          user={user}
          query={query}
          onQueryChange={setQuery}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={onLogout}
        />
        <main className="app-content">
          <Outlet context={{ query }} />
        </main>
      </div>
    </div>
  )
}

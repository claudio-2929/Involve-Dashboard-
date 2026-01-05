import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'

// Pages
import Dashboard from './pages/Dashboard'
import Finance from './pages/Finance'
import Operations from './pages/Operations'
import Technology from './pages/Technology'
import Sales from './pages/Sales'
import Projects from './pages/Projects'
import People from './pages/People'
import Roadmap from './pages/Roadmap'

// Context for app-wide state
export const AppContext = createContext()

// Icons as SVG components
const Icons = {
    Dashboard: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
    Finance: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    ),
    Operations: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
        </svg>
    ),
    Technology: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
        </svg>
    ),
    Sales: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    Projects: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
    ),
    People: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    Roadmap: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    ),
    Sun: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
    ),
    Moon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    ),
    Menu: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    ),
    Close: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
}

// Navigation items
const navItems = [
    { path: '/', label: 'Overview', icon: 'Dashboard' },
    { path: '/finance', label: 'Finance', icon: 'Finance' },
    { path: '/operations', label: 'Operations', icon: 'Operations' },
    { path: '/technology', label: 'Technology', icon: 'Technology' },
    { path: '/sales', label: 'Sales & Partners', icon: 'Sales' },
    { path: '/projects', label: 'Projects', icon: 'Projects' },
    { path: '/people', label: 'People', icon: 'People' },
    { path: '/roadmap', label: 'Roadmap', icon: 'Roadmap' },
]

// Sidebar Component
function Sidebar({ isOpen, onClose }) {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">IS</div>
                    <span className="sidebar-logo-text">Involve Space</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <div className="nav-section-title">Dashboard</div>
                    {navItems.slice(0, 1).map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="nav-item-icon">{Icons[item.icon]()}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </div>
                <div className="nav-section">
                    <div className="nav-section-title">Departments</div>
                    {navItems.slice(1, 7).map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="nav-item-icon">{Icons[item.icon]()}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </div>
                <div className="nav-section">
                    <div className="nav-section-title">Strategic</div>
                    {navItems.slice(7).map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="nav-item-icon">{Icons[item.icon]()}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </aside>
    )
}

// Header Component
function Header({ onMenuClick }) {
    const location = useLocation()
    const { theme, setTheme, role, setRole } = useContext(AppContext)

    const getPageTitle = () => {
        const item = navItems.find(item => item.path === location.pathname)
        return item ? item.label : 'Dashboard'
    }

    return (
        <header className="header">
            <div className="header-left">
                <button className="btn btn-icon btn-ghost mobile-menu-btn" onClick={onMenuClick}>
                    <span className="nav-item-icon">{Icons.Menu()}</span>
                </button>
                <h1 className="header-title">{getPageTitle()}</h1>
            </div>
            <div className="header-right">
                <div className="role-selector">
                    {['viewer', 'editor', 'admin'].map(r => (
                        <button
                            key={r}
                            className={`role-option ${role === r ? 'active' : ''}`}
                            onClick={() => setRole(r)}
                        >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>
                <button
                    className="theme-toggle"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label="Toggle theme"
                />
            </div>
        </header>
    )
}

// Main App Component
function App() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('involve-theme')
        return saved || 'dark'
    })
    const [role, setRole] = useState(() => {
        const saved = localStorage.getItem('involve-role')
        return saved || 'editor'
    })
    const [year, setYear] = useState(2026)
    const [quarter, setQuarter] = useState(1)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('involve-theme', theme)
    }, [theme])

    useEffect(() => {
        localStorage.setItem('involve-role', role)
    }, [role])

    const contextValue = {
        theme,
        setTheme,
        role,
        setRole,
        year,
        setYear,
        quarter,
        setQuarter,
        canEdit: role === 'editor' || role === 'admin',
        isAdmin: role === 'admin',
    }

    return (
        <AppContext.Provider value={contextValue}>
            <BrowserRouter>
                <div className="app-layout">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <main className="main-content">
                        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                        <div className="page-container">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/finance" element={<Finance />} />
                                <Route path="/operations" element={<Operations />} />
                                <Route path="/technology" element={<Technology />} />
                                <Route path="/sales" element={<Sales />} />
                                <Route path="/projects" element={<Projects />} />
                                <Route path="/people" element={<People />} />
                                <Route path="/roadmap" element={<Roadmap />} />
                            </Routes>
                        </div>
                    </main>
                </div>
            </BrowserRouter>
        </AppContext.Provider>
    )
}

export default App

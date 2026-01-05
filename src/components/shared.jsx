// Shared UI Components for Involve Space Dashboard
import { useContext, useState } from 'react'
import { AppContext } from '../App'
import { formatCurrency, formatNumber, formatPercent, formatDelta, calculateDelta, calculateProgress, getStatusColor } from '../utils/formatters'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts'

// KPI Tile Component
export function KPITile({ label, value, target, unit, previousValue, icon, trend }) {
    const delta = calculateDelta(value, previousValue)
    const progress = target ? calculateProgress(value, target) : null

    const formatValue = (val) => {
        if (unit === '€' || unit === '€/month') return formatCurrency(val)
        if (unit === '%') return formatPercent(val)
        if (unit === 'months' || unit === 'hrs') return `${val} ${unit}`
        return formatNumber(val)
    }

    return (
        <div className="kpi-tile">
            <div className="kpi-header">
                <span className="kpi-label">{label}</span>
                {icon && <div className={`kpi-icon ${icon}`}>{getIconForKPI(label)}</div>}
            </div>
            <div className="kpi-value">{formatValue(value)}</div>
            <div className="kpi-footer">
                {previousValue && (
                    <span className={`kpi-delta ${delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral'}`}>
                        {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} {formatDelta(Math.abs(delta))}
                    </span>
                )}
                {target && (
                    <span className="kpi-comparison">
                        Target: {formatValue(target)}
                    </span>
                )}
            </div>
            {progress !== null && (
                <div className="progress-bar" style={{ marginTop: '8px' }}>
                    <div
                        className="progress-fill brand"
                        style={{ width: `${Math.min(100, progress)}%` }}
                    />
                </div>
            )}
        </div>
    )
}

function getIconForKPI(label) {
    const icons = {
        'Revenue': '💰',
        'Runway': '⏱️',
        'Contracts': '📄',
        'Customers': '👥',
        'Launches': '🚀',
        'Projects': '📁',
        'Technologies': '⚙️',
        'Team': '👨‍💼',
    }
    for (const [key, icon] of Object.entries(icons)) {
        if (label.toLowerCase().includes(key.toLowerCase())) return icon
    }
    return '📊'
}

// Progress Bar Component
export function ProgressBar({ label, value, target, variant = 'brand', showLabel = true }) {
    const progress = calculateProgress(value, target)

    return (
        <div className="progress-container">
            {showLabel && (
                <div className="progress-header">
                    <span className="progress-label">{label}</span>
                    <span className="progress-value">{Math.round(progress)}%</span>
                </div>
            )}
            <div className="progress-bar">
                <div
                    className={`progress-fill ${variant}`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                />
            </div>
        </div>
    )
}

// Status Badge Component
export function StatusBadge({ status }) {
    const colorClass = getStatusColor(status)
    return (
        <span className={`badge badge-${colorClass}`}>
            <span className={`status-dot ${colorClass === 'success' ? 'active' : colorClass === 'warning' ? 'pending' : colorClass === 'error' ? 'error' : 'inactive'}`} />
            {status.replace('-', ' ')}
        </span>
    )
}

// TRL Badge Component
export function TRLBadge({ level, showLabel = true }) {
    const getColor = (trl) => {
        if (trl >= 7) return 'success'
        if (trl >= 4) return 'warning'
        return 'info'
    }

    return (
        <span className={`badge badge-${getColor(level)}`}>
            TRL {level}
            {showLabel && <span style={{ opacity: 0.7, marginLeft: '4px' }}>/ 9</span>}
        </span>
    )
}

// Trend Chart Component (Mini Sparkline)
export function TrendChart({ data, height = 60, color = '#6366f1' }) {
    const chartData = data.map((value, index) => ({ value, index }))

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke={color} fill="url(#colorValue)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

// Line Chart Component
export function LineChartComponent({ data, lines, height = 300, xKey = 'month' }) {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6']

    return (
        <div className="chart-container" style={{ height }}>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey={xKey} stroke="var(--color-text-tertiary)" fontSize={12} />
                    <YAxis stroke="var(--color-text-tertiary)" fontSize={12} tickFormatter={formatNumber} />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px'
                        }}
                        formatter={(value) => formatCurrency(value)}
                    />
                    <Legend />
                    {lines.map((line, index) => (
                        <Line
                            key={line}
                            type="monotone"
                            dataKey={line}
                            stroke={colors[index % colors.length]}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

// Bar Chart Component
export function BarChartComponent({ data, bars, height = 300, xKey = 'category' }) {
    const colors = ['#6366f1', '#10b981', '#f59e0b']

    return (
        <div className="chart-container" style={{ height }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey={xKey} stroke="var(--color-text-tertiary)" fontSize={12} />
                    <YAxis stroke="var(--color-text-tertiary)" fontSize={12} tickFormatter={formatNumber} />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px'
                        }}
                        formatter={(value) => formatCurrency(value)}
                    />
                    <Legend />
                    {bars.map((bar, index) => (
                        <Bar key={bar} dataKey={bar} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

// Data Table Component
export function DataTable({ columns, data, onRowClick }) {
    const [sortKey, setSortKey] = useState(null)
    const [sortAsc, setSortAsc] = useState(true)

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortAsc(!sortAsc)
        } else {
            setSortKey(key)
            setSortAsc(true)
        }
    }

    const sortedData = sortKey
        ? [...data].sort((a, b) => {
            const aVal = a[sortKey]
            const bVal = b[sortKey]
            const comparison = typeof aVal === 'string'
                ? aVal.localeCompare(bVal)
                : aVal - bVal
            return sortAsc ? comparison : -comparison
        })
        : data

    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                onClick={() => col.sortable && handleSort(col.key)}
                                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                            >
                                {col.label}
                                {sortKey === col.key && (sortAsc ? ' ↑' : ' ↓')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, index) => (
                        <tr
                            key={row.id || index}
                            onClick={() => onRowClick && onRowClick(row)}
                            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                        >
                            {columns.map(col => (
                                <td key={col.key}>
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// Modal Component
export function Modal({ isOpen, onClose, title, children, footer }) {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    )
}

// Year/Quarter Selector
export function PeriodSelector() {
    const { year, setYear, quarter, setQuarter } = useContext(AppContext)
    const years = [2024, 2025, 2026]
    const quarters = [1, 2, 3, 4]

    return (
        <div className="period-selector">
            <div className="flex gap-2">
                {years.map(y => (
                    <button
                        key={y}
                        className={`period-btn ${year === y ? 'active' : ''}`}
                        onClick={() => setYear(y)}
                    >
                        {y}
                    </button>
                ))}
            </div>
            <div className="flex gap-2">
                {quarters.map(q => (
                    <button
                        key={q}
                        className={`period-btn ${quarter === q ? 'active' : ''}`}
                        onClick={() => setQuarter(q)}
                    >
                        Q{q}
                    </button>
                ))}
            </div>
        </div>
    )
}

// Empty State Component
export function EmptyState({ icon = '📭', title, description, action }) {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">{icon}</div>
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-description">{description}</p>}
            {action}
        </div>
    )
}

// Card Component
export function Card({ title, subtitle, children, actions, className = '' }) {
    return (
        <div className={`card ${className}`}>
            {(title || actions) && (
                <div className="card-header">
                    <div>
                        {title && <h3 className="card-title">{title}</h3>}
                        {subtitle && <p className="card-subtitle">{subtitle}</p>}
                    </div>
                    {actions && <div className="flex gap-2">{actions}</div>}
                </div>
            )}
            {children}
        </div>
    )
}

// Timeline Component
export function Timeline({ items }) {
    return (
        <div className="timeline">
            {items.map((item, index) => (
                <div key={item.id || index} className="timeline-item">
                    <div className={`timeline-marker ${item.status}`} />
                    <div className="timeline-content">
                        <div className="timeline-date">{item.date}</div>
                        <div className="timeline-title">{item.title}</div>
                        {item.description && (
                            <div className="timeline-description">{item.description}</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

// Loading Spinner
export function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center" style={{ padding: '40px' }}>
            <div style={{
                width: 40,
                height: 40,
                border: '3px solid var(--color-border)',
                borderTopColor: 'var(--color-brand-primary)',
                borderRadius: '50%'
            }} className="animate-spin" />
        </div>
    )
}

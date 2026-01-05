// People / Team Dashboard
import { useState, useEffect, useContext } from 'react'
import { KPITile, Card, DataTable, StatusBadge, ProgressBar, BarChartComponent } from '../components/shared'
import { getData, getKPIsByDepartment, getPeopleByDepartment, getOpenPositions } from '../data/dataService'
import { formatDate } from '../utils/formatters'
import { AppContext } from '../App'

export default function People() {
    const [data, setData] = useState(null)
    const { canEdit } = useContext(AppContext)

    useEffect(() => {
        setData(getData())
    }, [])

    if (!data) return null

    const kpis = getKPIsByDepartment('people')
    const teamSizeKPI = kpis.find(k => k.name === 'Team Size') || { value: 28, target: 35, previousValue: 24 }
    const openPosKPI = kpis.find(k => k.name === 'Open Positions') || { value: 4, target: 7, previousValue: 3 }
    const retentionKPI = kpis.find(k => k.name === 'Retention Rate') || { value: 94, target: 95, previousValue: 92 }

    const people = data.people || []
    const activePeople = people.filter(p => p.status === 'active')
    const openPositions = people.filter(p => p.status === 'open-position')

    // Group by department
    const departments = {}
    activePeople.forEach(p => {
        if (!departments[p.department]) departments[p.department] = []
        departments[p.department].push(p)
    })

    // Department chart data
    const deptChartData = Object.entries(departments).map(([dept, members]) => ({
        department: dept.charAt(0).toUpperCase() + dept.slice(1),
        count: members.length
    })).sort((a, b) => b.count - a.count)

    // Team growth data
    const growthData = [
        { quarter: 'Q1 2024', headcount: 18 },
        { quarter: 'Q2 2024', headcount: 20 },
        { quarter: 'Q3 2024', headcount: 22 },
        { quarter: 'Q4 2024', headcount: 24 },
        { quarter: 'Q1 2025', headcount: 26 },
        { quarter: 'Q2 2025', headcount: 27 },
        { quarter: 'Q3 2025', headcount: 27 },
        { quarter: 'Q4 2025', headcount: 28 },
    ]

    // Key hires planned
    const keyHires = [
        { role: 'VP Engineering', department: 'technology', priority: 'high', targetDate: '2026-Q1' },
        { role: 'Senior ML Engineer', department: 'technology', priority: 'high', targetDate: '2026-Q1' },
        { role: 'Flight Test Engineer', department: 'operations', priority: 'medium', targetDate: '2026-Q2' },
        { role: 'Sales Engineer', department: 'sales', priority: 'medium', targetDate: '2026-Q2' },
        { role: 'DevOps Engineer', department: 'technology', priority: 'medium', targetDate: '2026-Q3' },
    ]

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold" style={{ marginBottom: '4px' }}>People Dashboard</h2>
                    <p className="text-secondary">Team composition, growth, and hiring</p>
                </div>
                {canEdit && (
                    <button className="btn btn-primary">+ Add Position</button>
                )}
            </div>

            {/* KPIs */}
            <div className="kpi-grid mb-6">
                <KPITile
                    label="Team Size"
                    value={teamSizeKPI.value}
                    target={teamSizeKPI.target}
                    previousValue={teamSizeKPI.previousValue}
                    icon="brand"
                />
                <KPITile
                    label="Open Positions"
                    value={openPosKPI.value}
                    target={openPosKPI.target}
                    previousValue={openPosKPI.previousValue}
                    icon="warning"
                />
                <KPITile
                    label="Retention Rate"
                    value={retentionKPI.value}
                    target={retentionKPI.target}
                    unit="%"
                    previousValue={retentionKPI.previousValue}
                    icon="success"
                />
                <KPITile
                    label="Growth vs Plan"
                    value={Math.round((teamSizeKPI.value / teamSizeKPI.target) * 100)}
                    target={100}
                    unit="%"
                    icon="info"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Card title="Team by Department" subtitle="Current headcount distribution">
                    <BarChartComponent
                        data={deptChartData}
                        bars={['count']}
                        xKey="department"
                        height={280}
                    />
                </Card>

                <Card title="Team Growth" subtitle="Quarterly headcount trend">
                    <BarChartComponent
                        data={growthData}
                        bars={['headcount']}
                        xKey="quarter"
                        height={280}
                    />
                </Card>
            </div>

            {/* Department Breakdown */}
            <Card title="Team by Department" subtitle="All team members" className="mb-6">
                <div className="grid grid-cols-3 gap-4" style={{ marginTop: '16px' }}>
                    {Object.entries(departments).map(([dept, members]) => (
                        <div key={dept} className="card" style={{ padding: '16px' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                                <div className="font-semibold" style={{ textTransform: 'capitalize' }}>{dept}</div>
                                <span className="badge badge-brand">{members.length}</span>
                            </div>
                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {members.map(person => (
                                    <div key={person.id} className="flex justify-between text-sm" style={{ padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                                        <span>{person.name}</span>
                                        <span className="text-tertiary">{person.role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Open Positions */}
            <div className="grid grid-cols-2 gap-4">
                <Card title="Open Positions" subtitle="Active job openings">
                    <DataTable
                        columns={[
                            { key: 'role', label: 'Position', sortable: true },
                            { key: 'department', label: 'Department', sortable: true, render: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
                            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
                        ]}
                        data={openPositions}
                    />
                </Card>

                <Card title="Key Hires Planned" subtitle="Strategic hiring priorities">
                    <DataTable
                        columns={[
                            { key: 'role', label: 'Role', sortable: true },
                            { key: 'department', label: 'Department', sortable: true, render: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
                            { key: 'targetDate', label: 'Target', sortable: true },
                            {
                                key: 'priority', label: 'Priority', render: (v) => (
                                    <span className={`badge badge-${v === 'high' ? 'error' : v === 'medium' ? 'warning' : 'info'}`}>
                                        {v}
                                    </span>
                                )
                            },
                        ]}
                        data={keyHires}
                    />
                </Card>
            </div>
        </div>
    )
}

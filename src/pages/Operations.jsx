// Operations / Flight Dashboard
import { useState, useEffect, useContext } from 'react'
import { KPITile, Card, DataTable, StatusBadge, ProgressBar, Timeline } from '../components/shared'
import { getData, getKPIsByDepartment, getUpcomingLaunches, getCompletedLaunches } from '../data/dataService'
import { formatDate, formatNumber } from '../utils/formatters'
import { AppContext } from '../App'

export default function Operations() {
    const [data, setData] = useState(null)
    const { canEdit } = useContext(AppContext)

    useEffect(() => {
        setData(getData())
    }, [])

    if (!data) return null

    const kpis = getKPIsByDepartment('operations')
    const launchesKPI = kpis.find(k => k.name === 'Launches YTD')
    const lifetimeKPI = kpis.find(k => k.name === 'Lifetime Launches')
    const successRateKPI = kpis.find(k => k.name === 'Launch Success Rate')
    const flightHoursKPI = kpis.find(k => k.name === 'Total Flight Hours')
    const availabilityKPI = kpis.find(k => k.name === 'Platform Availability')

    const upcomingLaunches = getUpcomingLaunches()
    const completedLaunches = getCompletedLaunches()

    // Platform usage stats
    const platformStats = [
        { platform: 'Stratosat', launches: 10, hours: 628, availability: 94 },
        { platform: 'Stratosat V1.5', launches: 5, hours: 320, availability: 91 },
        { platform: 'Stratorelay', launches: 3, hours: 299, availability: 88 },
        { platform: 'Stratosat V2', launches: 0, hours: 0, availability: 100 },
    ]

    // Timeline for upcoming launches
    const launchTimeline = upcomingLaunches.map(l => ({
        id: l.id,
        title: l.name,
        date: formatDate(l.plannedDate),
        description: `${l.platform} platform`,
        status: 'upcoming'
    }))

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold" style={{ marginBottom: '4px' }}>Operations Dashboard</h2>
                    <p className="text-secondary">Flight operations, launches, and platform metrics</p>
                </div>
                {canEdit && (
                    <button className="btn btn-primary">+ Schedule Launch</button>
                )}
            </div>

            {/* KPIs */}
            <div className="kpi-grid mb-6">
                {launchesKPI && (
                    <KPITile
                        label="Launches YTD"
                        value={launchesKPI.value}
                        target={launchesKPI.target}
                        previousValue={launchesKPI.previousValue}
                        icon="brand"
                    />
                )}
                {lifetimeKPI && (
                    <KPITile
                        label="Lifetime Launches"
                        value={lifetimeKPI.value}
                        target={lifetimeKPI.target}
                        previousValue={lifetimeKPI.previousValue}
                        icon="success"
                    />
                )}
                {successRateKPI && (
                    <KPITile
                        label="Success Rate"
                        value={successRateKPI.value}
                        target={successRateKPI.target}
                        unit={successRateKPI.unit}
                        previousValue={successRateKPI.previousValue}
                        icon="success"
                    />
                )}
                {flightHoursKPI && (
                    <KPITile
                        label="Total Flight Hours"
                        value={flightHoursKPI.value}
                        target={flightHoursKPI.target}
                        unit={flightHoursKPI.unit}
                        previousValue={flightHoursKPI.previousValue}
                        icon="info"
                    />
                )}
            </div>

            {/* Platform Stats */}
            <Card title="Platform Utilization" subtitle="Fleet performance by platform" className="mb-6">
                <div className="grid grid-cols-4 gap-4" style={{ marginTop: '16px' }}>
                    {platformStats.map(p => (
                        <div key={p.platform} className="card" style={{ padding: '16px', textAlign: 'center' }}>
                            <div className="font-semibold" style={{ marginBottom: '8px' }}>{p.platform}</div>
                            <div className="text-secondary text-sm" style={{ marginBottom: '12px' }}>
                                {p.launches} launches • {p.hours} hrs
                            </div>
                            <ProgressBar
                                label="Availability"
                                value={p.availability}
                                target={100}
                                variant={p.availability >= 90 ? 'success' : 'warning'}
                            />
                        </div>
                    ))}
                </div>
            </Card>

            {/* Launches Tables */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Card title="Upcoming Launches" subtitle="Scheduled missions">
                    {upcomingLaunches.length > 0 ? (
                        <DataTable
                            columns={[
                                { key: 'name', label: 'Mission', sortable: true },
                                { key: 'platform', label: 'Platform', sortable: true },
                                { key: 'plannedDate', label: 'Date', sortable: true, render: (v) => formatDate(v) },
                                { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
                            ]}
                            data={upcomingLaunches}
                        />
                    ) : (
                        <div className="empty-state" style={{ padding: '32px' }}>
                            <div className="empty-state-icon">🚀</div>
                            <p className="text-secondary">No upcoming launches scheduled</p>
                        </div>
                    )}
                </Card>

                <Card title="Launch Timeline" subtitle="Mission schedule">
                    {launchTimeline.length > 0 ? (
                        <Timeline items={launchTimeline} />
                    ) : (
                        <div className="empty-state" style={{ padding: '32px' }}>
                            <p className="text-secondary">No launches in timeline</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Completed Launches */}
            <Card title="Completed Launches" subtitle="Historical mission data">
                <DataTable
                    columns={[
                        { key: 'name', label: 'Mission', sortable: true },
                        { key: 'platform', label: 'Platform', sortable: true },
                        { key: 'executedDate', label: 'Date', sortable: true, render: (v) => formatDate(v) },
                        { key: 'flightHours', label: 'Flight Hours', sortable: true, render: (v) => `${v} hrs` },
                        {
                            key: 'success', label: 'Result', render: (v) => (
                                <span className={`badge badge-${v ? 'success' : 'error'}`}>
                                    {v ? 'Success' : 'Failed'}
                                </span>
                            )
                        },
                    ]}
                    data={completedLaunches.slice(0, 8)}
                />
            </Card>
        </div>
    )
}

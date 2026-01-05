// Global Overview Dashboard - Main Landing Page
import { useState, useEffect, useContext } from 'react'
import { KPITile, Card, LineChartComponent, BarChartComponent, ProgressBar, StatusBadge, PeriodSelector, DataTable, Timeline } from '../components/shared'
import { getData, getActiveProjects, getUpcomingLaunches } from '../data/dataService'
import { formatCurrency, formatDate, formatRelativeDate } from '../utils/formatters'
import { AppContext } from '../App'

export default function Dashboard() {
    const [data, setData] = useState(null)
    const { year, quarter } = useContext(AppContext)

    useEffect(() => {
        setData(getData())
    }, [year, quarter]) // Re-fetch when period changes

    if (!data) return null

    const kpis = data.kpis
    const revenueKPI = kpis.find(k => k.name === 'Total Revenue YTD')
    const runwayKPI = kpis.find(k => k.name === 'Cash Runway')
    const contractsKPI = kpis.find(k => k.name === 'Active Contracts')
    const customersKPI = kpis.find(k => k.name === 'Active Customers')
    const launchesKPI = kpis.find(k => k.name === 'Launches YTD')
    const projectsKPI = kpis.find(k => k.name === 'Active Projects')
    const techKPI = kpis.find(k => k.name === 'Technologies Completed')
    const teamKPI = kpis.find(k => k.name === 'Team Size')

    const upcomingLaunches = getUpcomingLaunches().slice(0, 4)
    const activeProjects = getActiveProjects().slice(0, 5)

    // Revenue chart data - filter by quarter if not current year
    const allRevenueData = data.financialData.revenueByMonth
    const monthsInQuarter = {
        1: ['Jan', 'Feb', 'Mar'],
        2: ['Apr', 'May', 'Jun'],
        3: ['Jul', 'Aug', 'Sep'],
        4: ['Oct', 'Nov', 'Dec']
    }

    // Filter revenue data by selected quarter
    const filteredRevenueData = allRevenueData.filter(m =>
        monthsInQuarter[quarter].includes(m.month)
    )

    const revenueChartData = filteredRevenueData.map(m => ({
        month: m.month,
        total: m.contracts + m.grants + m.services,
        contracts: m.contracts,
        grants: m.grants,
        services: m.services
    }))

    // Project progress data
    const projectProgress = activeProjects.map(p => ({
        name: p.name.length > 20 ? p.name.substring(0, 17) + '...' : p.name,
        progress: p.budget ? Math.round((p.spent / p.budget) * 100) : 0,
        budget: p.budget || 0,
        spent: p.spent || 0
    }))

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold" style={{ marginBottom: '4px' }}>Company Overview</h2>
                    <p className="text-secondary">
                        Showing data for <strong>Q{quarter} {year}</strong>
                    </p>
                </div>
                <PeriodSelector />
            </div>

            {/* Primary KPIs */}
            <div className="kpi-grid mb-6">
                {revenueKPI && (
                    <KPITile
                        label={revenueKPI.name}
                        value={revenueKPI.value}
                        target={revenueKPI.target}
                        unit={revenueKPI.unit}
                        previousValue={revenueKPI.previousValue}
                        icon="brand"
                    />
                )}
                {runwayKPI && (
                    <KPITile
                        label={runwayKPI.name}
                        value={runwayKPI.value}
                        target={runwayKPI.target}
                        unit={runwayKPI.unit}
                        previousValue={runwayKPI.previousValue}
                        icon="warning"
                    />
                )}
                {contractsKPI && (
                    <KPITile
                        label={contractsKPI.name}
                        value={contractsKPI.value}
                        target={contractsKPI.target}
                        previousValue={contractsKPI.previousValue}
                        icon="success"
                    />
                )}
                {customersKPI && (
                    <KPITile
                        label={customersKPI.name}
                        value={customersKPI.value}
                        target={customersKPI.target}
                        previousValue={customersKPI.previousValue}
                        icon="info"
                    />
                )}
            </div>

            {/* Secondary KPIs */}
            <div className="kpi-grid mb-6">
                {launchesKPI && (
                    <KPITile
                        label="Launches (YTD / Lifetime)"
                        value={`${launchesKPI.value} / ${kpis.find(k => k.name === 'Lifetime Launches')?.value || 23}`}
                        target={launchesKPI.target}
                        previousValue={launchesKPI.previousValue}
                        icon="brand"
                    />
                )}
                {projectsKPI && (
                    <KPITile
                        label={projectsKPI.name}
                        value={projectsKPI.value}
                        target={projectsKPI.target}
                        previousValue={projectsKPI.previousValue}
                        icon="info"
                    />
                )}
                {techKPI && (
                    <KPITile
                        label="Technologies (Done / In Dev)"
                        value={`${techKPI.value} / ${kpis.find(k => k.name === 'Technologies In Development')?.value || 5}`}
                        target={techKPI.target}
                        previousValue={techKPI.previousValue}
                        icon="success"
                    />
                )}
                {teamKPI && (
                    <KPITile
                        label={teamKPI.name}
                        value={teamKPI.value}
                        target={teamKPI.target}
                        previousValue={teamKPI.previousValue}
                        icon="info"
                    />
                )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Card title="Revenue Trend" subtitle="Monthly breakdown by source">
                    <LineChartComponent
                        data={revenueChartData}
                        lines={['contracts', 'grants', 'services']}
                        height={280}
                    />
                </Card>

                <Card title="Project Budget Usage" subtitle="Active projects spend vs budget">
                    <BarChartComponent
                        data={projectProgress}
                        bars={['spent', 'budget']}
                        xKey="name"
                        height={280}
                    />
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 gap-4">
                <Card title="Upcoming Launches" subtitle="Next scheduled missions">
                    <DataTable
                        columns={[
                            { key: 'name', label: 'Mission', sortable: true },
                            { key: 'platform', label: 'Platform', sortable: true },
                            { key: 'plannedDate', label: 'Date', sortable: true, render: (v) => formatDate(v) },
                            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
                        ]}
                        data={upcomingLaunches}
                    />
                </Card>

                <Card title="Active Projects" subtitle="Current initiatives">
                    <DataTable
                        columns={[
                            { key: 'name', label: 'Project', sortable: true },
                            { key: 'type', label: 'Type', sortable: true },
                            { key: 'owner', label: 'Owner', sortable: true },
                            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
                        ]}
                        data={activeProjects}
                    />
                </Card>
            </div>
        </div>
    )
}

// Finance Dashboard
import { useState, useEffect, useContext } from 'react'
import { KPITile, Card, LineChartComponent, BarChartComponent, ProgressBar, DataTable, Modal } from '../components/shared'
import { CRUDModal } from '../components/CRUDModal'
import { getData, getKPIsByDepartment, getActiveContracts } from '../data/dataService'
import { formatCurrency, formatDate } from '../utils/formatters'
import { AppContext } from '../App'

export default function Finance() {
    const [data, setData] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const { canEdit } = useContext(AppContext)

    const refreshData = () => setData(getData())

    useEffect(() => {
        refreshData()
    }, [])

    if (!data) return null

    const kpis = getKPIsByDepartment('finance')
    const revenueKPI = kpis.find(k => k.name === 'Total Revenue YTD')
    const runwayKPI = kpis.find(k => k.name === 'Cash Runway')
    const burnRateKPI = kpis.find(k => k.name === 'Burn Rate')
    const grantKPI = kpis.find(k => k.name === 'Grant Revenue')
    const serviceKPI = kpis.find(k => k.name === 'Service Revenue')
    const budgetKPI = kpis.find(k => k.name === 'Budget Utilization')

    const revenueData = data.financialData.revenueByMonth
    const budgetData = data.financialData.budgetVsActual

    // Funding milestones
    const fundingMilestones = [
        { id: 1, name: 'Seed Round', amount: 1500000, date: '2020-06', status: 'completed' },
        { id: 2, name: 'Pre-Series A', amount: 3000000, date: '2022-03', status: 'completed' },
        { id: 3, name: 'Series A', amount: 8000000, date: '2025-09', status: 'completed' },
        { id: 4, name: 'Series B', amount: 25000000, date: '2027-Q2', status: 'planned' },
    ]

    // Runway projection
    const runwayProjection = [
        { month: 'Jan', cash: 3240000 },
        { month: 'Feb', cash: 3100000 },
        { month: 'Mar', cash: 2950000 },
        { month: 'Apr', cash: 2800000 },
        { month: 'May', cash: 2650000 },
        { month: 'Jun', cash: 2500000 },
        { month: 'Jul', cash: 2350000 },
        { month: 'Aug', cash: 2200000 },
        { month: 'Sep', cash: 2050000 },
        { month: 'Oct', cash: 1900000 },
        { month: 'Nov', cash: 1750000 },
        { month: 'Dec', cash: 1600000 },
    ]

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold" style={{ marginBottom: '4px' }}>Finance Dashboard</h2>
                    <p className="text-secondary">Revenue, burn rate, and financial runway metrics</p>
                </div>
                {canEdit && (
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        + Add KPI
                    </button>
                )}
            </div>

            {/* KPIs */}
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
                {burnRateKPI && (
                    <KPITile
                        label={burnRateKPI.name}
                        value={burnRateKPI.value}
                        target={burnRateKPI.target}
                        unit={burnRateKPI.unit}
                        previousValue={burnRateKPI.previousValue}
                        icon="warning"
                    />
                )}
                {budgetKPI && (
                    <KPITile
                        label={budgetKPI.name}
                        value={budgetKPI.value}
                        target={budgetKPI.target}
                        unit={budgetKPI.unit}
                        previousValue={budgetKPI.previousValue}
                        icon="success"
                    />
                )}
            </div>

            {/* Revenue Breakdown */}
            <div className="kpi-grid mb-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <Card title="Contract Revenue" className="text-center">
                    <div className="kpi-value" style={{ fontSize: '2rem', marginTop: '16px' }}>
                        {formatCurrency(revenueData.reduce((sum, m) => sum + m.contracts, 0))}
                    </div>
                    <ProgressBar label="" value={3445000} target={4000000} variant="brand" />
                </Card>
                {grantKPI && (
                    <Card title="Grant Revenue" className="text-center">
                        <div className="kpi-value" style={{ fontSize: '2rem', marginTop: '16px' }}>
                            {formatCurrency(grantKPI.value)}
                        </div>
                        <ProgressBar label="" value={grantKPI.value} target={grantKPI.target} variant="success" />
                    </Card>
                )}
                {serviceKPI && (
                    <Card title="Service Revenue" className="text-center">
                        <div className="kpi-value" style={{ fontSize: '2rem', marginTop: '16px' }}>
                            {formatCurrency(serviceKPI.value)}
                        </div>
                        <ProgressBar label="" value={serviceKPI.value} target={serviceKPI.target} variant="info" />
                    </Card>
                )}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Card title="Revenue by Source" subtitle="Monthly breakdown">
                    <LineChartComponent
                        data={revenueData.map(m => ({ ...m, total: m.contracts + m.grants + m.services }))}
                        lines={['contracts', 'grants', 'services']}
                        height={280}
                    />
                </Card>

                <Card title="Budget vs Actual" subtitle="Department spending">
                    <BarChartComponent
                        data={budgetData}
                        bars={['budget', 'actual']}
                        xKey="category"
                        height={280}
                    />
                </Card>
            </div>

            {/* Runway & Funding */}
            <div className="grid grid-cols-2 gap-4">
                <Card title="Cash Runway Projection" subtitle="12-month forecast">
                    <LineChartComponent
                        data={runwayProjection}
                        lines={['cash']}
                        height={250}
                    />
                </Card>

                <Card title="Funding Milestones" subtitle="Capital raises">
                    <DataTable
                        columns={[
                            { key: 'name', label: 'Round', sortable: true },
                            { key: 'amount', label: 'Amount', sortable: true, render: (v) => formatCurrency(v) },
                            { key: 'date', label: 'Date', sortable: true },
                            {
                                key: 'status', label: 'Status', render: (v) => (
                                    <span className={`badge badge-${v === 'completed' ? 'success' : 'info'}`}>{v}</span>
                                )
                            },
                        ]}
                        data={fundingMilestones}
                    />
                </Card>
            </div>

            {/* CRUD Modal */}
            <CRUDModal
                isOpen={showAddModal || !!editItem}
                onClose={() => { setShowAddModal(false); setEditItem(null); }}
                entityType="kpi"
                editItem={editItem}
                onSave={refreshData}
                onDelete={refreshData}
            />
        </div>
    )
}


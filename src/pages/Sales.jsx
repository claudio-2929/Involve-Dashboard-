// Sales & Partnerships Dashboard
import { useState, useEffect, useContext } from 'react'
import { KPITile, Card, DataTable, StatusBadge, ProgressBar, BarChartComponent } from '../components/shared'
import { CRUDModal } from '../components/CRUDModal'
import { getData, getKPIsByDepartment, getActiveContracts, getContractsByType } from '../data/dataService'
import { formatCurrency, formatDate } from '../utils/formatters'
import { AppContext } from '../App'

export default function Sales() {
    const [data, setData] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const { canEdit } = useContext(AppContext)

    const refreshData = () => setData(getData())

    useEffect(() => {
        refreshData()
    }, [])

    if (!data) return null

    const kpis = getKPIsByDepartment('sales')
    const contractsKPI = kpis.find(k => k.name === 'Active Contracts')
    const valueKPI = kpis.find(k => k.name === 'Total Contract Value')
    const customersKPI = kpis.find(k => k.name === 'Active Customers')
    const leadsKPI = kpis.find(k => k.name === 'Leads in Pipeline')
    const negotiationsKPI = kpis.find(k => k.name === 'Active Negotiations')
    const conversionKPI = kpis.find(k => k.name === 'Conversion Rate')

    const contracts = data.contracts || []
    const activeContracts = contracts.filter(c => c.status === 'active')
    const negotiations = contracts.filter(c => c.status === 'negotiation')

    // Contract value by type
    const contractsByType = [
        { type: 'Institutional', value: contracts.filter(c => c.type === 'institutional').reduce((s, c) => s + c.value, 0) },
        { type: 'B2G', value: contracts.filter(c => c.type === 'B2G').reduce((s, c) => s + c.value, 0) },
        { type: 'B2B', value: contracts.filter(c => c.type === 'B2B').reduce((s, c) => s + c.value, 0) },
        { type: 'Grants', value: contracts.filter(c => c.type === 'grant').reduce((s, c) => s + c.value, 0) },
    ]

    // Pipeline funnel
    const pipelineStages = [
        { stage: 'Leads', count: 18, value: 4500000 },
        { stage: 'Qualified', count: 12, value: 3200000 },
        { stage: 'Proposal', count: 7, value: 2100000 },
        { stage: 'Negotiation', count: 5, value: 1400000 },
        { stage: 'Closed Won', count: 3, value: 820000 },
    ]

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold" style={{ marginBottom: '4px' }}>Sales & Partnerships</h2>
                    <p className="text-secondary">Pipeline, contracts, and customer relationships</p>
                </div>
                {canEdit && (
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        + Add Contract
                    </button>
                )}
            </div>

            {/* KPIs */}
            <div className="kpi-grid mb-6">
                {leadsKPI && (
                    <KPITile
                        label="Leads in Pipeline"
                        value={leadsKPI.value}
                        target={leadsKPI.target}
                        previousValue={leadsKPI.previousValue}
                        icon="info"
                    />
                )}
                {negotiationsKPI && (
                    <KPITile
                        label="Active Negotiations"
                        value={negotiationsKPI.value}
                        target={negotiationsKPI.target}
                        previousValue={negotiationsKPI.previousValue}
                        icon="warning"
                    />
                )}
                {contractsKPI && (
                    <KPITile
                        label="Active Contracts"
                        value={contractsKPI.value}
                        target={contractsKPI.target}
                        previousValue={contractsKPI.previousValue}
                        icon="success"
                    />
                )}
                {valueKPI && (
                    <KPITile
                        label="Total Contract Value"
                        value={valueKPI.value}
                        target={valueKPI.target}
                        unit={valueKPI.unit}
                        previousValue={valueKPI.previousValue}
                        icon="brand"
                    />
                )}
            </div>

            {/* Pipeline Funnel & Contract Value */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Card title="Sales Pipeline" subtitle="Deal progression">
                    {pipelineStages.map((stage, index) => (
                        <div key={stage.stage} style={{ marginBottom: '12px' }}>
                            <div className="flex justify-between text-sm" style={{ marginBottom: '4px' }}>
                                <span>{stage.stage}</span>
                                <span>{stage.count} deals • {formatCurrency(stage.value)}</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill brand"
                                    style={{ width: `${(stage.count / pipelineStages[0].count) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {conversionKPI && (
                        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-tertiary)', borderRadius: '8px' }}>
                            <div className="flex justify-between">
                                <span className="text-secondary">Conversion Rate</span>
                                <span className="font-semibold">{conversionKPI.value}%</span>
                            </div>
                        </div>
                    )}
                </Card>

                <Card title="Revenue by Type" subtitle="Contract value breakdown">
                    <BarChartComponent
                        data={contractsByType}
                        bars={['value']}
                        xKey="type"
                        height={280}
                    />
                </Card>
            </div>

            {/* Active Contracts */}
            <Card title="Active Contracts" subtitle="Current engagements" className="mb-6">
                <DataTable
                    columns={[
                        { key: 'client', label: 'Client', sortable: true },
                        { key: 'type', label: 'Type', sortable: true },
                        { key: 'value', label: 'Value', sortable: true, render: (v) => formatCurrency(v) },
                        { key: 'endDate', label: 'End Date', sortable: true, render: (v) => formatDate(v) },
                        { key: 'contactPerson', label: 'Contact', sortable: true },
                        { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
                    ]}
                    data={activeContracts}
                    onRowClick={canEdit ? (row) => setEditItem(row) : undefined}
                />
            </Card>

            {/* Negotiations */}
            <Card title="Active Negotiations" subtitle="Deals in progress">
                <DataTable
                    columns={[
                        { key: 'client', label: 'Client', sortable: true },
                        { key: 'type', label: 'Type', sortable: true },
                        { key: 'value', label: 'Potential Value', sortable: true, render: (v) => formatCurrency(v) },
                        { key: 'startDate', label: 'Start Date', sortable: true, render: (v) => formatDate(v) },
                        { key: 'contactPerson', label: 'Contact', sortable: true },
                        { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
                    ]}
                    data={negotiations}
                    onRowClick={canEdit ? (row) => setEditItem(row) : undefined}
                />
            </Card>

            {/* CRUD Modal */}
            <CRUDModal
                isOpen={showAddModal || !!editItem}
                onClose={() => { setShowAddModal(false); setEditItem(null); }}
                entityType="contract"
                editItem={editItem}
                onSave={refreshData}
                onDelete={refreshData}
            />
        </div>
    )
}


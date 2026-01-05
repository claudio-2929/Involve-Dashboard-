// Technology / R&D Dashboard
import { useState, useEffect, useContext } from 'react'
import { KPITile, Card, DataTable, StatusBadge, TRLBadge, ProgressBar } from '../components/shared'
import { getData, getKPIsByDepartment, getTechnologiesByStatus } from '../data/dataService'
import { trlDescriptions } from '../data/schema'
import { AppContext } from '../App'

export default function Technology() {
    const [data, setData] = useState(null)
    const [selectedTech, setSelectedTech] = useState(null)
    const { canEdit } = useContext(AppContext)

    useEffect(() => {
        setData(getData())
    }, [])

    if (!data) return null

    const kpis = getKPIsByDepartment('technology')
    const completedKPI = kpis.find(k => k.name === 'Technologies Completed')
    const inDevKPI = kpis.find(k => k.name === 'Technologies In Development')
    const avgTrlKPI = kpis.find(k => k.name === 'Average TRL')

    const technologies = data.technologies || []
    const inDevelopment = technologies.filter(t => t.status === 'development' || t.status === 'testing')
    const completed = technologies.filter(t => t.status === 'completed')

    // Group by roadmap status
    const onTrack = technologies.filter(t => t.roadmapStatus === 'on-track').length
    const delayed = technologies.filter(t => t.roadmapStatus === 'delayed').length
    const accelerated = technologies.filter(t => t.roadmapStatus === 'accelerated').length

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold" style={{ marginBottom: '4px' }}>Technology Dashboard</h2>
                    <p className="text-secondary">R&D progress, TRL levels, and technology roadmap</p>
                </div>
                {canEdit && (
                    <button className="btn btn-primary">+ Add Technology</button>
                )}
            </div>

            {/* KPIs */}
            <div className="kpi-grid mb-6">
                {completedKPI && (
                    <KPITile
                        label="Technologies Completed"
                        value={completedKPI.value}
                        target={completedKPI.target}
                        previousValue={completedKPI.previousValue}
                        icon="success"
                    />
                )}
                {inDevKPI && (
                    <KPITile
                        label="In Development"
                        value={inDevKPI.value}
                        target={inDevKPI.target}
                        previousValue={inDevKPI.previousValue}
                        icon="info"
                    />
                )}
                {avgTrlKPI && (
                    <KPITile
                        label="Average TRL Level"
                        value={avgTrlKPI.value}
                        target={avgTrlKPI.target}
                        previousValue={avgTrlKPI.previousValue}
                        icon="brand"
                    />
                )}
                <div className="kpi-tile">
                    <div className="kpi-header">
                        <span className="kpi-label">Roadmap Status</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <span className="badge badge-success">{onTrack} On Track</span>
                        <span className="badge badge-warning">{delayed} Delayed</span>
                        <span className="badge badge-info">{accelerated} Accelerated</span>
                    </div>
                </div>
            </div>

            {/* Technology Grid */}
            <Card title="Technology Portfolio" subtitle="All technologies by TRL level" className="mb-6">
                <div className="grid grid-cols-3 gap-4" style={{ marginTop: '16px' }}>
                    {technologies.map(tech => (
                        <div
                            key={tech.id}
                            className="card"
                            style={{ padding: '16px', cursor: 'pointer' }}
                            onClick={() => setSelectedTech(tech)}
                        >
                            <div className="flex justify-between items-start" style={{ marginBottom: '12px' }}>
                                <div>
                                    <div className="font-semibold">{tech.name}</div>
                                    <div className="text-sm text-tertiary">{tech.category}</div>
                                </div>
                                <StatusBadge status={tech.roadmapStatus || tech.status} />
                            </div>

                            {/* TRL Progress */}
                            <div style={{ marginBottom: '8px' }}>
                                <div className="flex justify-between text-sm" style={{ marginBottom: '4px' }}>
                                    <span>TRL Progress</span>
                                    <span>{tech.trlLevel} / {tech.targetTrl || 9}</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className={`progress-fill ${tech.trlLevel >= 7 ? 'success' : tech.trlLevel >= 4 ? 'warning' : 'info'}`}
                                        style={{ width: `${(tech.trlLevel / (tech.targetTrl || 9)) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <TRLBadge level={tech.trlLevel} />

                            {tech.blockers && tech.blockers.length > 0 && (
                                <div style={{ marginTop: '8px' }}>
                                    <span className="badge badge-error">🚧 {tech.blockers.length} Blocker(s)</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Technology List Tables */}
            <div className="grid grid-cols-2 gap-4">
                <Card title="In Development" subtitle="Active R&D efforts">
                    <DataTable
                        columns={[
                            { key: 'name', label: 'Technology', sortable: true },
                            { key: 'category', label: 'Category', sortable: true },
                            { key: 'trlLevel', label: 'TRL', sortable: true, render: (v) => <TRLBadge level={v} showLabel={false} /> },
                            { key: 'roadmapStatus', label: 'Status', render: (v) => <StatusBadge status={v} /> },
                        ]}
                        data={inDevelopment}
                    />
                </Card>

                <Card title="Completed Technologies" subtitle="Mature technologies">
                    <DataTable
                        columns={[
                            { key: 'name', label: 'Technology', sortable: true },
                            { key: 'category', label: 'Category', sortable: true },
                            { key: 'trlLevel', label: 'TRL', sortable: true, render: (v) => <TRLBadge level={v} showLabel={false} /> },
                            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
                        ]}
                        data={completed}
                    />
                </Card>
            </div>

            {/* TRL Legend */}
            <Card title="TRL Reference" subtitle="Technology Readiness Level definitions" className="mt-6">
                <div className="grid grid-cols-3 gap-4" style={{ marginTop: '16px' }}>
                    {Object.entries(trlDescriptions).map(([level, desc]) => (
                        <div key={level} className="flex items-center gap-3" style={{ padding: '8px' }}>
                            <TRLBadge level={parseInt(level)} showLabel={false} />
                            <span className="text-sm text-secondary">{desc}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

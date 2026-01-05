// Roadmap & Strategic View
import { useState, useEffect, useContext } from 'react'
import { Card, StatusBadge, Modal } from '../components/shared'
import { getData } from '../data/dataService'
import { AppContext } from '../App'

export default function Roadmap() {
    const [data, setData] = useState(null)
    const [selectedItem, setSelectedItem] = useState(null)
    const { canEdit } = useContext(AppContext)

    useEffect(() => {
        setData(getData())
    }, [])

    if (!data) return null

    const roadmapItems = data.roadmapItems || []

    // Group by year
    const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030]
    const pillars = ['Platforms', 'Data', 'CLEAR', 'Market']

    const pillarColors = {
        'Platforms': '#6366f1',
        'Data': '#10b981',
        'CLEAR': '#f59e0b',
        'Market': '#ec4899',
    }

    const pillarDescriptions = {
        'Platforms': 'Stratospheric platform development and fleet operations',
        'Data': 'GeoAI, analytics, and data services',
        'CLEAR': 'Clean space and debris monitoring mission',
        'Market': 'Commercial growth and market expansion',
    }

    const getItemsByYearAndPillar = (year, pillar) => {
        return roadmapItems.filter(item => item.year === year && item.pillar === pillar)
    }

    const getStatusClass = (status) => {
        if (status === 'completed') return 'success'
        if (status === 'active') return 'warning'
        return 'info'
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold" style={{ marginBottom: '4px' }}>Strategic Roadmap</h2>
                    <p className="text-secondary">Multi-year vision and milestone tracking (2024-2030)</p>
                </div>
                {canEdit && (
                    <button className="btn btn-primary">+ Add Milestone</button>
                )}
            </div>

            {/* Pillar Legend */}
            <Card className="mb-6">
                <div className="grid grid-cols-4 gap-4">
                    {pillars.map(pillar => (
                        <div key={pillar} className="flex items-center gap-3">
                            <div
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '4px',
                                    background: pillarColors[pillar]
                                }}
                            />
                            <div>
                                <div className="font-medium">{pillar}</div>
                                <div className="text-xs text-tertiary">{pillarDescriptions[pillar]}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Status Legend */}
            <div className="flex gap-4 mb-6">
                <span className="badge badge-success">● Completed</span>
                <span className="badge badge-warning">● In Progress</span>
                <span className="badge badge-info">● Planned</span>
            </div>

            {/* Roadmap Timeline */}
            <div className="roadmap-container">
                <div className="roadmap-timeline">
                    {years.map(year => {
                        const yearItems = roadmapItems.filter(item => item.year === year)
                        const isCurrentYear = year === 2026

                        return (
                            <div key={year} className="roadmap-year">
                                <div
                                    className="roadmap-year-header"
                                    style={{
                                        borderColor: isCurrentYear ? 'var(--color-brand-primary)' : 'var(--color-border)',
                                        color: isCurrentYear ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)'
                                    }}
                                >
                                    {year}
                                    {isCurrentYear && <span className="badge badge-brand" style={{ marginLeft: '8px', fontSize: '10px' }}>Current</span>}
                                </div>

                                {pillars.map(pillar => {
                                    const items = getItemsByYearAndPillar(year, pillar)
                                    return items.map(item => (
                                        <div
                                            key={item.id}
                                            className="roadmap-milestone"
                                            style={{ borderLeftColor: pillarColors[pillar], borderLeftWidth: '3px' }}
                                            onClick={() => setSelectedItem(item)}
                                        >
                                            <div className="roadmap-milestone-title">{item.title}</div>
                                            <div className="roadmap-milestone-meta">
                                                <span style={{ color: pillarColors[pillar] }}>{pillar}</span>
                                                {item.quarter && <span> • Q{item.quarter}</span>}
                                            </div>
                                            <div style={{ marginTop: '4px' }}>
                                                <span className={`badge badge-${getStatusClass(item.status)}`} style={{ fontSize: '10px' }}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                })}

                                {yearItems.length === 0 && (
                                    <div className="text-sm text-tertiary" style={{ padding: '16px', opacity: 0.5 }}>
                                        No milestones
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Strategic Summary by Pillar */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                {pillars.map(pillar => {
                    const pillarItems = roadmapItems.filter(item => item.pillar === pillar)
                    const completed = pillarItems.filter(item => item.status === 'completed').length
                    const total = pillarItems.length

                    return (
                        <Card key={pillar}>
                            <div className="flex items-center gap-3" style={{ marginBottom: '12px' }}>
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        background: pillarColors[pillar],
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {pillar.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold">{pillar}</div>
                                    <div className="text-sm text-tertiary">{pillarDescriptions[pillar]}</div>
                                </div>
                            </div>

                            <div className="progress-bar" style={{ marginBottom: '8px' }}>
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${(completed / total) * 100}%`,
                                        background: pillarColors[pillar]
                                    }}
                                />
                            </div>
                            <div className="text-sm text-secondary">
                                {completed} of {total} milestones completed
                            </div>

                            <div style={{ marginTop: '12px' }}>
                                {pillarItems.slice(0, 3).map(item => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between text-sm"
                                        style={{ padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}
                                    >
                                        <span>{item.title}</span>
                                        <StatusBadge status={item.status} />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Milestone Detail Modal */}
            <Modal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                title={selectedItem?.title}
                footer={
                    canEdit && (
                        <>
                            <button className="btn btn-secondary" onClick={() => setSelectedItem(null)}>Close</button>
                            <button className="btn btn-primary">Edit Milestone</button>
                        </>
                    )
                }
            >
                {selectedItem && (
                    <div>
                        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
                            <div>
                                <div className="text-sm text-secondary">Pillar</div>
                                <div className="font-medium" style={{ color: pillarColors[selectedItem.pillar] }}>
                                    {selectedItem.pillar}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary">Timeline</div>
                                <div className="font-medium">
                                    {selectedItem.year}{selectedItem.quarter && ` Q${selectedItem.quarter}`}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary">Status</div>
                                <StatusBadge status={selectedItem.status} />
                            </div>
                        </div>
                        {selectedItem.description && (
                            <div>
                                <div className="text-sm text-secondary" style={{ marginBottom: '4px' }}>Description</div>
                                <div className="text-sm">{selectedItem.description}</div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}

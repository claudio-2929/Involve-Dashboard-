// Projects & Programs Dashboard
import { useState, useEffect, useContext } from 'react'
import { KPITile, Card, DataTable, StatusBadge, ProgressBar, Modal } from '../components/shared'
import { CRUDModal } from '../components/CRUDModal'
import { getData, getKPIsByDepartment, getActiveProjects, getProjectsByType } from '../data/dataService'
import { formatCurrency, formatDate, calculateProgress } from '../utils/formatters'
import { AppContext } from '../App'

export default function Projects() {
    const [data, setData] = useState(null)
    const [selectedProject, setSelectedProject] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editProject, setEditProject] = useState(null)
    const { canEdit, isAdmin } = useContext(AppContext)

    const refreshData = () => setData(getData())

    useEffect(() => {
        refreshData()
    }, [])

    if (!data) return null

    const kpis = getKPIsByDepartment('projects')
    const activeKPI = kpis.find(k => k.name === 'Active Projects') || { value: 7, target: 10, previousValue: 5 }

    const projects = data.projects || []
    const activeProjects = projects.filter(p => p.status === 'active')
    const completedProjects = projects.filter(p => p.status === 'completed')

    // Group by type
    const esaProjects = projects.filter(p => p.type === 'ESA')
    const modProjects = projects.filter(p => p.type === 'MoD')
    const commercialProjects = projects.filter(p => p.type === 'commercial')
    const internalProjects = projects.filter(p => p.type === 'internal')

    // Budget summary
    const totalBudget = activeProjects.reduce((sum, p) => sum + (p.budget || 0), 0)
    const totalSpent = activeProjects.reduce((sum, p) => sum + (p.spent || 0), 0)

    const handleEditClick = (project) => {
        setSelectedProject(null)
        setEditProject(project)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold" style={{ marginBottom: '4px' }}>Projects & Programs</h2>
                    <p className="text-secondary">Active initiatives, budgets, and milestones</p>
                </div>
                {canEdit && (
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        + New Project
                    </button>
                )}
            </div>

            {/* KPIs */}
            <div className="kpi-grid mb-6">
                <KPITile
                    label="Active Projects"
                    value={activeProjects.length}
                    target={activeKPI.target}
                    previousValue={activeKPI.previousValue}
                    icon="brand"
                />
                <KPITile
                    label="Total Budget"
                    value={totalBudget}
                    unit="€"
                    icon="info"
                />
                <KPITile
                    label="Total Spent"
                    value={totalSpent}
                    unit="€"
                    icon="warning"
                />
                <KPITile
                    label="Budget Utilization"
                    value={totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}
                    target={85}
                    unit="%"
                    icon="success"
                />
            </div>

            {/* Project Type Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="text-center">
                    <div className="text-sm text-secondary" style={{ marginBottom: '8px' }}>ESA Programs</div>
                    <div className="kpi-value" style={{ fontSize: '2rem' }}>{esaProjects.length}</div>
                    <div className="text-sm text-tertiary">{formatCurrency(esaProjects.reduce((s, p) => s + (p.budget || 0), 0))}</div>
                </Card>
                <Card className="text-center">
                    <div className="text-sm text-secondary" style={{ marginBottom: '8px' }}>Defence (MoD)</div>
                    <div className="kpi-value" style={{ fontSize: '2rem' }}>{modProjects.length}</div>
                    <div className="text-sm text-tertiary">{formatCurrency(modProjects.reduce((s, p) => s + (p.budget || 0), 0))}</div>
                </Card>
                <Card className="text-center">
                    <div className="text-sm text-secondary" style={{ marginBottom: '8px' }}>Commercial</div>
                    <div className="kpi-value" style={{ fontSize: '2rem' }}>{commercialProjects.length}</div>
                    <div className="text-sm text-tertiary">{formatCurrency(commercialProjects.reduce((s, p) => s + (p.budget || 0), 0))}</div>
                </Card>
                <Card className="text-center">
                    <div className="text-sm text-secondary" style={{ marginBottom: '8px' }}>Internal R&D</div>
                    <div className="kpi-value" style={{ fontSize: '2rem' }}>{internalProjects.length}</div>
                    <div className="text-sm text-tertiary">{formatCurrency(internalProjects.reduce((s, p) => s + (p.budget || 0), 0))}</div>
                </Card>
            </div>

            {/* Active Projects Grid */}
            <Card title="Active Projects" subtitle="Current initiatives with budget and timeline" className="mb-6">
                <div className="grid grid-cols-2 gap-4" style={{ marginTop: '16px' }}>
                    {activeProjects.map(project => {
                        const progress = project.budget ? Math.round((project.spent / project.budget) * 100) : 0
                        return (
                            <div
                                key={project.id}
                                className="card"
                                style={{ padding: '16px', cursor: 'pointer' }}
                                onClick={() => setSelectedProject(project)}
                            >
                                <div className="flex justify-between items-start" style={{ marginBottom: '12px' }}>
                                    <div>
                                        <div className="font-semibold">{project.name}</div>
                                        <div className="text-sm text-tertiary">{project.owner}</div>
                                    </div>
                                    <span className={`badge badge-${project.type === 'ESA' ? 'brand' : project.type === 'MoD' ? 'warning' : project.type === 'commercial' ? 'success' : 'info'}`}>
                                        {project.type}
                                    </span>
                                </div>

                                <div style={{ marginBottom: '12px' }}>
                                    <div className="flex justify-between text-sm" style={{ marginBottom: '4px' }}>
                                        <span>Budget</span>
                                        <span>{formatCurrency(project.spent)} / {formatCurrency(project.budget)}</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className={`progress-fill ${progress > 90 ? 'warning' : 'brand'}`}
                                            style={{ width: `${Math.min(100, progress)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm text-secondary">
                                    <span>{formatDate(project.startDate)}</span>
                                    <span>→</span>
                                    <span>{formatDate(project.endDate)}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>

            {/* Completed Projects */}
            {completedProjects.length > 0 && (
                <Card title="Completed Projects" subtitle="Successfully delivered">
                    <DataTable
                        columns={[
                            { key: 'name', label: 'Project', sortable: true },
                            { key: 'type', label: 'Type', sortable: true },
                            { key: 'budget', label: 'Budget', sortable: true, render: (v) => formatCurrency(v) },
                            { key: 'spent', label: 'Final Cost', sortable: true, render: (v) => formatCurrency(v) },
                            { key: 'endDate', label: 'Completed', sortable: true, render: (v) => formatDate(v) },
                            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
                        ]}
                        data={completedProjects}
                        onRowClick={canEdit ? (row) => setEditProject(row) : undefined}
                    />
                </Card>
            )}

            {/* Project Detail Modal */}
            <Modal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                title={selectedProject?.name}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setSelectedProject(null)}>Close</button>
                        {canEdit && (
                            <button className="btn btn-brand" onClick={() => handleEditClick(selectedProject)}>
                                Edit Project
                            </button>
                        )}
                    </>
                }
            >
                {selectedProject && (
                    <div>
                        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
                            <div>
                                <div className="text-sm text-secondary">Type</div>
                                <div className="font-medium">{selectedProject.type}</div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary">Owner</div>
                                <div className="font-medium">{selectedProject.owner}</div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary">Start Date</div>
                                <div className="font-medium">{formatDate(selectedProject.startDate)}</div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary">End Date</div>
                                <div className="font-medium">{formatDate(selectedProject.endDate)}</div>
                            </div>
                        </div>
                        <ProgressBar
                            label="Budget Utilization"
                            value={selectedProject.spent}
                            target={selectedProject.budget}
                            variant="brand"
                        />
                        <div className="flex justify-between text-sm" style={{ marginTop: '8px' }}>
                            <span>Spent: {formatCurrency(selectedProject.spent)}</span>
                            <span>Budget: {formatCurrency(selectedProject.budget)}</span>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add/Edit CRUD Modal */}
            <CRUDModal
                isOpen={showAddModal || !!editProject}
                onClose={() => { setShowAddModal(false); setEditProject(null); }}
                entityType="project"
                editItem={editProject}
                onSave={refreshData}
                onDelete={refreshData}
            />
        </div>
    )
}


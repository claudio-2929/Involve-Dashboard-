// Data service for Involve Space Dashboard
// Handles CRUD operations with localStorage persistence

import { generateId, validateEntity, applyDefaults } from './schema'
import { mockKPIs, mockProjects, mockTechnologies } from './mockData'
import { mockContracts, mockLaunches, mockPeople, mockRoadmapItems, financialData } from './mockData2'

const STORAGE_KEY = 'involve-dashboard-data'

// Initialize data store
function initializeData() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
        return JSON.parse(stored)
    }

    const initialData = {
        kpis: mockKPIs,
        projects: mockProjects,
        technologies: mockTechnologies,
        contracts: mockContracts,
        launches: mockLaunches,
        people: mockPeople,
        roadmapItems: mockRoadmapItems,
        financialData: financialData,
        history: [],
        lastUpdated: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
    return initialData
}

// Get current data
export function getData() {
    return initializeData()
}

// Save data to localStorage
function saveData(data) {
    data.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Generic CRUD operations
export function getAll(entityType) {
    const data = getData()
    const key = entityType + 's'
    return (data[key] || []).filter(item => !item.archived)
}

export function getById(entityType, id) {
    const items = getAll(entityType)
    return items.find(item => item.id === id)
}

export function create(entityType, newItem) {
    const data = getData()
    const key = entityType + 's'

    const item = applyDefaults(entityType, {
        ...newItem,
        id: generateId(),
        lastUpdated: new Date().toISOString(),
        archived: false,
    })

    const validation = validateEntity(entityType, item)
    if (!validation.valid) {
        return { success: false, errors: validation.errors }
    }

    data[key] = [...(data[key] || []), item]

    // Add to history
    data.history.push({
        id: generateId(),
        action: 'create',
        entityType,
        entityId: item.id,
        timestamp: new Date().toISOString(),
        data: item,
    })

    saveData(data)
    return { success: true, item }
}

export function update(entityType, id, updates) {
    const data = getData()
    const key = entityType + 's'

    const index = data[key].findIndex(item => item.id === id)
    if (index === -1) {
        return { success: false, errors: ['Item not found'] }
    }

    const updatedItem = {
        ...data[key][index],
        ...updates,
        lastUpdated: new Date().toISOString(),
    }

    const validation = validateEntity(entityType, updatedItem)
    if (!validation.valid) {
        return { success: false, errors: validation.errors }
    }

    const oldItem = data[key][index]
    data[key][index] = updatedItem

    // Add to history
    data.history.push({
        id: generateId(),
        action: 'update',
        entityType,
        entityId: id,
        timestamp: new Date().toISOString(),
        previousData: oldItem,
        newData: updatedItem,
    })

    saveData(data)
    return { success: true, item: updatedItem }
}

export function archive(entityType, id) {
    return update(entityType, id, { archived: true })
}

export function restore(entityType, id) {
    return update(entityType, id, { archived: false })
}

// Get history for an entity
export function getHistory(entityType, entityId) {
    const data = getData()
    return data.history.filter(
        h => h.entityType === entityType && h.entityId === entityId
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

// KPI specific helpers
export function getKPIsByDepartment(department) {
    return getAll('kpi').filter(kpi => kpi.department === department)
}

export function getKPIsByCategory(category) {
    return getAll('kpi').filter(kpi => kpi.category === category)
}

// Project specific helpers
export function getActiveProjects() {
    return getAll('project').filter(p => p.status === 'active')
}

export function getProjectsByType(type) {
    return getAll('project').filter(p => p.type === type)
}

// Launch specific helpers
export function getUpcomingLaunches() {
    return getAll('launch')
        .filter(l => l.status === 'planned')
        .sort((a, b) => new Date(a.plannedDate) - new Date(b.plannedDate))
}

export function getCompletedLaunches() {
    return getAll('launch').filter(l => l.status === 'completed')
}

// People specific helpers
export function getPeopleByDepartment(department) {
    return getAll('person').filter(p => p.department === department)
}

export function getOpenPositions() {
    return getAll('person').filter(p => p.status === 'open-position')
}

// Contract specific helpers
export function getActiveContracts() {
    return getAll('contract').filter(c => c.status === 'active')
}

export function getContractsByType(type) {
    return getAll('contract').filter(c => c.type === type)
}

// Technology specific helpers
export function getTechnologiesByStatus(status) {
    return getAll('technology').filter(t => t.status === status)
}

// Financial data
export function getFinancialData() {
    const data = getData()
    return data.financialData
}

// Roadmap items
export function getRoadmapItems() {
    return getAll('roadmapItem')
}

export function getRoadmapByYear(year) {
    const data = getData()
    return (data.roadmapItems || []).filter(r => r.year === year)
}

// Calculate summary stats
export function getSummaryStats() {
    const projects = getAll('project')
    const launches = getAll('launch')
    const contracts = getAll('contract')
    const people = getAll('person')
    const technologies = getAll('technology')

    const completedLaunches = launches.filter(l => l.status === 'completed')
    const successfulLaunches = completedLaunches.filter(l => l.success)

    return {
        activeProjects: projects.filter(p => p.status === 'active').length,
        completedLaunches: completedLaunches.length,
        successRate: completedLaunches.length > 0
            ? Math.round((successfulLaunches.length / completedLaunches.length) * 100)
            : 0,
        totalFlightHours: launches.reduce((sum, l) => sum + (l.flightHours || 0), 0),
        activeContracts: contracts.filter(c => c.status === 'active').length,
        totalContractValue: contracts.filter(c => c.status === 'active').reduce((sum, c) => sum + c.value, 0),
        activeTeam: people.filter(p => p.status === 'active').length,
        openPositions: people.filter(p => p.status === 'open-position').length,
        completedTech: technologies.filter(t => t.status === 'completed').length,
        inDevTech: technologies.filter(t => t.status === 'development' || t.status === 'testing').length,
    }
}

// Reset to initial data
export function resetData() {
    localStorage.removeItem(STORAGE_KEY)
    return initializeData()
}

// Data schemas and validation for Involve Space Dashboard

export const EntityTypes = {
    KPI: 'kpi',
    PROJECT: 'project',
    TECHNOLOGY: 'technology',
    CONTRACT: 'contract',
    LAUNCH: 'launch',
    PERSON: 'person',
    MILESTONE: 'milestone',
}

// Schema definitions
export const schemas = {
    kpi: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        category: { type: 'string', required: true }, // revenue, operations, tech, sales, people
        department: { type: 'string', required: true },
        value: { type: 'number', required: true },
        target: { type: 'number' },
        unit: { type: 'string', default: '' }, // €, %, count, months
        previousValue: { type: 'number' },
        trend: { type: 'array' }, // historical values for sparkline
        lastUpdated: { type: 'date', required: true },
        updatedBy: { type: 'string' },
        archived: { type: 'boolean', default: false },
    },

    project: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        type: { type: 'string', required: true }, // ESA, MoD, commercial, internal
        status: { type: 'string', required: true }, // active, completed, on-hold, planned
        description: { type: 'string' },
        budget: { type: 'number' },
        spent: { type: 'number', default: 0 },
        owner: { type: 'string' },
        department: { type: 'string' },
        startDate: { type: 'date' },
        endDate: { type: 'date' },
        milestones: { type: 'array', default: [] },
        lastUpdated: { type: 'date', required: true },
        archived: { type: 'boolean', default: false },
    },

    technology: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        description: { type: 'string' },
        trlLevel: { type: 'number', min: 1, max: 9, required: true },
        targetTrl: { type: 'number', min: 1, max: 9 },
        status: { type: 'string', required: true }, // development, testing, completed, planned
        roadmapStatus: { type: 'string' }, // on-track, delayed, accelerated
        blockers: { type: 'array', default: [] },
        dependencies: { type: 'array', default: [] },
        category: { type: 'string' }, // platform, payload, data, software
        lastUpdated: { type: 'date', required: true },
        archived: { type: 'boolean', default: false },
    },

    contract: {
        id: { type: 'string', required: true },
        client: { type: 'string', required: true },
        type: { type: 'string', required: true }, // B2G, B2B, institutional, grant
        value: { type: 'number', required: true },
        startDate: { type: 'date' },
        endDate: { type: 'date' },
        status: { type: 'string', required: true }, // active, negotiation, signed, completed
        notes: { type: 'string' },
        contactPerson: { type: 'string' },
        lastUpdated: { type: 'date', required: true },
        archived: { type: 'boolean', default: false },
    },

    launch: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        platform: { type: 'string', required: true }, // Stratostat, Stratorelay, etc.
        plannedDate: { type: 'date', required: true },
        executedDate: { type: 'date' },
        status: { type: 'string', required: true }, // planned, completed, cancelled, delayed
        success: { type: 'boolean' },
        flightHours: { type: 'number', default: 0 },
        payload: { type: 'string' },
        notes: { type: 'string' },
        lastUpdated: { type: 'date', required: true },
        archived: { type: 'boolean', default: false },
    },

    person: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        department: { type: 'string', required: true },
        role: { type: 'string', required: true },
        startDate: { type: 'date' },
        status: { type: 'string', required: true }, // active, open-position, planned
        email: { type: 'string' },
        lastUpdated: { type: 'date', required: true },
        archived: { type: 'boolean', default: false },
    },

    milestone: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        projectId: { type: 'string' },
        dueDate: { type: 'date' },
        completedDate: { type: 'date' },
        status: { type: 'string', required: true }, // pending, completed, delayed
        notes: { type: 'string' },
        lastUpdated: { type: 'date', required: true },
    },
}

// Generate unique ID
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Validate entity against schema
export function validateEntity(type, data) {
    const schema = schemas[type]
    if (!schema) {
        throw new Error(`Unknown entity type: ${type}`)
    }

    const errors = []

    for (const [field, rules] of Object.entries(schema)) {
        const value = data[field]

        if (rules.required && (value === undefined || value === null || value === '')) {
            errors.push(`${field} is required`)
            continue
        }

        if (value !== undefined && value !== null) {
            if (rules.type === 'number' && typeof value !== 'number') {
                errors.push(`${field} must be a number`)
            }
            if (rules.type === 'string' && typeof value !== 'string') {
                errors.push(`${field} must be a string`)
            }
            if (rules.min !== undefined && value < rules.min) {
                errors.push(`${field} must be at least ${rules.min}`)
            }
            if (rules.max !== undefined && value > rules.max) {
                errors.push(`${field} must be at most ${rules.max}`)
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    }
}

// Apply defaults to entity
export function applyDefaults(type, data) {
    const schema = schemas[type]
    const result = { ...data }

    for (const [field, rules] of Object.entries(schema)) {
        if (result[field] === undefined && rules.default !== undefined) {
            result[field] = rules.default
        }
    }

    return result
}

// Departments configuration
export const departments = [
    { id: 'finance', name: 'Finance', color: '#10b981' },
    { id: 'operations', name: 'Operations / Flight', color: '#3b82f6' },
    { id: 'technology', name: 'Technology / R&D', color: '#8b5cf6' },
    { id: 'sales', name: 'Sales & Partnerships', color: '#f59e0b' },
    { id: 'projects', name: 'Projects & Programs', color: '#ec4899' },
    { id: 'people', name: 'People / Team', color: '#06b6d4' },
]

// Status configurations
export const statusColors = {
    active: 'success',
    completed: 'success',
    'on-track': 'success',
    negotiation: 'warning',
    planned: 'info',
    pending: 'warning',
    delayed: 'error',
    'on-hold': 'warning',
    cancelled: 'error',
    development: 'info',
    testing: 'warning',
    'open-position': 'warning',
    accelerated: 'success',
}

// TRL Level descriptions
export const trlDescriptions = {
    1: 'Basic principles observed',
    2: 'Technology concept formulated',
    3: 'Proof of concept',
    4: 'Lab validation',
    5: 'Relevant environment validation',
    6: 'Demonstrated in relevant environment',
    7: 'System prototype in space',
    8: 'System complete and qualified',
    9: 'Mission proven',
}

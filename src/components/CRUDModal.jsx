// CRUD Form Modal Component for Admin Operations
import { useState, useEffect, useContext } from 'react'
import { Modal } from './shared'
import { AppContext } from '../App'
import { create, update, archive, getById } from '../data/dataService'
import { generateId } from '../data/schema'

// Field configurations for different entity types
const fieldConfigs = {
    kpi: [
        { key: 'name', label: 'KPI Name', type: 'text', required: true },
        { key: 'value', label: 'Current Value', type: 'number', required: true },
        { key: 'target', label: 'Target', type: 'number' },
        { key: 'unit', label: 'Unit', type: 'select', options: ['€', '%', '', 'months', 'hrs', '€/month'] },
        { key: 'previousValue', label: 'Previous Value', type: 'number' },
        { key: 'department', label: 'Department', type: 'select', options: ['finance', 'operations', 'technology', 'sales', 'projects', 'people'] },
        { key: 'category', label: 'Category', type: 'text' },
    ],
    project: [
        { key: 'name', label: 'Project Name', type: 'text', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['ESA', 'MoD', 'commercial', 'internal'], required: true },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'completed', 'on-hold', 'planned'], required: true },
        { key: 'budget', label: 'Budget (€)', type: 'number' },
        { key: 'spent', label: 'Spent (€)', type: 'number' },
        { key: 'owner', label: 'Owner', type: 'text' },
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' },
    ],
    technology: [
        { key: 'name', label: 'Technology Name', type: 'text', required: true },
        { key: 'trlLevel', label: 'Current TRL', type: 'number', min: 1, max: 9, required: true },
        { key: 'targetTrl', label: 'Target TRL', type: 'number', min: 1, max: 9 },
        { key: 'status', label: 'Status', type: 'select', options: ['development', 'testing', 'completed', 'planned'], required: true },
        { key: 'roadmapStatus', label: 'Roadmap Status', type: 'select', options: ['on-track', 'delayed', 'accelerated'] },
        { key: 'category', label: 'Category', type: 'select', options: ['platform', 'payload', 'software', 'data'] },
    ],
    contract: [
        { key: 'client', label: 'Client Name', type: 'text', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['institutional', 'B2G', 'B2B', 'grant'], required: true },
        { key: 'value', label: 'Value (€)', type: 'number', required: true },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'negotiation', 'completed', 'cancelled'], required: true },
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' },
        { key: 'contactPerson', label: 'Contact Person', type: 'text' },
    ],
    launch: [
        { key: 'name', label: 'Mission Name', type: 'text', required: true },
        { key: 'platform', label: 'Platform', type: 'select', options: ['Stratosat', 'Stratosat V1.5', 'Stratosat V2', 'Stratorelay'], required: true },
        { key: 'plannedDate', label: 'Planned Date', type: 'date', required: true },
        { key: 'executedDate', label: 'Executed Date', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['planned', 'completed', 'cancelled', 'delayed'], required: true },
        { key: 'success', label: 'Success', type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }, { value: '', label: 'N/A' }] },
        { key: 'flightHours', label: 'Flight Hours', type: 'number' },
    ],
    person: [
        { key: 'name', label: 'Full Name', type: 'text', required: true },
        { key: 'role', label: 'Role / Title', type: 'text', required: true },
        { key: 'department', label: 'Department', type: 'select', options: ['leadership', 'finance', 'operations', 'technology', 'sales', 'projects', 'people'], required: true },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'open-position', 'planned'], required: true },
        { key: 'startDate', label: 'Start Date', type: 'date' },
    ],
}

// CRUD Form Modal
export function CRUDModal({ isOpen, onClose, entityType, editItem, onSave, onDelete }) {
    const { isAdmin } = useContext(AppContext)
    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState([])
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const fields = fieldConfigs[entityType] || []
    const isEdit = !!editItem

    useEffect(() => {
        if (editItem) {
            setFormData({ ...editItem })
        } else {
            // Initialize with empty values
            const initial = {}
            fields.forEach(f => {
                initial[f.key] = f.type === 'number' ? '' : ''
            })
            setFormData(initial)
        }
        setErrors([])
        setShowDeleteConfirm(false)
    }, [editItem, isOpen, entityType])

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = () => {
        // Validate required fields
        const newErrors = []
        fields.forEach(f => {
            if (f.required && !formData[f.key]) {
                newErrors.push(`${f.label} is required`)
            }
        })

        if (newErrors.length > 0) {
            setErrors(newErrors)
            return
        }

        // Convert types
        const data = { ...formData }
        fields.forEach(f => {
            if (f.type === 'number' && data[f.key]) {
                data[f.key] = parseFloat(data[f.key])
            }
        })

        let result
        if (isEdit) {
            result = update(entityType, editItem.id, data)
        } else {
            result = create(entityType, data)
        }

        if (result.success) {
            onSave && onSave(result.item)
            onClose()
        } else {
            setErrors(result.errors || ['Failed to save'])
        }
    }

    const handleDelete = () => {
        if (editItem) {
            archive(entityType, editItem.id)
            onDelete && onDelete(editItem.id)
            onClose()
        }
    }

    const entityLabel = entityType.charAt(0).toUpperCase() + entityType.slice(1)

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? `Edit ${entityLabel}` : `Add New ${entityLabel}`}
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        {isEdit && isAdmin && !showDeleteConfirm && (
                            <button
                                className="btn btn-danger"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                Delete
                            </button>
                        )}
                        {showDeleteConfirm && (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--color-error)', fontSize: '14px' }}>Confirm delete?</span>
                                <button className="btn btn-danger btn-sm" onClick={handleDelete}>Yes, Delete</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn btn-brand" onClick={handleSubmit}>
                            {isEdit ? 'Save Changes' : 'Create'}
                        </button>
                    </div>
                </div>
            }
        >
            {errors.length > 0 && (
                <div style={{
                    background: 'var(--color-error-bg)',
                    color: 'var(--color-error)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                }}>
                    {errors.map((err, i) => <div key={i}>{err}</div>)}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {fields.map(field => (
                    <div key={field.key} className="input-group" style={{ marginBottom: '12px' }}>
                        <label className="input-label">
                            {field.label}
                            {field.required && <span style={{ color: 'var(--color-error)' }}> *</span>}
                        </label>

                        {field.type === 'select' ? (
                            <select
                                className="input select"
                                value={formData[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                            >
                                <option value="">Select...</option>
                                {(field.options || []).map(opt => {
                                    const val = typeof opt === 'object' ? opt.value : opt
                                    const label = typeof opt === 'object' ? opt.label : opt
                                    return <option key={val} value={val}>{label}</option>
                                })}
                            </select>
                        ) : field.type === 'date' ? (
                            <input
                                type="date"
                                className="input"
                                value={formData[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                            />
                        ) : field.type === 'number' ? (
                            <input
                                type="number"
                                className="input"
                                value={formData[field.key] || ''}
                                min={field.min}
                                max={field.max}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                className="input"
                                value={formData[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </Modal>
    )
}

// Confirm Dialog Component
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title || 'Confirm Action'}
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>
                        Confirm
                    </button>
                </>
            }
        >
            <p>{message || 'Are you sure you want to proceed?'}</p>
        </Modal>
    )
}

// Inline Edit Cell Component
export function EditableCell({ value, onSave, type = 'text' }) {
    const [editing, setEditing] = useState(false)
    const [tempValue, setTempValue] = useState(value)
    const { isAdmin } = useContext(AppContext)

    if (!isAdmin) {
        return <span>{value}</span>
    }

    if (editing) {
        return (
            <input
                type={type}
                className="input"
                style={{ padding: '4px 8px', width: '100%' }}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => {
                    onSave(tempValue)
                    setEditing(false)
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSave(tempValue)
                        setEditing(false)
                    }
                    if (e.key === 'Escape') {
                        setTempValue(value)
                        setEditing(false)
                    }
                }}
                autoFocus
            />
        )
    }

    return (
        <span
            onClick={() => setEditing(true)}
            style={{ cursor: 'pointer', borderBottom: '1px dashed var(--color-border)' }}
            title="Click to edit"
        >
            {value || '-'}
        </span>
    )
}

export default CRUDModal

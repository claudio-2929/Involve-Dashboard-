// Utility functions for formatting and calculations

// Format currency
export function formatCurrency(value, currency = '€') {
    if (value >= 1000000) {
        return `${currency}${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
        return `${currency}${(value / 1000).toFixed(0)}K`
    }
    return `${currency}${value.toLocaleString()}`
}

// Format number with suffix
export function formatNumber(value) {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`
    }
    return value.toLocaleString()
}

// Format percentage
export function formatPercent(value) {
    return `${value.toFixed(0)}%`
}

// Format date
export function formatDate(dateString) {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

// Format relative date
export function formatRelativeDate(dateString) {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
}

// Calculate delta percentage
export function calculateDelta(current, previous) {
    if (!previous || previous === 0) return 0
    return ((current - previous) / previous) * 100
}

// Format delta with sign
export function formatDelta(delta) {
    const sign = delta > 0 ? '+' : ''
    return `${sign}${delta.toFixed(1)}%`
}

// Calculate progress percentage
export function calculateProgress(current, target) {
    if (!target || target === 0) return 0
    return Math.min(100, (current / target) * 100)
}

// Get status color class
export function getStatusColor(status) {
    const colors = {
        active: 'success',
        completed: 'success',
        'on-track': 'success',
        accelerated: 'success',
        negotiation: 'warning',
        planned: 'info',
        pending: 'warning',
        delayed: 'error',
        'on-hold': 'warning',
        cancelled: 'error',
        development: 'info',
        testing: 'warning',
        'open-position': 'warning',
    }
    return colors[status] || 'neutral'
}

// Get TRL color
export function getTRLColor(trl) {
    if (trl >= 7) return 'success'
    if (trl >= 4) return 'warning'
    return 'info'
}

// Group items by key
export function groupBy(items, key) {
    return items.reduce((groups, item) => {
        const value = item[key]
        if (!groups[value]) groups[value] = []
        groups[value].push(item)
        return groups
    }, {})
}

// Sort items by date
export function sortByDate(items, key, ascending = false) {
    return [...items].sort((a, b) => {
        const dateA = new Date(a[key])
        const dateB = new Date(b[key])
        return ascending ? dateA - dateB : dateB - dateA
    })
}

// Filter by date range
export function filterByDateRange(items, dateKey, startDate, endDate) {
    return items.filter(item => {
        const date = new Date(item[dateKey])
        return date >= startDate && date <= endDate
    })
}

// Calculate average
export function calculateAverage(items, key) {
    if (!items.length) return 0
    const sum = items.reduce((acc, item) => acc + (item[key] || 0), 0)
    return sum / items.length
}

// Get quarters for a year
export function getQuarters(year) {
    return [
        { label: 'Q1', start: new Date(year, 0, 1), end: new Date(year, 2, 31) },
        { label: 'Q2', start: new Date(year, 3, 1), end: new Date(year, 5, 30) },
        { label: 'Q3', start: new Date(year, 6, 1), end: new Date(year, 8, 30) },
        { label: 'Q4', start: new Date(year, 9, 1), end: new Date(year, 11, 31) },
    ]
}

// Current quarter
export function getCurrentQuarter() {
    const now = new Date()
    return Math.floor(now.getMonth() / 3) + 1
}

// Debounce function
export function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

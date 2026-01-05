// Mock data for Involve Space Dashboard - Part 1: KPIs and Projects

export const mockKPIs = [
    { id: 'kpi-1', name: 'Total Revenue YTD', category: 'revenue', department: 'finance', value: 2400000, target: 3500000, unit: '€', previousValue: 2100000, trend: [180000, 195000, 210000, 220000, 245000, 280000, 310000, 360000, 400000], lastUpdated: '2026-01-05' },
    { id: 'kpi-2', name: 'Cash Runway', category: 'financial', department: 'finance', value: 18, target: 24, unit: 'months', previousValue: 20, trend: [24, 23, 22, 21, 20, 19, 18], lastUpdated: '2026-01-05' },
    { id: 'kpi-3', name: 'Active Contracts', category: 'sales', department: 'sales', value: 12, target: 15, unit: '', previousValue: 9, lastUpdated: '2026-01-05' },
    { id: 'kpi-4', name: 'Total Contract Value', category: 'sales', department: 'sales', value: 8500000, target: 10000000, unit: '€', previousValue: 6200000, lastUpdated: '2026-01-05' },
    { id: 'kpi-5', name: 'Active Customers', category: 'sales', department: 'sales', value: 8, target: 12, unit: '', previousValue: 6, lastUpdated: '2026-01-05' },
    { id: 'kpi-6', name: 'Launches YTD', category: 'operations', department: 'operations', value: 3, target: 8, unit: '', previousValue: 5, lastUpdated: '2026-01-05' },
    { id: 'kpi-7', name: 'Launch Success Rate', category: 'operations', department: 'operations', value: 94, target: 95, unit: '%', previousValue: 91, lastUpdated: '2026-01-05' },
    { id: 'kpi-8', name: 'Active Projects', category: 'projects', department: 'projects', value: 7, target: 10, unit: '', previousValue: 5, lastUpdated: '2026-01-05' },
    { id: 'kpi-9', name: 'Technologies Completed', category: 'technology', department: 'technology', value: 4, target: 6, unit: '', previousValue: 3, lastUpdated: '2026-01-05' },
    { id: 'kpi-10', name: 'Team Size', category: 'people', department: 'people', value: 28, target: 35, unit: '', previousValue: 24, lastUpdated: '2026-01-05' },
    { id: 'kpi-11', name: 'Burn Rate', category: 'financial', department: 'finance', value: 180000, target: 150000, unit: '€/month', previousValue: 165000, lastUpdated: '2026-01-05' },
    { id: 'kpi-12', name: 'Grant Revenue', category: 'revenue', department: 'finance', value: 1200000, target: 1500000, unit: '€', previousValue: 900000, lastUpdated: '2026-01-05' },
    { id: 'kpi-13', name: 'Service Revenue', category: 'revenue', department: 'finance', value: 800000, target: 1200000, unit: '€', previousValue: 650000, lastUpdated: '2026-01-05' },
    { id: 'kpi-14', name: 'Budget Utilization', category: 'financial', department: 'finance', value: 78, target: 85, unit: '%', previousValue: 72, lastUpdated: '2026-01-05' },
    { id: 'kpi-15', name: 'Total Flight Hours', category: 'operations', department: 'operations', value: 1247, target: 2000, unit: 'hrs', previousValue: 980, lastUpdated: '2026-01-05' },
    { id: 'kpi-16', name: 'Platform Availability', category: 'operations', department: 'operations', value: 92, target: 95, unit: '%', previousValue: 89, lastUpdated: '2026-01-05' },
    { id: 'kpi-17', name: 'Lifetime Launches', category: 'operations', department: 'operations', value: 23, target: 30, unit: '', previousValue: 20, lastUpdated: '2026-01-05' },
    { id: 'kpi-18', name: 'Technologies In Development', category: 'technology', department: 'technology', value: 5, target: 6, unit: '', previousValue: 4, lastUpdated: '2026-01-05' },
    { id: 'kpi-19', name: 'Average TRL', category: 'technology', department: 'technology', value: 5.4, target: 6, unit: '', previousValue: 4.8, lastUpdated: '2026-01-05' },
    { id: 'kpi-20', name: 'Leads in Pipeline', category: 'sales', department: 'sales', value: 18, target: 25, unit: '', previousValue: 14, lastUpdated: '2026-01-05' },
    { id: 'kpi-21', name: 'Active Negotiations', category: 'sales', department: 'sales', value: 5, target: 8, unit: '', previousValue: 4, lastUpdated: '2026-01-05' },
    { id: 'kpi-22', name: 'Conversion Rate', category: 'sales', department: 'sales', value: 32, target: 40, unit: '%', previousValue: 28, lastUpdated: '2026-01-05' },
    { id: 'kpi-23', name: 'Open Positions', category: 'people', department: 'people', value: 4, target: 7, unit: '', previousValue: 3, lastUpdated: '2026-01-05' },
    { id: 'kpi-24', name: 'Retention Rate', category: 'people', department: 'people', value: 94, target: 95, unit: '%', previousValue: 92, lastUpdated: '2026-01-05' },
]

export const mockProjects = [
    { id: 'proj-1', name: 'CLEAR Mission', type: 'ESA', status: 'active', budget: 2500000, spent: 1800000, owner: 'Dr. Maria Santos', department: 'projects', startDate: '2024-03-01', endDate: '2026-12-31', lastUpdated: '2026-01-05' },
    { id: 'proj-2', name: 'Stratosphere Mapping', type: 'commercial', status: 'active', budget: 850000, spent: 420000, owner: 'Dr. James Chen', department: 'projects', startDate: '2025-01-15', endDate: '2026-06-30', lastUpdated: '2026-01-05' },
    { id: 'proj-3', name: 'Defense Reconnaissance', type: 'MoD', status: 'active', budget: 4200000, spent: 2100000, owner: 'Lt. Col. Roberts', department: 'projects', startDate: '2024-09-01', endDate: '2027-03-31', lastUpdated: '2026-01-05' },
    { id: 'proj-4', name: 'GeoAI Platform', type: 'internal', status: 'active', budget: 600000, spent: 380000, owner: 'Dr. Elena Volkov', department: 'technology', startDate: '2025-06-01', endDate: '2026-09-30', lastUpdated: '2026-01-05' },
    { id: 'proj-5', name: 'Stratosat V2', type: 'internal', status: 'active', budget: 1200000, spent: 450000, owner: 'Eng. Marco Rossi', department: 'technology', startDate: '2025-09-01', endDate: '2027-06-30', lastUpdated: '2026-01-05' },
    { id: 'proj-6', name: 'EO Data Services', type: 'commercial', status: 'active', budget: 450000, spent: 280000, owner: 'Sarah Mitchell', department: 'sales', startDate: '2025-03-01', endDate: '2026-08-31', lastUpdated: '2026-01-05' },
    { id: 'proj-7', name: 'ESA Horizon Contract', type: 'ESA', status: 'active', budget: 1800000, spent: 600000, owner: 'Dr. Hans Mueller', department: 'projects', startDate: '2025-11-01', endDate: '2028-10-31', lastUpdated: '2026-01-05' },
    { id: 'proj-8', name: 'Arctic Monitoring', type: 'commercial', status: 'completed', budget: 320000, spent: 310000, owner: 'Dr. Anna Larsen', department: 'projects', startDate: '2024-06-01', endDate: '2025-12-15', lastUpdated: '2025-12-20' },
]

export const mockTechnologies = [
    { id: 'tech-1', name: 'Stratostat Platform', trlLevel: 8, targetTrl: 9, status: 'testing', roadmapStatus: 'on-track', category: 'platform', blockers: [], lastUpdated: '2026-01-05' },
    { id: 'tech-2', name: 'Stratorelay Comm System', trlLevel: 6, targetTrl: 8, status: 'development', roadmapStatus: 'on-track', category: 'platform', blockers: [], lastUpdated: '2026-01-05' },
    { id: 'tech-3', name: 'GeoAI Processing Engine', trlLevel: 5, targetTrl: 7, status: 'development', roadmapStatus: 'accelerated', category: 'software', blockers: [], lastUpdated: '2026-01-05' },
    { id: 'tech-4', name: 'Multispectral Sensor Array', trlLevel: 7, targetTrl: 9, status: 'testing', roadmapStatus: 'on-track', category: 'payload', blockers: [], lastUpdated: '2026-01-05' },
    { id: 'tech-5', name: 'Autonomous Navigation', trlLevel: 4, targetTrl: 7, status: 'development', roadmapStatus: 'delayed', category: 'software', blockers: ['Sensor integration'], lastUpdated: '2026-01-05' },
    { id: 'tech-6', name: 'Power Management System', trlLevel: 6, targetTrl: 8, status: 'development', roadmapStatus: 'on-track', category: 'platform', blockers: [], lastUpdated: '2026-01-05' },
    { id: 'tech-7', name: 'Data Downlink System', trlLevel: 8, targetTrl: 9, status: 'completed', roadmapStatus: 'on-track', category: 'platform', blockers: [], lastUpdated: '2025-11-15' },
    { id: 'tech-8', name: 'Debris Detection AI', trlLevel: 3, targetTrl: 6, status: 'development', roadmapStatus: 'on-track', category: 'software', blockers: [], lastUpdated: '2026-01-05' },
    { id: 'tech-9', name: 'Thermal Control Unit', trlLevel: 9, targetTrl: 9, status: 'completed', roadmapStatus: 'on-track', category: 'platform', blockers: [], lastUpdated: '2025-08-20' },
]

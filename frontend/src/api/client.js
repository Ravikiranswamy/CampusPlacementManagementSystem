/**
 * Centralized API client for communicating with the Spring Boot backend.
 * Uses Vite proxy or direct relative /api path.
 */

const API_BASE = '/api'

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body)
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config)

    const contentType = response.headers.get('content-type')
    let result
    if (contentType && contentType.includes('application/json')) {
      result = await response.json()
    } else {
      const text = await response.text()
      if (!response.ok) {
        throw new Error(`Backend server unreachable (HTTP ${response.status}). Please ensure Spring Boot is running on port 8080.`)
      }
      return text
    }

    if (!response.ok || result.success === false) {
      throw new Error(result.message || 'An error occurred while connecting to the server')
    }

    return result.data
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error)
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Unexpected end of JSON')) {
      throw new Error('Cannot connect to Spring Boot backend (localhost:8080). Please make sure your Spring Boot application is started!')
    }
    throw error
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),

  // Students
  getStudents: () => request('/students'),
  getStudentById: (id) => request(`/students/${id}`),
  registerStudent: (data) => request('/students', { method: 'POST', body: data }),
  updateStudent: (id, data) => request(`/students/${id}`, { method: 'PUT', body: data }),
  getStudentSkills: (id) => request(`/students/${id}/skills`),
  addStudentSkill: (id, data) => request(`/students/${id}/skills`, { method: 'POST', body: data }),
  removeStudentSkill: (id, skillId) => request(`/students/${id}/skills/${skillId}`, { method: 'DELETE' }),

  // Departments
  getDepartments: () => request('/departments'),

  // Skills Catalog
  getSkills: () => request('/skills'),
  createSkill: (data) => request('/skills', { method: 'POST', body: data }),

  // Companies
  getCompanies: () => request('/companies'),
  getCompanyById: (id) => request(`/companies/${id}`),
  createCompany: (data) => request('/companies', { method: 'POST', body: data }),
  updateCompany: (id, data) => request(`/companies/${id}`, { method: 'PUT', body: data }),
  toggleCompanyStatus: (id) => request(`/companies/${id}/toggle-status`, { method: 'PATCH' }),

  // Job Roles
  getJobRoles: () => request('/job-roles'),
  getJobRolesByCompany: (companyId) => request(`/job-roles/company/${companyId}`),
  createJobRole: (data) => request('/job-roles', { method: 'POST', body: data }),
  updateJobRole: (id, data) => request(`/job-roles/${id}`, { method: 'PUT', body: data }),

  // Placement Drives
  getDrives: () => request('/drives'),
  getPublishedDrives: () => request('/drives/published'),
  getDriveById: (id) => request(`/drives/${id}`),
  createDrive: (data) => request('/drives', { method: 'POST', body: data }),
  updateDrive: (id, data) => request(`/drives/${id}`, { method: 'PUT', body: data }),
  updateDriveStatus: (id, status) => request(`/drives/${id}/status`, { method: 'PATCH', body: { status } }),

  // Eligibility
  checkEligibility: (studentId, driveId) => request(`/eligibility/check?studentId=${studentId}&driveId=${driveId}`),
  getEligibleDrivesForStudent: (studentId) => request(`/eligibility/drives/student/${studentId}`),

  // Applications
  getApplications: () => request('/applications'),
  getApplicationById: (id) => request(`/applications/${id}`),
  getStudentApplications: (studentId) => request(`/applications/student/${studentId}`),
  getDriveApplications: (driveId) => request(`/applications/drive/${driveId}`),
  applyForDrive: (data) => request('/applications', { method: 'POST', body: data }),
  updateApplicationStatus: (id, data) => request(`/applications/${id}/status`, { method: 'PUT', body: data }),
  withdrawApplication: (id, studentId) => request(`/applications/${id}/withdraw?studentId=${studentId}`, { method: 'POST' }),

  // Rounds & Results
  createRound: (data) => request('/rounds', { method: 'POST', body: data }),
  getRoundsByDrive: (driveId) => request(`/rounds/drive/${driveId}`),
  recordRoundResult: (data) => request('/rounds/results', { method: 'POST', body: data }),
  getRoundResults: (roundId) => request(`/rounds/${roundId}/results`),
  getApplicationResults: (applicationId) => request(`/rounds/application/${applicationId}/results`),

  // Offers
  getOffers: () => request('/offers'),
  getStudentOffers: (studentId) => request(`/offers/student/${studentId}`),
  createOffer: (data) => request('/offers', { method: 'POST', body: data }),
  updateOfferStatus: (id, status) => request(`/offers/${id}/status`, { method: 'PATCH', body: { offerStatus: status } }),

  // Restrictions & Audit
  getRestrictions: () => request('/restrictions'),
  getStudentRestrictions: (studentId) => request(`/restrictions/student/${studentId}`),
  blockStudent: (data) => request('/restrictions/block', { method: 'POST', body: data }),
  unblockStudent: (id, data) => request(`/restrictions/${id}/unblock`, { method: 'POST', body: data }),
  getAuditLogs: () => request('/audit-logs'),

  // Analytical Reports
  getPlacementStats: () => request('/reports/placement-stats'),
  getPackageStats: () => request('/reports/package-stats'),
}


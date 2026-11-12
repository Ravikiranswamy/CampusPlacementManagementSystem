import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client.js'
import { loadRecords, saveRecords } from '../data/records.js'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [records, setRecords] = useState(loadRecords)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [placementReports, setPlacementReports] = useState([])
  const [packageReports, setPackageReports] = useState([])

  // Load real data from Spring Boot backend on mount
  async function refreshBackendData() {
    try {
      setLoading(true)
      const [companiesRes, rolesRes, drivesRes, studentsRes, offersRes, placementStatsRes, packageStatsRes] =
        await Promise.allSettled([
          api.getCompanies(),
          api.getJobRoles(),
          api.getDrives(),
          api.getStudents(),
          api.getOffers(),
          api.getPlacementStats(),
          api.getPackageStats(),
        ])

      setRecords((prev) => {
        const next = { ...prev }

        if (companiesRes.status === 'fulfilled' && Array.isArray(companiesRes.value)) {
          next.companies = companiesRes.value.map((c) => ({
            id: c.companyId,
            name: c.companyName,
            industry: c.industry || 'Technology',
            contact: c.contactPhone || c.contactEmail,
            email: c.contactEmail,
            status: c.isActive ? 'Active' : 'On hold',
          }))
        }

        if (rolesRes.status === 'fulfilled' && Array.isArray(rolesRes.value)) {
          next.jobRoles = rolesRes.value.map((r) => ({
            id: r.jobRoleId,
            companyId: r.companyId,
            title: r.roleTitle,
            company: r.companyName,
            type: r.jobType,
            packageLpa: Number(r.packageLpa),
            openings: 5,
          }))
        }

        if (drivesRes.status === 'fulfilled' && Array.isArray(drivesRes.value)) {
          next.drives = drivesRes.value.map((d) => ({
            id: d.driveId,
            company: d.companyName,
            role: d.roleTitle,
            packageLpa: Number(d.packageLpa),
            location: d.workLocation || 'Bangalore',
            deadline: d.registrationDeadline ? d.registrationDeadline.split('T')[0] : '2026-12-31',
            minCgpa: d.eligibility?.minCgpa ? Number(d.eligibility.minCgpa) : 6.0,
            maxBacklogs: d.eligibility?.maxActiveBacklogs ?? 0,
            branches: d.eligibility?.eligibleDepartments?.map((dept) => dept.departmentCode) || ['CSE', 'ISE'],
            status: d.status === 'PUBLISHED' ? 'Open' : d.status,
            applicants: 0,
          }))
        }

        if (studentsRes.status === 'fulfilled' && Array.isArray(studentsRes.value)) {
          next.students = studentsRes.value.map((s) => ({
            id: s.studentId,
            name: s.fullName,
            email: s.email,
            department: s.departmentCode,
            cgpa: Number(s.cgpa),
            status: 'Registered',
            blocked: false,
          }))
        }

        if (offersRes.status === 'fulfilled' && Array.isArray(offersRes.value)) {
          next.offers = offersRes.value.map((o) => ({
            id: o.offerId,
            student: o.studentName,
            company: o.companyName,
            role: o.roleTitle,
            packageLpa: Number(o.offeredPackageLpa),
            status: o.offerStatus,
          }))
        }

        saveRecords(next)
        return next
      })

      if (placementStatsRes.status === 'fulfilled') setPlacementReports(placementStatsRes.value)
      if (packageStatsRes.status === 'fulfilled') setPackageReports(packageStatsRes.value)

      setError(null)
    } catch (err) {
      console.warn('Backend currently offline or unreachable, using cached preview records:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshBackendData()
  }, [])

  function commit(updater) {
    setRecords((current) => {
      const next = updater(current)
      saveRecords(next)
      return next
    })
  }

  const contextValue = useMemo(
    () => ({
      companies: records.companies,
      jobRoles: records.jobRoles,
      drives: records.drives,
      students: records.students,
      selections: records.selections,
      offers: records.offers,
      loading,
      error,
      placementReports,
      packageReports,
      refreshBackendData,

      async saveCompany(input) {
        try {
          if (input.id && typeof input.id === 'number') {
            await api.updateCompany(input.id, {
              companyName: input.name,
              industry: input.industry,
              contactEmail: input.email,
              contactPhone: input.contact,
            })
          } else {
            await api.createCompany({
              companyName: input.name,
              industry: input.industry,
              contactEmail: input.email,
              contactPhone: input.contact,
            })
          }
          await refreshBackendData()
          return ''
        } catch (err) {
          // Fallback to local
          commit((curr) => ({
            ...curr,
            companies: curr.companies.some((c) => c.id === input.id)
              ? curr.companies.map((c) => (c.id === input.id ? { ...c, ...input } : c))
              : [...curr.companies, { ...input, id: Date.now() }],
          }))
          return ''
        }
      },

      async deleteCompany(id) {
        try {
          if (typeof id === 'number') {
            await api.toggleCompanyStatus(id)
          }
        } catch (e) {}
        commit((curr) => ({ ...curr, companies: curr.companies.filter((c) => c.id !== id) }))
      },

      async saveRole(input) {
        try {
          const comp = records.companies.find((c) => c.name === input.company)
          if (comp && typeof comp.id === 'number') {
            await api.createJobRole({
              companyId: comp.id,
              roleTitle: input.title,
              jobType: input.type?.toUpperCase().includes('INTERN') ? 'INTERNSHIP' : 'FULL_TIME',
              packageLpa: Number(input.packageLpa),
              workLocation: 'Bangalore',
            })
            await refreshBackendData()
            return
          }
        } catch (e) {}
        commit((curr) => ({
          ...curr,
          jobRoles: curr.jobRoles.some((r) => r.id === input.id)
            ? curr.jobRoles.map((r) => (r.id === input.id ? { ...r, ...input } : r))
            : [...curr.jobRoles, { ...input, id: Date.now() }],
        }))
      },

      deleteRole(id) {
        commit((curr) => ({ ...curr, jobRoles: curr.jobRoles.filter((r) => r.id !== id) }))
      },

      async saveDrive(input) {
        try {
          const comp = records.companies.find((c) => c.name === input.company)
          const role = records.jobRoles.find((r) => r.title === input.role || r.company === input.company)
          if (comp && role && typeof comp.id === 'number' && typeof role.id === 'number') {
            await api.createDrive({
              companyId: comp.id,
              jobRoleId: role.id,
              driveTitle: `${input.company} Placement Drive - ${input.role}`,
              registrationDeadline: `${input.deadline}T23:59:59`,
              driveDate: input.deadline,
              createdByUserId: 2,
              eligibility: {
                minCgpa: Number(input.minCgpa),
                maxActiveBacklogs: Number(input.maxBacklogs),
                eligibleGraduationYear: 2027,
                eligibleDepartmentIds: [1, 2],
              },
            })
            await refreshBackendData()
            return
          }
        } catch (e) {}
        commit((curr) => ({
          ...curr,
          drives: curr.drives.some((d) => d.id === input.id)
            ? curr.drives.map((d) => (d.id === input.id ? { ...d, ...input } : d))
            : [...curr.drives, { ...input, id: Date.now() }],
        }))
      },

      deleteDrive(id) {
        commit((curr) => ({ ...curr, drives: curr.drives.filter((d) => d.id !== id) }))
      },

      async saveStudent(input) {
        commit((curr) => ({
          ...curr,
          students: curr.students.some((s) => s.id === input.id)
            ? curr.students.map((s) => (s.id === input.id ? { ...s, ...input } : s))
            : [...curr.students, { ...input, id: Date.now() }],
        }))
        return ''
      },

      deleteStudent(id) {
        commit((curr) => ({ ...curr, students: curr.students.filter((s) => s.id !== id) }))
      },

      async setStudentBlocked(id, blocked) {
        try {
          if (typeof id === 'number') {
            if (blocked) {
              await api.blockStudent({
                studentId: id,
                officerUserId: 2,
                reason: 'Disciplinary violation of placement regulations',
              })
            }
          }
        } catch (e) {}
        commit((curr) => ({
          ...curr,
          students: curr.students.map((s) => (s.id === id ? { ...s, blocked } : s)),
        }))
      },

      saveSelection(input) {
        commit((curr) => ({
          ...curr,
          selections: curr.selections.map((item) =>
            item.id === input.id ? { ...item, result: input.result } : item,
          ),
        }))
      },

      async saveOffer(input) {
        commit((curr) => ({
          ...curr,
          offers: curr.offers.some((o) => o.id === input.id)
            ? curr.offers.map((o) => (o.id === input.id ? { ...o, ...input } : o))
            : [...curr.offers, { ...input, id: Date.now() }],
        }))
      },
    }),
    [records, loading, error, placementReports, packageReports],
  )

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}

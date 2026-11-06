import { createContext, useContext, useMemo, useState } from 'react'
import { loadRecords, nextId, saveRecords } from '../data/records.js'

const DataContext = createContext(null)

function replaceItem(list, record) {
  const exists = list.some((item) => item.id === record.id)
  if (!exists) return [...list, record]
  return list.map((item) => (item.id === record.id ? record : item))
}

export function DataProvider({ children }) {
  const [records, setRecords] = useState(loadRecords)

  function commit(updater) {
    setRecords((current) => {
      const next = updater(current)
      saveRecords(next)
      return next
    })
  }

  const api = useMemo(
    () => ({
      companies: records.companies,
      jobRoles: records.jobRoles,
      drives: records.drives,
      students: records.students,
      selections: records.selections,
      offers: records.offers,
      saveCompany(input) {
        const email = input.email.trim().toLowerCase()
        const duplicate = records.companies.some(
          (company) => company.id !== input.id && company.email.toLowerCase() === email,
        )
        if (duplicate) return 'Another company already uses that email.'
        const record = {
          ...input,
          id: input.id || nextId('CMP', records.companies, 2),
          name: input.name.trim(),
          industry: input.industry.trim(),
          contact: input.contact.trim(),
          email,
          status: input.status,
        }
        commit((current) => ({ ...current, companies: replaceItem(current.companies, record) }))
        return ''
      },
      deleteCompany(id) {
        commit((current) => ({
          ...current,
          companies: current.companies.filter((company) => company.id !== id),
        }))
      },
      saveRole(input) {
        const record = {
          ...input,
          id: input.id || nextId('ROL', records.jobRoles, 2),
          title: input.title.trim(),
          company: input.company,
          type: input.type,
          packageLpa: Number(input.packageLpa),
          openings: Number(input.openings),
        }
        commit((current) => ({ ...current, jobRoles: replaceItem(current.jobRoles, record) }))
      },
      deleteRole(id) {
        commit((current) => ({
          ...current,
          jobRoles: current.jobRoles.filter((role) => role.id !== id),
        }))
      },
      saveDrive(input) {
        const record = {
          ...input,
          id: input.id || nextId('DRV', records.drives, 3),
          company: input.company,
          role: input.role.trim(),
          packageLpa: Number(input.packageLpa),
          location: input.location.trim(),
          deadline: input.deadline,
          minCgpa: Number(input.minCgpa),
          maxBacklogs: Number(input.maxBacklogs),
          branches: input.branches,
          status: input.status,
          applicants: Number(input.applicants),
        }
        commit((current) => ({ ...current, drives: replaceItem(current.drives, record) }))
      },
      deleteDrive(id) {
        commit((current) => ({
          ...current,
          drives: current.drives.filter((drive) => drive.id !== id),
        }))
      },
      saveStudent(input) {
        const email = input.email.trim().toLowerCase()
        const duplicate = records.students.some(
          (student) => student.id !== input.id && student.email.toLowerCase() === email,
        )
        if (duplicate) return 'Another student already uses that email.'
        const record = {
          ...input,
          id: input.id || nextId('STU', records.students, 3),
          name: input.name.trim(),
          email,
          department: input.department,
          cgpa: Number(input.cgpa),
          status: input.status,
          blocked: Boolean(input.blocked),
        }
        commit((current) => ({ ...current, students: replaceItem(current.students, record) }))
        return ''
      },
      deleteStudent(id) {
        commit((current) => ({
          ...current,
          students: current.students.filter((student) => student.id !== id),
        }))
      },
      setStudentBlocked(id, blocked) {
        commit((current) => ({
          ...current,
          students: current.students.map((student) =>
            student.id === id ? { ...student, blocked } : student,
          ),
        }))
      },
      saveSelection(input) {
        commit((current) => ({
          ...current,
          selections: current.selections.map((item) =>
            item.id === input.id ? { ...item, result: input.result } : item,
          ),
        }))
      },
      saveOffer(input) {
        const record = {
          ...input,
          id: input.id || nextId('OFR', records.offers, 2),
          student: input.student.trim(),
          company: input.company,
          role: input.role.trim(),
          packageLpa: Number(input.packageLpa),
          status: input.status,
        }
        commit((current) => ({ ...current, offers: replaceItem(current.offers, record) }))
      },
    }),
    [records],
  )

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}

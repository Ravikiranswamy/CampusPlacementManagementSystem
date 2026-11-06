import {
  companies as seedCompanies,
  drives as seedDrives,
  jobRoles as seedRoles,
  offers as seedOffers,
  selections as seedSelections,
  students as seedStudents,
} from './mockData.js'

export const STORAGE_KEY = 'campus-placement-records'

const MONTHS = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
}

const companyEmails = {
  'CMP-01': 'priya.raman@northwind.example',
  'CMP-02': 'arun.desai@helios.example',
  'CMP-03': 'neha.kulkarni@aster.example',
  'CMP-04': 'vikram.shah@orbit.example',
  'CMP-05': 'sana.iqbal@lumen.example',
}

export function todayIso() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function toIsoDate(value) {
  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const match = String(value).match(/(\d{1,2}) ([A-Za-z]{3}) (\d{4})/)
  if (!match || !MONTHS[match[2]]) return ''
  return `${match[3]}-${MONTHS[match[2]]}-${match[1].padStart(2, '0')}`
}

export function formatDeadline(value) {
  const iso = toIsoDate(value)
  if (!iso) return value || ''
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function studentEmail(name) {
  const slug = String(name)
    .toLowerCase()
    .replace(/[^a-z]+/g, '.')
    .replace(/^\.|\.$/g, '')
  return `${slug}@university.edu`
}

function seed() {
  return {
    companies: seedCompanies.map((company) => ({
      ...company,
      email: companyEmails[company.id] || '',
    })),
    jobRoles: seedRoles.map((role) => ({ ...role })),
    drives: seedDrives.map((drive) => ({
      ...drive,
      deadline: toIsoDate(drive.deadline),
      branches: [...drive.branches],
    })),
    students: seedStudents.map((student) => ({
      ...student,
      email: studentEmail(student.name),
      blocked: false,
    })),
    selections: seedSelections.map((item) => ({ ...item })),
    offers: seedOffers.map((offer) => ({ ...offer })),
  }
}

function normalize(data) {
  const base = seed()
  return {
    companies: (data.companies || base.companies).map((company) => ({
      email: '',
      ...company,
    })),
    jobRoles: data.jobRoles || base.jobRoles,
    drives: (data.drives || base.drives).map((drive) => ({
      ...drive,
      deadline: toIsoDate(drive.deadline),
      branches: Array.isArray(drive.branches)
        ? drive.branches
        : String(drive.branches || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
    })),
    students: (data.students || base.students).map((student) => ({
      email: studentEmail(student.name),
      blocked: false,
      ...student,
    })),
    selections: data.selections || base.selections,
    offers: data.offers || base.offers,
  }
}

export function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()
    return normalize(JSON.parse(raw))
  } catch {
    return seed()
  }
}

export function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function nextId(prefix, items, width) {
  const pattern = new RegExp(`^${prefix}-(\\d+)$`)
  const max = items.reduce((best, item) => {
    const match = pattern.exec(item.id)
    return match ? Math.max(best, Number(match[1])) : best
  }, 0)
  return `${prefix}-${String(max + 1).padStart(width, '0')}`
}

export function required(label) {
  return (value) => (String(value ?? '').trim() ? '' : `${label} is required.`)
}

export function validEmail(label) {
  return (value) => {
    const text = String(value ?? '').trim()
    if (!text) return `${label} is required.`
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return 'Enter a valid email address.'
    return ''
  }
}

export function positiveNumber(label) {
  return (value) => {
    if (value === '' || value === null || value === undefined) return `${label} is required.`
    const number = Number(value)
    if (!Number.isFinite(number) || number <= 0) return `${label} must be greater than 0.`
    return ''
  }
}

export function nonNegativeNumber(label) {
  return (value) => {
    if (value === '' || value === null || value === undefined) return `${label} is required.`
    const number = Number(value)
    if (!Number.isFinite(number) || number < 0) return `${label} cannot be negative.`
    return ''
  }
}

export function wholeNumber(label, { min = 0 } = {}) {
  return (value) => {
    const text = String(value ?? '').trim()
    if (!text) return `${label} is required.`
    if (!/^\d+$/.test(text) || Number(text) < min) {
      return min > 0
        ? `${label} must be a whole number greater than 0.`
        : `${label} must be a whole number of 0 or more.`
    }
    return ''
  }
}

export function cgpaValue() {
  return (value) => {
    if (value === '' || value === null || value === undefined) return 'CGPA is required.'
    const number = Number(value)
    if (!Number.isFinite(number) || number < 0 || number > 10) return 'CGPA must be between 0 and 10.'
    return ''
  }
}

export function validDate(label) {
  return (value) => {
    const text = String(value ?? '')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return `${label} is required.`
    const [year, month, day] = text.split('-').map(Number)
    const parsed = new Date(`${text}T00:00:00`)
    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.getFullYear() !== year ||
      parsed.getMonth() + 1 !== month ||
      parsed.getDate() !== day
    ) {
      return `Enter a valid ${label.toLowerCase()}.`
    }
    return ''
  }
}

export function driveDeadline() {
  return (value, values) => {
    const message = validDate('Deadline')(value)
    if (message) return message
    if (values.status === 'Open' && value < todayIso()) {
      return 'An open drive needs a deadline of today or later.'
    }
    return ''
  }
}

// Local sample records for the browser preview.
// These values are not loaded from PostgreSQL or the Spring Boot API.

export const roleProfiles = {
  student: {
    name: 'Ananya Sharma',
    roleLabel: 'Student',
    home: '/student',
  },
  team: {
    name: 'Rahul Mehta',
    roleLabel: 'Placement Team Member',
    home: '/team',
  },
  officer: {
    name: 'Dr. Kavita Iyer',
    roleLabel: 'Placement Officer',
    home: '/officer',
  },
}

export const sampleStudent = {
  name: 'Ananya Sharma',
  rollNo: 'CS2022-041',
  department: 'Computer Science',
  batch: '2026',
  cgpa: 8.6,
  backlogs: 0,
  tenth: 91,
  twelfth: 94,
  phone: '+91 98450 11220',
  skills: ['Java', 'SQL', 'React'],
}

export const drives = [
  {
    id: 'DRV-104',
    company: 'Northwind Labs',
    role: 'Software Engineer',
    packageLpa: 12,
    location: 'Bengaluru',
    deadline: '18 Nov 2026',
    minCgpa: 7.5,
    maxBacklogs: 0,
    branches: ['Computer Science', 'Information Technology'],
    status: 'Open',
    applicants: 86,
  },
  {
    id: 'DRV-109',
    company: 'Helios Finance',
    role: 'Business Analyst',
    packageLpa: 9,
    location: 'Hyderabad',
    deadline: '20 Nov 2026',
    minCgpa: 7,
    maxBacklogs: 1,
    branches: ['Computer Science', 'Electronics'],
    status: 'Open',
    applicants: 54,
  },
  {
    id: 'DRV-112',
    company: 'Aster Works',
    role: 'Graduate Engineer',
    packageLpa: 6.5,
    location: 'Pune',
    deadline: '22 Nov 2026',
    minCgpa: 6.5,
    maxBacklogs: 1,
    branches: ['Mechanical'],
    status: 'Open',
    applicants: 41,
  },
  {
    id: 'DRV-098',
    company: 'Orbit Systems',
    role: 'Frontend Engineer',
    packageLpa: 14,
    location: 'Remote',
    deadline: '28 Oct 2026',
    minCgpa: 8,
    maxBacklogs: 0,
    branches: ['Computer Science', 'Information Technology'],
    status: 'Closed',
    applicants: 120,
  },
  {
    id: 'DRV-116',
    company: 'Lumen Health',
    role: 'Data Analyst',
    packageLpa: 10,
    location: 'Chennai',
    deadline: '25 Nov 2026',
    minCgpa: 7.5,
    maxBacklogs: 0,
    branches: ['Computer Science', 'Information Technology', 'Electronics'],
    status: 'Open',
    applicants: 63,
  },
]

export const applications = [
  {
    id: 'APP-318',
    company: 'Northwind Labs',
    role: 'Software Engineer',
    appliedOn: '2 Nov 2026',
    status: 'Shortlisted',
  },
  {
    id: 'APP-302',
    company: 'Orbit Systems',
    role: 'Frontend Engineer',
    appliedOn: '20 Oct 2026',
    status: 'Offered',
  },
  {
    id: 'APP-276',
    company: 'Helios Finance',
    role: 'Business Analyst',
    appliedOn: '5 Nov 2026',
    status: 'Applied',
  },
  {
    id: 'APP-241',
    company: 'Lumen Health',
    role: 'Data Analyst',
    appliedOn: '15 Oct 2026',
    status: 'Rejected',
  },
]

export const companies = [
  { id: 'CMP-01', name: 'Northwind Labs', industry: 'Software', contact: 'Priya Raman', status: 'Active' },
  { id: 'CMP-02', name: 'Helios Finance', industry: 'Banking', contact: 'Arun Desai', status: 'Active' },
  { id: 'CMP-03', name: 'Aster Works', industry: 'Manufacturing', contact: 'Neha Kulkarni', status: 'Active' },
  { id: 'CMP-04', name: 'Orbit Systems', industry: 'Software', contact: 'Vikram Shah', status: 'Active' },
  { id: 'CMP-05', name: 'Lumen Health', industry: 'Healthcare', contact: 'Sana Iqbal', status: 'On hold' },
]

export const jobRoles = [
  { id: 'ROL-11', title: 'Software Engineer', company: 'Northwind Labs', type: 'Full-time', packageLpa: 12, openings: 8 },
  { id: 'ROL-12', title: 'Business Analyst', company: 'Helios Finance', type: 'Full-time', packageLpa: 9, openings: 5 },
  { id: 'ROL-13', title: 'Graduate Engineer', company: 'Aster Works', type: 'Full-time', packageLpa: 6.5, openings: 10 },
  { id: 'ROL-14', title: 'Frontend Engineer', company: 'Orbit Systems', type: 'Full-time', packageLpa: 14, openings: 4 },
  { id: 'ROL-15', title: 'Data Analyst', company: 'Lumen Health', type: 'Full-time', packageLpa: 10, openings: 6 },
  { id: 'ROL-16', title: 'QA Intern', company: 'Northwind Labs', type: 'Internship', packageLpa: 4, openings: 12 },
]

export const students = [
  { id: 'STU-041', name: 'Ananya Sharma', department: 'Computer Science', cgpa: 8.6, status: 'Offered' },
  { id: 'STU-018', name: 'Vikram Rao', department: 'Computer Science', cgpa: 8.1, status: 'Selected' },
  { id: 'STU-077', name: 'Meera Nair', department: 'Electronics', cgpa: 7.8, status: 'In process' },
  { id: 'STU-023', name: 'Arjun Patel', department: 'Information Technology', cgpa: 8.4, status: 'Offered' },
  { id: 'STU-054', name: 'Sana Iqbal', department: 'Computer Science', cgpa: 7.2, status: 'Registered' },
  { id: 'STU-061', name: 'Rohit Menon', department: 'Mechanical', cgpa: 7.5, status: 'In process' },
  { id: 'STU-033', name: 'Divya Krishnan', department: 'Information Technology', cgpa: 9.0, status: 'Selected' },
  { id: 'STU-090', name: 'Karan Joshi', department: 'Electronics', cgpa: 6.9, status: 'Registered' },
]

export const departmentStats = [
  { id: 'DEP-CS', department: 'Computer Science', registered: 120, placed: 74 },
  { id: 'DEP-IT', department: 'Information Technology', registered: 96, placed: 51 },
  { id: 'DEP-EC', department: 'Electronics', registered: 88, placed: 39 },
  { id: 'DEP-ME', department: 'Mechanical', registered: 76, placed: 28 },
]

export const selections = [
  { id: 'SEL-501', student: 'Ananya Sharma', company: 'Northwind Labs', round: 'Technical', result: 'Shortlisted' },
  { id: 'SEL-502', student: 'Vikram Rao', company: 'Northwind Labs', round: 'HR', result: 'Selected' },
  { id: 'SEL-503', student: 'Meera Nair', company: 'Helios Finance', round: 'Aptitude', result: 'Cleared' },
  { id: 'SEL-504', student: 'Arjun Patel', company: 'Lumen Health', round: 'Technical', result: 'Selected' },
  { id: 'SEL-505', student: 'Rohit Menon', company: 'Aster Works', round: 'Technical', result: 'Waiting' },
  { id: 'SEL-506', student: 'Sana Iqbal', company: 'Orbit Systems', round: 'Aptitude', result: 'Rejected' },
]

export const offers = [
  { id: 'OFR-21', student: 'Ananya Sharma', company: 'Orbit Systems', role: 'Frontend Engineer', packageLpa: 14, status: 'Accepted' },
  { id: 'OFR-22', student: 'Vikram Rao', company: 'Northwind Labs', role: 'Software Engineer', packageLpa: 12, status: 'Accepted' },
  { id: 'OFR-23', student: 'Meera Nair', company: 'Helios Finance', role: 'Business Analyst', packageLpa: 9, status: 'Released' },
  { id: 'OFR-24', student: 'Arjun Patel', company: 'Lumen Health', role: 'Data Analyst', packageLpa: 10, status: 'Released' },
  { id: 'OFR-25', student: 'Divya Krishnan', company: 'Orbit Systems', role: 'Frontend Engineer', packageLpa: 14, status: 'Declined' },
]

export function isEligible(student, drive) {
  return (
    drive.branches.includes(student.department) &&
    student.cgpa >= drive.minCgpa &&
    student.backlogs <= drive.maxBacklogs
  )
}

export function matchesQuery(query, values) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return values.some((value) => String(value).toLowerCase().includes(needle))
}

export function formatPackage(value) {
  return `${value} LPA`
}

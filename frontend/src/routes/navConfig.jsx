import {
  BadgeCheck,
  Briefcase,
  Building,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  FileText,
  LayoutDashboard,
  ListChecks,
  ScrollText,
  UserRound,
  Users,
} from 'lucide-react'

export const studentNav = [
  {
    label: 'Student',
    items: [
      { to: '/student', label: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/student/profile', label: 'Profile', icon: UserRound },
      { to: '/student/drives', label: 'Placement drives', icon: Briefcase },
      { to: '/student/eligibility', label: 'Eligibility', icon: BadgeCheck },
      { to: '/student/applications', label: 'My applications', icon: FileText },
      { to: '/student/status', label: 'Application status', icon: ClipboardList },
    ],
  },
]

export const teamNav = [
  {
    label: 'Placement team',
    items: [
      { to: '/team', label: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/team/companies', label: 'Companies', icon: Building },
      { to: '/team/roles', label: 'Job roles', icon: Briefcase },
      { to: '/team/drives', label: 'Placement drives', icon: CalendarDays },
      { to: '/team/eligibility', label: 'Eligibility', icon: BadgeCheck },
    ],
  },
]

export const officerNav = [
  {
    label: 'Placement officer',
    items: [
      { to: '/officer', label: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/officer/students', label: 'Students', icon: Users },
      { to: '/officer/statistics', label: 'Statistics', icon: ChartColumn },
      { to: '/officer/selections', label: 'Selections', icon: ListChecks },
      { to: '/officer/offers', label: 'Offers', icon: ScrollText },
    ],
  },
]

import {
  BadgeCheck,
  Briefcase,
  Building,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  FileText,
  HelpCircle,
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
      { to: '/student/drives', label: 'Register for companies', icon: Briefcase },
      { to: '/student/eligibility', label: 'Eligibility', icon: BadgeCheck },
      { to: '/student/applications', label: 'My applications', icon: FileText },
      { to: '/student/status', label: 'Application status', icon: ClipboardList },
      { to: '/student/faq', label: 'FAQ & Guidelines', icon: HelpCircle },
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
      { to: '/team/eligibility', label: 'Selection rounds', icon: ListChecks },
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

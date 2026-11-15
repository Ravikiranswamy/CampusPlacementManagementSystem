import {
  Briefcase,
  Building,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  FileDown,
  FileText,
  HelpCircle,
  Home,
  LayoutDashboard,
  ListChecks,
  MessageSquareQuote,
  ScrollText,
  UserCheck,
  UserRound,
  Users,
} from 'lucide-react'

export const studentNav = [
  {
    label: 'Student',
    items: [
      { to: '/student', label: 'Home', icon: Home, end: true },
      { to: '/student/status', label: 'Application status', icon: ClipboardList },
      { to: '/student/profile', label: 'Profile', icon: UserRound },
      { to: '/student/jds', label: 'Job descriptions', icon: FileDown },
      { to: '/student/feedback', label: 'Interview feedback', icon: MessageSquareQuote },
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
      { to: '/officer/team', label: 'Placement team', icon: UserCheck },
      { to: '/officer/statistics', label: 'Statistics', icon: ChartColumn },
      { to: '/officer/selections', label: 'Selections', icon: ListChecks },
      { to: '/officer/offers', label: 'Offers', icon: ScrollText },
    ],
  },
]

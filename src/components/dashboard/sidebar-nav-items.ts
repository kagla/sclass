import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  UtensilsCrossed,
  Trophy,
  MessageSquare,
} from "lucide-react"

export const navItems = [
  {
    title: "대시보드",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "TEACHER", "PARENT", "STUDENT"],
  },
  {
    title: "학원 관리",
    href: "/dashboard/academy",
    icon: Building2,
    roles: ["ADMIN"],
  },
  {
    title: "강사 관리",
    href: "/dashboard/teachers",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "학생 관리",
    href: "/dashboard/students",
    icon: GraduationCap,
    roles: ["ADMIN", "TEACHER"],
  },
  {
    title: "학부모 관리",
    href: "/dashboard/parents",
    icon: UserCheck,
    roles: ["ADMIN"],
  },
  {
    title: "과목 관리",
    href: "/dashboard/subjects",
    icon: BookOpen,
    roles: ["ADMIN", "TEACHER"],
  },
  {
    title: "시간표",
    href: "/dashboard/schedules",
    icon: Calendar,
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    title: "수납 관리",
    href: "/dashboard/payments",
    icon: CreditCard,
    roles: ["ADMIN", "PARENT"],
  },
  {
    title: "게시판",
    href: "/dashboard/boards",
    icon: FileText,
    roles: ["ADMIN", "TEACHER", "PARENT", "STUDENT"],
  },
  {
    title: "식단표",
    href: "/dashboard/meal-plans",
    icon: UtensilsCrossed,
    roles: ["ADMIN"],
  },
  {
    title: "합격수기",
    href: "/dashboard/stories",
    icon: Trophy,
    roles: ["ADMIN"],
  },
  {
    title: "상담 관리",
    href: "/dashboard/consultations",
    icon: MessageSquare,
    roles: ["ADMIN"],
  },
]

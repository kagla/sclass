import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, UserCheck, BookOpen, CreditCard, MessageSquare } from "lucide-react"

export const metadata = { title: "대시보드" }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const isAdmin = session.user.role === "ADMIN"

  const [
    teacherCount,
    studentCount,
    parentCount,
    subjectCount,
    paymentCount,
    consultationCount,
  ] = isAdmin
    ? await Promise.all([
        prisma.teacher.count(),
        prisma.student.count(),
        prisma.parent.count(),
        prisma.subject.count(),
        prisma.payment.count({ where: { status: "PAID" } }),
        prisma.consultation.count({ where: { status: "PENDING" } }),
      ])
    : [0, 0, 0, 0, 0, 0]

  const stats = [
    { title: "강사", value: teacherCount, icon: Users, href: "/dashboard/teachers" },
    { title: "학생", value: studentCount, icon: GraduationCap, href: "/dashboard/students" },
    { title: "학부모", value: parentCount, icon: UserCheck, href: "/dashboard/parents" },
    { title: "과목", value: subjectCount, icon: BookOpen, href: "/dashboard/subjects" },
    { title: "결제 완료", value: paymentCount, icon: CreditCard, href: "/dashboard/payments" },
    { title: "대기중 상담", value: consultationCount, icon: MessageSquare, href: "/dashboard/consultations" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          안녕하세요, {session.user.name}님
        </h1>
        <p className="text-muted-foreground">S-Class 학원 관리 시스템입니다.</p>
      </div>

      {isAdmin && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

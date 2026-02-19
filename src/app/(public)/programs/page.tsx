import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users } from "lucide-react"

export const metadata = { title: "교육과정" }

const ACADEMY_ID = "default-academy"

export default async function ProgramsPage() {
  const subjects = await prisma.subject.findMany({
    where: { academyId: ACADEMY_ID, isActive: true },
    include: {
      teacherSubjects: {
        include: { teacher: { include: { user: { select: { name: true } } } } },
      },
      _count: {
        select: { enrollments: { where: { status: "ACTIVE" } } },
      },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              교육과정
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              체계적이고 전문적인 교육 프로그램을 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {subjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <Card
                  key={subject.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg bg-primary/10 p-2.5">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      {subject.level && (
                        <Badge variant="outline">{subject.level}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {subject.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {subject.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {subject.teacherSubjects.length > 0 && (
                        <span>
                          담당:{" "}
                          {subject.teacherSubjects
                            .map((ts) => ts.teacher.user.name)
                            .join(", ")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>수강생 {subject._count.enrollments}명</span>
                      </div>
                      {subject.maxStudents && (
                        <span>정원 {subject.maxStudents}명</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border text-muted-foreground">
              등록된 교육과정이 없습니다.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

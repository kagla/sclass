import { prisma } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const metadata = { title: "강사소개" }

const ACADEMY_ID = "default-academy"

export default async function FacultyPage() {
  const teachers = await prisma.teacher.findMany({
    where: { academyId: ACADEMY_ID, isActive: true },
    include: {
      user: { select: { name: true, image: true } },
      teacherSubjects: {
        include: { subject: { select: { name: true } } },
      },
    },
    orderBy: { hireDate: "asc" },
  })

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              강사소개
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              풍부한 경험과 전문성을 갖춘 강사진을 소개합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {teachers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={teacher.profileImageUrl || teacher.user.image || undefined}
                        />
                        <AvatarFallback className="text-lg">
                          {teacher.user.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="mt-4 text-lg font-semibold">
                        {teacher.user.name}
                      </h3>
                      {teacher.specialization && (
                        <p className="mt-1 text-sm text-primary">
                          {teacher.specialization}
                        </p>
                      )}
                      {teacher.teacherSubjects.length > 0 && (
                        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                          {teacher.teacherSubjects.map((ts) => (
                            <Badge key={ts.id} variant="outline" className="text-xs">
                              {ts.subject.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {teacher.bio && (
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-4">
                          {teacher.bio}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border text-muted-foreground">
              등록된 강사가 없습니다.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

import { notFound } from "next/navigation"
import { getSubject } from "@/actions/subject"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { ENROLLMENT_STATUS_LABELS } from "@/lib/constants"

export const metadata = { title: "과목 상세" }

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const subject = await getSubject(id)
  if (!subject) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{subject.name}</h1>
          {subject.level && (
            <p className="text-muted-foreground">레벨: {subject.level}</p>
          )}
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/subjects/${id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">과목명</span>
              <span>{subject.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">레벨</span>
              <span>{subject.level || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">최대 수강인원</span>
              <span>{subject.maxStudents ? `${subject.maxStudents}명` : "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">현재 수강생</span>
              <span>
                {subject.enrollments.filter((e) => e.status === "ACTIVE").length}명
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">상태</span>
              <Badge variant={subject.isActive ? "default" : "secondary"}>
                {subject.isActive ? "활성" : "비활성"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">담당 강사</CardTitle>
          </CardHeader>
          <CardContent>
            {subject.teacherSubjects.length > 0 ? (
              <div className="space-y-2">
                {subject.teacherSubjects.map((ts) => (
                  <div key={ts.id} className="flex items-center justify-between text-sm">
                    <span>{ts.teacher.user.name}</span>
                    <span className="text-muted-foreground">{ts.teacher.user.email}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">배정된 강사가 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {subject.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">설명</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{subject.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            수강생 목록 ({subject.enrollments.length}명)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subject.enrollments.length > 0 ? (
            <div className="space-y-2">
              {subject.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-center justify-between text-sm border-b pb-2 last:border-0"
                >
                  <div>
                    <Link
                      href={`/dashboard/students/${enrollment.student.id}`}
                      className="font-medium hover:underline"
                    >
                      {enrollment.student.user.name}
                    </Link>
                    <span className="ml-2 text-muted-foreground">
                      {enrollment.student.user.email}
                    </span>
                  </div>
                  <Badge
                    variant={
                      enrollment.status === "ACTIVE"
                        ? "default"
                        : enrollment.status === "COMPLETED"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {ENROLLMENT_STATUS_LABELS[enrollment.status] || enrollment.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">수강생이 없습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

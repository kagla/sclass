import { notFound } from "next/navigation"
import { getStudent } from "@/actions/student"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { ENROLLMENT_STATUS_LABELS } from "@/lib/constants"

export const metadata = { title: "학생 상세" }

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const student = await getStudent(id)
  if (!student) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{student.user.name}</h1>
          <p className="text-muted-foreground">{student.user.email}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/students/${id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">기본 정보</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">학년</span>
              <span>{student.grade || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">학교</span>
              <span>{student.school || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">연락처</span>
              <span>{student.user.phone || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">상태</span>
              <Badge variant={student.isActive ? "default" : "secondary"}>
                {student.isActive ? "수강중" : "퇴원"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">학부모</CardTitle></CardHeader>
          <CardContent>
            {student.studentParents.length > 0 ? (
              <div className="space-y-2 text-sm">
                {student.studentParents.map((sp) => (
                  <div key={sp.parent.id} className="flex justify-between">
                    <span>{sp.parent.user.name}</span>
                    <span className="text-muted-foreground">{sp.parent.user.phone || "-"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">등록된 학부모가 없습니다.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">수강 과목</CardTitle></CardHeader>
          <CardContent>
            {student.enrollments.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {student.enrollments.map((e) => (
                  <Badge key={e.id} variant="outline">
                    {e.subject.name} ({ENROLLMENT_STATUS_LABELS[e.status]})
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">수강중인 과목이 없습니다.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">최근 성적</CardTitle></CardHeader>
          <CardContent>
            {student.grades.length > 0 ? (
              <div className="space-y-2 text-sm">
                {student.grades.map((g) => (
                  <div key={g.id} className="flex justify-between">
                    <span>{g.subject.name} - {g.examName}</span>
                    <span className="font-medium">{String(g.score)} / {String(g.maxScore)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">성적 기록이 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

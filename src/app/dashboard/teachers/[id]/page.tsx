import { notFound } from "next/navigation"
import { getTeacher } from "@/actions/teacher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil } from "lucide-react"

export const metadata = { title: "강사 상세" }

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const teacher = await getTeacher(id)
  if (!teacher) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{teacher.user.name}</h1>
          <p className="text-muted-foreground">{teacher.user.email}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/teachers/${id}/edit`}>
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
              <span className="text-muted-foreground">연락처</span>
              <span>{teacher.user.phone || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">전문 분야</span>
              <span>{teacher.specialization || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">상태</span>
              <Badge variant={teacher.isActive ? "default" : "secondary"}>
                {teacher.isActive ? "활성" : "비활성"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">담당 과목</CardTitle>
          </CardHeader>
          <CardContent>
            {teacher.teacherSubjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teacher.teacherSubjects.map((ts) => (
                  <Badge key={ts.id} variant="outline">
                    {ts.subject.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">배정된 과목이 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {teacher.bio && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">소개</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{teacher.bio}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

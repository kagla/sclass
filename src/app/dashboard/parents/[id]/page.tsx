import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil } from "lucide-react"

export const metadata = { title: "학부모 상세" }

export default async function ParentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const parent = await prisma.parent.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      studentParents: {
        include: { student: { include: { user: { select: { name: true, phone: true } } } } },
      },
    },
  })
  if (!parent) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{parent.user.name}</h1>
          <p className="text-muted-foreground">{parent.user.email}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/parents/${id}/edit`}>
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
              <span className="text-muted-foreground">연락처</span>
              <span>{parent.user.phone || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">관계</span>
              <span>{parent.relationship || "-"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">자녀</CardTitle></CardHeader>
          <CardContent>
            {parent.studentParents.length > 0 ? (
              <div className="space-y-2 text-sm">
                {parent.studentParents.map((sp) => (
                  <div key={sp.student.id} className="flex justify-between">
                    <Link href={`/dashboard/students/${sp.student.id}`} className="hover:underline">
                      {sp.student.user.name}
                    </Link>
                    <span className="text-muted-foreground">{sp.student.user.phone || "-"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">등록된 자녀가 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

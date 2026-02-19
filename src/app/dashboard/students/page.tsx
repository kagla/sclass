import Link from "next/link"
import { getStudents } from "@/actions/student"
import { DataTable } from "@/components/dashboard/data-table"
import { studentColumns } from "@/components/dashboard/students/columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata = { title: "학생 관리" }

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const result = await getStudents({
    page: Number(params.page) || 1,
    search: params.search || "",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">학생 관리</h1>
          <p className="text-muted-foreground">총 {result.total}명의 학생</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/students/new">
            <Plus className="mr-2 h-4 w-4" />
            학생 등록
          </Link>
        </Button>
      </div>
      <DataTable
        columns={studentColumns}
        data={result.data}
        totalPages={result.pageCount}
        currentPage={result.currentPage}
        searchPlaceholder="이름으로 검색..."
      />
    </div>
  )
}

import Link from "next/link"
import { getTeachers } from "@/actions/teacher"
import { DataTable } from "@/components/dashboard/data-table"
import { teacherColumns } from "@/components/dashboard/teachers/columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata = { title: "강사 관리" }

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""

  const result = await getTeachers({ page, search })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">강사 관리</h1>
          <p className="text-muted-foreground">총 {result.total}명의 강사</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/teachers/new">
            <Plus className="mr-2 h-4 w-4" />
            강사 등록
          </Link>
        </Button>
      </div>
      <DataTable
        columns={teacherColumns}
        data={result.data}
        totalPages={result.pageCount}
        currentPage={result.currentPage}
        searchPlaceholder="이름으로 검색..."
      />
    </div>
  )
}

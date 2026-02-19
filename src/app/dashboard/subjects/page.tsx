import Link from "next/link"
import { getSubjects } from "@/actions/subject"
import { DataTable } from "@/components/dashboard/data-table"
import { subjectColumns } from "@/components/dashboard/subjects/columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata = { title: "과목 관리" }

export default async function SubjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""

  const result = await getSubjects({ page, search })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">과목 관리</h1>
          <p className="text-muted-foreground">총 {result.total}개의 과목</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/subjects/new">
            <Plus className="mr-2 h-4 w-4" />
            과목 등록
          </Link>
        </Button>
      </div>
      <DataTable
        columns={subjectColumns}
        data={result.data}
        totalPages={result.pageCount}
        currentPage={result.currentPage}
        searchPlaceholder="과목명으로 검색..."
      />
    </div>
  )
}

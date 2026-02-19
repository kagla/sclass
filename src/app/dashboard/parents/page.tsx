import Link from "next/link"
import { getParents } from "@/actions/parent"
import { DataTable } from "@/components/dashboard/data-table"
import { parentColumns } from "@/components/dashboard/parents/columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata = { title: "학부모 관리" }

export default async function ParentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const result = await getParents({
    page: Number(params.page) || 1,
    search: params.search || "",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">학부모 관리</h1>
          <p className="text-muted-foreground">총 {result.total}명의 학부모</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/parents/new">
            <Plus className="mr-2 h-4 w-4" />
            학부모 등록
          </Link>
        </Button>
      </div>
      <DataTable
        columns={parentColumns}
        data={result.data}
        totalPages={result.pageCount}
        currentPage={result.currentPage}
        searchPlaceholder="이름으로 검색..."
      />
    </div>
  )
}

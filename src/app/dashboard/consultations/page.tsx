import { getConsultations } from "@/actions/consultation"
import { DataTable } from "@/components/dashboard/data-table"
import { consultationColumns } from "@/components/dashboard/consultations/columns"

export const metadata = { title: "상담 관리" }

export default async function ConsultationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const result = await getConsultations({
    page: Number(params.page) || 1,
    search: params.search || "",
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">상담 관리</h1>
        <p className="text-muted-foreground">총 {result.total}건의 상담 신청</p>
      </div>
      <DataTable
        columns={consultationColumns}
        data={result.data}
        totalPages={result.pageCount}
        currentPage={result.currentPage}
        searchPlaceholder="학부모명 또는 학생명으로 검색..."
      />
    </div>
  )
}

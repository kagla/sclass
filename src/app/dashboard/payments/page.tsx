import Link from "next/link"
import { getPayments } from "@/actions/payment"
import { DataTable } from "@/components/dashboard/data-table"
import { paymentColumns } from "@/components/dashboard/payments/columns"
import { Button } from "@/components/ui/button"
import { Plus, CreditCard } from "lucide-react"

export const metadata = { title: "결제 관리" }

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const result = await getPayments({
    page: Number(params.page) || 1,
    search: params.search || "",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">결제 관리</h1>
          <p className="text-muted-foreground">총 {result.total}건의 결제</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/payments/subscriptions">
              <CreditCard className="mr-2 h-4 w-4" />
              정기결제
            </Link>
          </Button>
          <Button asChild>
            <Link href="/payments/new">
              <Plus className="mr-2 h-4 w-4" />
              새 결제
            </Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={paymentColumns}
        data={result.data}
        totalPages={result.pageCount}
        currentPage={result.currentPage}
        searchPlaceholder="학생명 또는 주문번호로 검색..."
      />
    </div>
  )
}

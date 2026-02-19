import { getSubscriptions } from "@/actions/subscription"
import { SubscriptionCard } from "@/components/dashboard/payments/subscription-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "정기결제 관리" }

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const result = await getSubscriptions({
    page: Number(params.page) || 1,
    search: params.search || "",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/payments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">정기결제 관리</h1>
          <p className="text-muted-foreground">총 {result.total}건의 정기결제</p>
        </div>
      </div>

      {result.data.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {result.data.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-md border text-muted-foreground">
          등록된 정기결제가 없습니다.
        </div>
      )}
    </div>
  )
}

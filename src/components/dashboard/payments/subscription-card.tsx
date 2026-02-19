"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SUBSCRIPTION_STATUS_LABELS } from "@/lib/constants"
import { pauseSubscription, cancelSubscription, resumeSubscription } from "@/actions/subscription"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Pause, Play, X, Calendar, CreditCard } from "lucide-react"
import { format } from "date-fns"

interface SubscriptionCardProps {
  subscription: {
    id: string
    status: string
    startDate: Date
    endDate: Date | null
    nextPaymentDate: Date | null
    pausedAt: Date | null
    cancelledAt: Date | null
    student: {
      user: { name: string | null }
    }
    feeStructure: {
      name: string
      amount: unknown
      subject: { name: string }
    }
  }
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "default",
  PAUSED: "outline",
  CANCELLED: "destructive",
  EXPIRED: "secondary",
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const router = useRouter()

  const handlePause = async () => {
    if (!confirm("정기결제를 일시정지하시겠습니까?")) return
    const result = await pauseSubscription(subscription.id)
    if (result.error) toast.error(result.error)
    else {
      toast.success("정기결제가 일시정지되었습니다")
      router.refresh()
    }
  }

  const handleCancel = async () => {
    if (!confirm("정기결제를 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return
    const result = await cancelSubscription(subscription.id)
    if (result.error) toast.error(result.error)
    else {
      toast.success("정기결제가 취소되었습니다")
      router.refresh()
    }
  }

  const handleResume = async () => {
    const result = await resumeSubscription(subscription.id)
    if (result.error) toast.error(result.error)
    else {
      toast.success("정기결제가 재개되었습니다")
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-medium">
          {subscription.student.user.name} - {subscription.feeStructure.subject.name}
        </CardTitle>
        <Badge variant={statusVariants[subscription.status] || "outline"}>
          {SUBSCRIPTION_STATUS_LABELS[subscription.status] || subscription.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>{subscription.feeStructure.name}</span>
            <span className="ml-auto font-medium text-foreground">
              {Number(subscription.feeStructure.amount).toLocaleString()}원/월
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>시작일: {format(new Date(subscription.startDate), "yyyy-MM-dd")}</span>
          </div>
          {subscription.nextPaymentDate && subscription.status === "ACTIVE" && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>다음 결제: {format(new Date(subscription.nextPaymentDate), "yyyy-MM-dd")}</span>
            </div>
          )}
          {subscription.pausedAt && (
            <p className="text-xs text-muted-foreground">
              일시정지: {format(new Date(subscription.pausedAt), "yyyy-MM-dd")}
            </p>
          )}
          {subscription.cancelledAt && (
            <p className="text-xs text-muted-foreground">
              취소일: {format(new Date(subscription.cancelledAt), "yyyy-MM-dd")}
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          {subscription.status === "ACTIVE" && (
            <>
              <Button variant="outline" size="sm" onClick={handlePause}>
                <Pause className="mr-1 h-3 w-3" />
                일시정지
              </Button>
              <Button variant="destructive" size="sm" onClick={handleCancel}>
                <X className="mr-1 h-3 w-3" />
                취소
              </Button>
            </>
          )}
          {subscription.status === "PAUSED" && (
            <>
              <Button variant="default" size="sm" onClick={handleResume}>
                <Play className="mr-1 h-3 w-3" />
                재개
              </Button>
              <Button variant="destructive" size="sm" onClick={handleCancel}>
                <X className="mr-1 h-3 w-3" />
                취소
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

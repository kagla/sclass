import { notFound } from "next/navigation"
import { getPaymentDetail } from "@/actions/payment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { PAYMENT_STATUS_LABELS } from "@/lib/constants"
import { format } from "date-fns"

export const metadata = { title: "결제 상세" }

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  PAID: "default",
  FAILED: "destructive",
  CANCELLED: "secondary",
  REFUNDED: "secondary",
}

const methodLabels: Record<string, string> = {
  CARD: "카드",
  BANK_TRANSFER: "계좌이체",
  VIRTUAL_ACCOUNT: "가상계좌",
  SUBSCRIPTION: "정기결제",
}

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const payment = await getPaymentDetail(id)
  if (!payment) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/payments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">결제 상세</h1>
          <p className="font-mono text-sm text-muted-foreground">{payment.merchantUid}</p>
        </div>
        <div className="ml-auto">
          <Badge variant={statusVariants[payment.status] || "outline"} className="text-sm">
            {PAYMENT_STATUS_LABELS[payment.status] || payment.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">결제 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">주문번호</span>
              <span className="font-mono">{payment.merchantUid}</span>
            </div>
            {payment.impUid && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">PortOne UID</span>
                <span className="font-mono">{payment.impUid}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">금액</span>
              <span className="text-lg font-bold">
                {Number(payment.amount).toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">결제수단</span>
              <span>{methodLabels[payment.method] || payment.method}</span>
            </div>
            {payment.description && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">설명</span>
                <span>{payment.description}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">생성일</span>
              <span>{format(new Date(payment.createdAt), "yyyy-MM-dd HH:mm")}</span>
            </div>
            {payment.paidAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제일</span>
                <span>{format(new Date(payment.paidAt), "yyyy-MM-dd HH:mm")}</span>
              </div>
            )}
            {payment.failReason && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">실패사유</span>
                <span className="text-destructive">{payment.failReason}</span>
              </div>
            )}
            {payment.receiptUrl && (
              <div className="pt-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    영수증 보기
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">학생 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">이름</span>
              <Link href={`/students/${payment.student.id}`} className="hover:underline">
                {payment.student.user.name}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">이메일</span>
              <span>{payment.student.user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">연락처</span>
              <span>{payment.student.user.phone || "-"}</span>
            </div>
            {payment.subscription && (
              <>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">정기결제</span>
                  <span>{payment.subscription.feeStructure.name}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

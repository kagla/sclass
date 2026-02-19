"use client"

import { useState } from "react"
import * as PortOne from "@portone/browser-sdk/v2"
import { Button } from "@/components/ui/button"
import { createPaymentRecord, verifyPaymentAction } from "@/actions/payment"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CreditCard, Loader2 } from "lucide-react"

interface PaymentButtonProps {
  studentId: string
  amount: number
  description: string
  onSuccess?: () => void
}

export function PaymentButton({
  studentId,
  amount,
  description,
  onSuccess,
}: PaymentButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    setIsPending(true)

    try {
      const result = await createPaymentRecord(studentId, amount, description)

      if ("error" in result) {
        toast.error(result.error)
        setIsPending(false)
        return
      }

      const response = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
        paymentId: result.merchantUid,
        orderName: description,
        totalAmount: amount,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
      })

      if (response?.code) {
        toast.error(response.message || "결제가 취소되었습니다")
        setIsPending(false)
        return
      }

      const verifyResult = await verifyPaymentAction(result.merchantUid)

      if (verifyResult.success) {
        toast.success("결제가 완료되었습니다")
        onSuccess?.()
        router.push(`/payments/${result.paymentId}`)
        router.refresh()
      } else {
        toast.error(verifyResult.error || "결제 검증에 실패했습니다")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("결제 처리 중 오류가 발생했습니다")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={isPending || amount <= 0}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          처리 중...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {amount.toLocaleString()}원 결제하기
        </>
      )}
    </Button>
  )
}

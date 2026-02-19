import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyPayment } from "@/lib/payment/portone"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imp_uid, merchant_uid, status } = body

    if (!merchant_uid) {
      return NextResponse.json({ error: "merchant_uid is required" }, { status: 400 })
    }

    const payment = await prisma.payment.findUnique({
      where: { merchantUid: merchant_uid },
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    if (payment.status === "PAID") {
      return NextResponse.json({ message: "Already processed" })
    }

    if (status === "paid" && imp_uid) {
      try {
        const portonePayment = await verifyPayment(imp_uid)

        if (
          portonePayment.status === "paid" &&
          portonePayment.amount === Number(payment.amount)
        ) {
          await prisma.payment.update({
            where: { merchantUid: merchant_uid },
            data: {
              status: "PAID",
              impUid: portonePayment.imp_uid,
              paidAt: new Date(portonePayment.paid_at * 1000),
              receiptUrl: portonePayment.receipt_url || null,
            },
          })

          return NextResponse.json({ message: "Payment verified and updated" })
        } else {
          await prisma.payment.update({
            where: { merchantUid: merchant_uid },
            data: {
              status: "FAILED",
              impUid: imp_uid,
              failReason: "결제 금액 불일치 또는 검증 실패",
            },
          })

          return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 400 }
          )
        }
      } catch (error) {
        console.error("PortOne verification error:", error)
        await prisma.payment.update({
          where: { merchantUid: merchant_uid },
          data: {
            status: "FAILED",
            impUid: imp_uid,
            failReason: "PortOne 검증 중 오류 발생",
          },
        })

        return NextResponse.json(
          { error: "Verification failed" },
          { status: 500 }
        )
      }
    }

    if (status === "cancelled") {
      await prisma.payment.update({
        where: { merchantUid: merchant_uid },
        data: {
          status: "CANCELLED",
          impUid: imp_uid || payment.impUid,
        },
      })

      return NextResponse.json({ message: "Payment cancelled" })
    }

    if (status === "failed") {
      await prisma.payment.update({
        where: { merchantUid: merchant_uid },
        data: {
          status: "FAILED",
          impUid: imp_uid || payment.impUid,
          failReason: "결제 실패 (Webhook)",
        },
      })

      return NextResponse.json({ message: "Payment failed" })
    }

    return NextResponse.json({ message: "Webhook received" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

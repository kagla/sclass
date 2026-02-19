"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { verifyPayment } from "@/lib/payment/portone"
import { revalidatePath } from "next/cache"
import { ITEMS_PER_PAGE } from "@/lib/constants"

const ACADEMY_ID = "default-academy"

export async function getPayments(params: {
  page?: number
  search?: string
  studentId?: string
}) {
  const session = await auth()
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    throw new Error("권한이 없습니다")
  }

  const page = params.page || 1

  const where: Record<string, unknown> = {}
  if (params.studentId) {
    where.studentId = params.studentId
  }
  if (params.search) {
    where.OR = [
      { description: { contains: params.search } },
      { merchantUid: { contains: params.search } },
      { student: { user: { name: { contains: params.search } } } },
    ]
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        student: {
          include: { user: { select: { name: true } } },
        },
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.payment.count({ where }),
  ])

  return {
    data: payments,
    total,
    pageCount: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  }
}

export async function createPaymentRecord(
  studentId: string,
  amount: number,
  description: string
) {
  const session = await auth()
  if (!session) {
    return { error: "로그인이 필요합니다" }
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId, academyId: ACADEMY_ID },
  })
  if (!student) {
    return { error: "학생을 찾을 수 없습니다" }
  }

  const merchantUid = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

  const payment = await prisma.payment.create({
    data: {
      studentId,
      merchantUid,
      amount,
      description,
      status: "PENDING",
      method: "CARD",
    },
  })

  return { merchantUid: payment.merchantUid, paymentId: payment.id }
}

export async function verifyPaymentAction(merchantUid: string) {
  const session = await auth()
  if (!session) {
    return { error: "로그인이 필요합니다" }
  }

  const payment = await prisma.payment.findUnique({
    where: { merchantUid },
  })
  if (!payment) {
    return { error: "결제 정보를 찾을 수 없습니다" }
  }

  if (payment.status === "PAID") {
    return { error: "이미 결제 완료된 건입니다" }
  }

  try {
    const portonePayment = await verifyPayment(merchantUid)

    if (portonePayment.status === "paid" && portonePayment.amount === Number(payment.amount)) {
      await prisma.payment.update({
        where: { merchantUid },
        data: {
          status: "PAID",
          impUid: portonePayment.imp_uid,
          paidAt: new Date(portonePayment.paid_at * 1000),
          receiptUrl: portonePayment.receipt_url || null,
        },
      })

      revalidatePath("/payments")
      return { success: true }
    } else {
      await prisma.payment.update({
        where: { merchantUid },
        data: {
          status: "FAILED",
          failReason: portonePayment.fail_reason || "결제 금액이 일치하지 않습니다",
        },
      })
      return { error: "결제 검증에 실패했습니다" }
    }
  } catch (error) {
    await prisma.payment.update({
      where: { merchantUid },
      data: {
        status: "FAILED",
        failReason: error instanceof Error ? error.message : "결제 검증 중 오류 발생",
      },
    })
    return { error: "결제 검증 중 오류가 발생했습니다" }
  }
}

export async function getPaymentDetail(id: string) {
  const session = await auth()
  if (!session) {
    throw new Error("로그인이 필요합니다")
  }

  return prisma.payment.findUnique({
    where: { id },
    include: {
      student: {
        include: { user: { select: { name: true, email: true, phone: true } } },
      },
      subscription: {
        include: { feeStructure: true },
      },
    },
  })
}

export async function getStudentsForPayment() {
  const session = await auth()
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    throw new Error("권한이 없습니다")
  }

  return prisma.student.findMany({
    where: { academyId: ACADEMY_ID, isActive: true },
    include: { user: { select: { name: true } } },
    orderBy: { user: { name: "asc" } },
  })
}

"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { ITEMS_PER_PAGE } from "@/lib/constants"

export async function getSubscriptions(params: {
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
    where.student = { user: { name: { contains: params.search } } }
  }

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      include: {
        student: {
          include: { user: { select: { name: true } } },
        },
        feeStructure: {
          include: { subject: { select: { name: true } } },
        },
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.subscription.count({ where }),
  ])

  return {
    data: subscriptions,
    total,
    pageCount: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  }
}

export async function createSubscription(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const studentId = formData.get("studentId") as string
  const feeStructureId = formData.get("feeStructureId") as string
  const startDate = formData.get("startDate") as string

  if (!studentId || !feeStructureId || !startDate) {
    return { error: "필수 항목을 입력해주세요" }
  }

  const customerUid = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

  await prisma.subscription.create({
    data: {
      studentId,
      feeStructureId,
      customerUid,
      status: "ACTIVE",
      startDate: new Date(startDate),
      nextPaymentDate: new Date(startDate),
    },
  })

  revalidatePath("/payments/subscriptions")
  return { success: true }
}

export async function pauseSubscription(id: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const subscription = await prisma.subscription.findUnique({ where: { id } })
  if (!subscription) return { error: "정기결제를 찾을 수 없습니다" }
  if (subscription.status !== "ACTIVE") return { error: "활성 상태의 정기결제만 일시정지할 수 있습니다" }

  await prisma.subscription.update({
    where: { id },
    data: { status: "PAUSED", pausedAt: new Date() },
  })

  revalidatePath("/payments/subscriptions")
  return { success: true }
}

export async function cancelSubscription(id: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const subscription = await prisma.subscription.findUnique({ where: { id } })
  if (!subscription) return { error: "정기결제를 찾을 수 없습니다" }
  if (subscription.status === "CANCELLED") return { error: "이미 취소된 정기결제입니다" }

  await prisma.subscription.update({
    where: { id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  })

  revalidatePath("/payments/subscriptions")
  return { success: true }
}

export async function resumeSubscription(id: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const subscription = await prisma.subscription.findUnique({ where: { id } })
  if (!subscription) return { error: "정기결제를 찾을 수 없습니다" }
  if (subscription.status !== "PAUSED") return { error: "일시정지 상태의 정기결제만 재개할 수 있습니다" }

  await prisma.subscription.update({
    where: { id },
    data: {
      status: "ACTIVE",
      pausedAt: null,
      nextPaymentDate: new Date(),
    },
  })

  revalidatePath("/payments/subscriptions")
  return { success: true }
}

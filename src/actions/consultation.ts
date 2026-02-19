"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { hashPassword, verifyPassword } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import { ITEMS_PER_PAGE } from "@/lib/constants"

const ACADEMY_ID = "default-academy"

export async function getConsultations(params: {
  page?: number
  search?: string
  status?: string
}) {
  const session = await auth()
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    throw new Error("권한이 없습니다")
  }

  const page = params.page || 1
  const where: Record<string, unknown> = { academyId: ACADEMY_ID }

  if (params.status) {
    where.status = params.status
  }

  if (params.search) {
    where.OR = [
      { parentName: { contains: params.search } },
      { studentName: { contains: params.search } },
      { phone: { contains: params.search } },
    ]
  }

  const [consultations, total] = await Promise.all([
    prisma.consultation.findMany({
      where,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.consultation.count({ where }),
  ])

  return {
    data: consultations,
    total,
    pageCount: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  }
}

export async function createConsultation(formData: FormData) {
  const parentName = formData.get("parentName") as string
  const studentName = formData.get("studentName") as string
  const phone = formData.get("phone") as string
  const password = formData.get("password") as string
  const email = formData.get("email") as string
  const studentGrade = formData.get("studentGrade") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string
  const privacy = formData.get("privacy")

  if (!parentName || !studentName || !phone || !password) {
    return { error: "필수 항목을 입력해주세요" }
  }

  if (password.length < 4) {
    return { error: "비밀번호는 4자 이상이어야 합니다" }
  }

  if (!privacy) {
    return { error: "개인정보 수집 및 이용에 동의해주세요" }
  }

  const hashedPassword = await hashPassword(password)

  await prisma.consultation.create({
    data: {
      academyId: ACADEMY_ID,
      parentName,
      studentName,
      phone,
      password: hashedPassword,
      email: email || null,
      studentGrade: studentGrade || null,
      subject: subject || null,
      message: message || null,
      status: "PENDING",
    },
  })

  revalidatePath("/consultation")
  return { success: true }
}

export async function updateConsultationStatus(
  id: string,
  status: string,
  adminNote?: string
) {
  const session = await auth()
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return { error: "권한이 없습니다" }
  }

  const consultation = await prisma.consultation.findUnique({ where: { id } })
  if (!consultation) return { error: "상담 신청을 찾을 수 없습니다" }

  await prisma.consultation.update({
    where: { id },
    data: {
      status: status as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED",
      adminNote: adminNote !== undefined ? adminNote : consultation.adminNote,
    },
  })

  revalidatePath("/dashboard/consultations")
  return { success: true }
}

export async function lookupConsultations(phone: string, password: string) {
  if (!phone || !password) {
    return { error: "연락처와 비밀번호를 입력해주세요" }
  }

  const consultations = await prisma.consultation.findMany({
    where: { phone, academyId: ACADEMY_ID },
    orderBy: { createdAt: "desc" },
  })

  if (consultations.length === 0) {
    return { error: "해당 연락처로 신청된 상담이 없습니다" }
  }

  // 비밀번호가 일치하는 상담만 반환 (같은 번호로 여러 건 신청 가능)
  const matched = []
  for (const c of consultations) {
    const valid = await verifyPassword(password, c.password)
    if (valid) {
      matched.push({
        id: c.id,
        parentName: c.parentName,
        studentName: c.studentName,
        phone: c.phone,
        email: c.email,
        studentGrade: c.studentGrade,
        subject: c.subject,
        message: c.message,
        status: c.status,
        adminNote: c.adminNote,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })
    }
  }

  if (matched.length === 0) {
    return { error: "비밀번호가 일치하지 않습니다" }
  }

  return { data: matched }
}

export async function updateConsultationByUser(
  id: string,
  phone: string,
  password: string,
  formData: FormData
) {
  const consultation = await prisma.consultation.findUnique({ where: { id } })
  if (!consultation) return { error: "상담 신청을 찾을 수 없습니다" }

  if (consultation.phone !== phone) {
    return { error: "권한이 없습니다" }
  }

  const valid = await verifyPassword(password, consultation.password)
  if (!valid) return { error: "비밀번호가 일치하지 않습니다" }

  if (consultation.status !== "PENDING") {
    return { error: "대기 상태인 상담만 수정할 수 있습니다" }
  }

  const studentName = formData.get("studentName") as string
  const email = formData.get("email") as string
  const studentGrade = formData.get("studentGrade") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  await prisma.consultation.update({
    where: { id },
    data: {
      studentName: studentName || consultation.studentName,
      email: email || null,
      studentGrade: studentGrade || null,
      subject: subject || null,
      message: message || null,
    },
  })

  revalidatePath("/consultation")
  return { success: true }
}

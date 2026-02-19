"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { ITEMS_PER_PAGE } from "@/lib/constants"

export async function getGrades(params: {
  page?: number
  search?: string
  subjectId?: string
  studentId?: string
}) {
  const session = await auth()
  if (!session) {
    throw new Error("인증이 필요합니다")
  }

  const page = params.page || 1
  const where: any = {}

  if (params.subjectId) {
    where.subjectId = params.subjectId
  }
  if (params.studentId) {
    where.studentId = params.studentId
  }
  if (params.search) {
    where.examName = { contains: params.search }
  }

  const [grades, total] = await Promise.all([
    prisma.grade.findMany({
      where,
      include: {
        student: { include: { user: { select: { name: true } } } },
        subject: { select: { name: true } },
        teacher: { include: { user: { select: { name: true } } } },
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: { examDate: "desc" },
    }),
    prisma.grade.count({ where }),
  ])

  return {
    data: grades,
    total,
    pageCount: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  }
}

export async function createGrade(formData: FormData) {
  const session = await auth()
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return { error: "권한이 없습니다" }
  }

  const studentId = formData.get("studentId") as string
  const subjectId = formData.get("subjectId") as string
  const teacherId = formData.get("teacherId") as string
  const examName = formData.get("examName") as string
  const score = formData.get("score") as string
  const maxScore = formData.get("maxScore") as string
  const comment = formData.get("comment") as string
  const examDate = formData.get("examDate") as string

  if (!studentId || !subjectId || !teacherId || !examName || !score || !examDate) {
    return { error: "필수 항목을 입력해주세요" }
  }

  await prisma.grade.create({
    data: {
      studentId,
      subjectId,
      teacherId,
      examName,
      score: parseFloat(score),
      maxScore: maxScore ? parseFloat(maxScore) : 100,
      comment: comment || null,
      examDate: new Date(examDate),
    },
  })

  revalidatePath("/dashboard/subjects")
  return { success: true }
}

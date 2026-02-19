"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ITEMS_PER_PAGE } from "@/lib/constants"

const ACADEMY_ID = "default-academy"

export async function getSubjects(params: { page?: number; search?: string }) {
  const session = await auth()
  if (!session) {
    throw new Error("인증이 필요합니다")
  }

  const page = params.page || 1
  const where = {
    academyId: ACADEMY_ID,
    ...(params.search
      ? { name: { contains: params.search } }
      : {}),
  }

  const [subjects, total] = await Promise.all([
    prisma.subject.findMany({
      where,
      include: {
        _count: { select: { enrollments: true, teacherSubjects: true } },
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.subject.count({ where }),
  ])

  return {
    data: subjects,
    total,
    pageCount: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  }
}

export async function getSubject(id: string) {
  return prisma.subject.findUnique({
    where: { id },
    include: {
      teacherSubjects: {
        include: {
          teacher: {
            include: { user: { select: { name: true, email: true } } },
          },
        },
      },
      enrollments: {
        include: {
          student: {
            include: { user: { select: { name: true, email: true } } },
          },
        },
        orderBy: { enrolledAt: "desc" },
      },
    },
  })
}

export async function createSubject(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const level = formData.get("level") as string
  const maxStudents = formData.get("maxStudents") as string

  if (!name) {
    return { error: "과목명을 입력해주세요" }
  }

  await prisma.subject.create({
    data: {
      academyId: ACADEMY_ID,
      name,
      description: description || null,
      level: level || null,
      maxStudents: maxStudents ? parseInt(maxStudents) : null,
    },
  })

  revalidatePath("/dashboard/subjects")
  redirect("/dashboard/subjects")
}

export async function updateSubject(id: string, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const level = formData.get("level") as string
  const maxStudents = formData.get("maxStudents") as string

  if (!name) {
    return { error: "과목명을 입력해주세요" }
  }

  const subject = await prisma.subject.findUnique({ where: { id } })
  if (!subject) return { error: "과목을 찾을 수 없습니다" }

  await prisma.subject.update({
    where: { id },
    data: {
      name,
      description: description || null,
      level: level || null,
      maxStudents: maxStudents ? parseInt(maxStudents) : null,
    },
  })

  revalidatePath("/dashboard/subjects")
  redirect("/dashboard/subjects")
}

export async function deleteSubject(id: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const subject = await prisma.subject.findUnique({ where: { id } })
  if (!subject) return { error: "과목을 찾을 수 없습니다" }

  await prisma.subject.delete({ where: { id } })

  revalidatePath("/dashboard/subjects")
  return { success: true }
}

export async function getAllSubjects() {
  return prisma.subject.findMany({
    where: { academyId: ACADEMY_ID, isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })
}

export async function getAllTeachers() {
  return prisma.teacher.findMany({
    where: { academyId: ACADEMY_ID, isActive: true },
    include: { user: { select: { name: true } } },
    orderBy: { user: { name: "asc" } },
  })
}

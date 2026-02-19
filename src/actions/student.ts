"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { hashPassword } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ITEMS_PER_PAGE } from "@/lib/constants"

const ACADEMY_ID = "default-academy"

export async function getStudents(params: { page?: number; search?: string }) {
  const session = await auth()
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    throw new Error("권한이 없습니다")
  }

  const page = params.page || 1
  const where = params.search
    ? { user: { name: { contains: params.search } } }
    : {}

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        studentParents: { include: { parent: { include: { user: { select: { name: true } } } } } },
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.student.count({ where }),
  ])

  return {
    data: students,
    total,
    pageCount: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  }
}

export async function getStudent(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      enrollments: { include: { subject: true } },
      studentParents: { include: { parent: { include: { user: { select: { name: true, phone: true } } } } } },
      grades: { include: { subject: true }, orderBy: { examDate: "desc" }, take: 10 },
    },
  })
}

export async function createStudent(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const phone = formData.get("phone") as string
  const grade = formData.get("grade") as string
  const school = formData.get("school") as string

  if (!name || !email || !password) {
    return { error: "필수 항목을 입력해주세요" }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: "이미 등록된 이메일입니다" }

  const hashedPassword = await hashPassword(password)

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email, password: hashedPassword, phone: phone || null, role: "STUDENT" },
    })
    await tx.student.create({
      data: {
        userId: user.id,
        academyId: ACADEMY_ID,
        grade: grade || null,
        school: school || null,
        enrollDate: new Date(),
      },
    })
  })

  revalidatePath("/dashboard/students")
  redirect("/dashboard/students")
}

export async function updateStudent(id: string, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const grade = formData.get("grade") as string
  const school = formData.get("school") as string

  const student = await prisma.student.findUnique({ where: { id } })
  if (!student) return { error: "학생을 찾을 수 없습니다" }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: student.userId },
      data: { name, phone: phone || null },
    })
    await tx.student.update({
      where: { id },
      data: { grade: grade || null, school: school || null },
    })
  })

  revalidatePath("/dashboard/students")
  redirect("/dashboard/students")
}

export async function deleteStudent(id: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const student = await prisma.student.findUnique({ where: { id } })
  if (!student) return { error: "학생을 찾을 수 없습니다" }

  await prisma.user.delete({ where: { id: student.userId } })
  revalidatePath("/dashboard/students")
  return { success: true }
}

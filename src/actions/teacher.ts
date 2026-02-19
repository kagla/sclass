"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { hashPassword } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ITEMS_PER_PAGE } from "@/lib/constants"

const ACADEMY_ID = "default-academy"

export async function getTeachers(params: { page?: number; search?: string }) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("권한이 없습니다")
  }

  const page = params.page || 1
  const where = params.search
    ? { user: { name: { contains: params.search } } }
    : {}

  const [teachers, total] = await Promise.all([
    prisma.teacher.findMany({
      where,
      include: { user: { select: { name: true, email: true, phone: true } } },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.teacher.count({ where }),
  ])

  return {
    data: teachers,
    total,
    pageCount: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  }
}

export async function getTeacher(id: string) {
  return prisma.teacher.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      teacherSubjects: { include: { subject: true } },
    },
  })
}

export async function createTeacher(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const phone = formData.get("phone") as string
  const specialization = formData.get("specialization") as string
  const bio = formData.get("bio") as string

  if (!name || !email || !password) {
    return { error: "필수 항목을 입력해주세요" }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "이미 등록된 이메일입니다" }
  }

  const hashedPassword = await hashPassword(password)

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "TEACHER",
      },
    })
    await tx.teacher.create({
      data: {
        userId: user.id,
        academyId: ACADEMY_ID,
        specialization: specialization || null,
        bio: bio || null,
        hireDate: new Date(),
      },
    })
  })

  revalidatePath("/dashboard/teachers")
  redirect("/dashboard/teachers")
}

export async function updateTeacher(id: string, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const specialization = formData.get("specialization") as string
  const bio = formData.get("bio") as string

  const teacher = await prisma.teacher.findUnique({ where: { id } })
  if (!teacher) return { error: "강사를 찾을 수 없습니다" }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: teacher.userId },
      data: { name, phone: phone || null },
    })
    await tx.teacher.update({
      where: { id },
      data: {
        specialization: specialization || null,
        bio: bio || null,
      },
    })
  })

  revalidatePath("/dashboard/teachers")
  redirect("/dashboard/teachers")
}

export async function deleteTeacher(id: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const teacher = await prisma.teacher.findUnique({ where: { id } })
  if (!teacher) return { error: "강사를 찾을 수 없습니다" }

  await prisma.user.delete({ where: { id: teacher.userId } })

  revalidatePath("/dashboard/teachers")
  return { success: true }
}

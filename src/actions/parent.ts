"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { hashPassword } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ITEMS_PER_PAGE } from "@/lib/constants"

const ACADEMY_ID = "default-academy"

export async function getParents(params: { page?: number; search?: string }) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("권한이 없습니다")
  }

  const page = params.page || 1
  const where = params.search
    ? { user: { name: { contains: params.search } } }
    : {}

  const [parents, total] = await Promise.all([
    prisma.parent.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        studentParents: { include: { student: { include: { user: { select: { name: true } } } } } },
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.parent.count({ where }),
  ])

  return {
    data: parents,
    total,
    pageCount: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  }
}

export async function createParent(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const phone = formData.get("phone") as string
  const relationship = formData.get("relationship") as string

  if (!name || !email || !password) return { error: "필수 항목을 입력해주세요" }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: "이미 등록된 이메일입니다" }

  const hashedPassword = await hashPassword(password)

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email, password: hashedPassword, phone: phone || null, role: "PARENT" },
    })
    await tx.parent.create({
      data: { userId: user.id, academyId: ACADEMY_ID, relationship: relationship || null },
    })
  })

  revalidatePath("/dashboard/parents")
  redirect("/dashboard/parents")
}

export async function updateParent(id: string, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const relationship = formData.get("relationship") as string

  const parent = await prisma.parent.findUnique({ where: { id } })
  if (!parent) return { error: "학부모를 찾을 수 없습니다" }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: parent.userId },
      data: { name, phone: phone || null },
    })
    await tx.parent.update({
      where: { id },
      data: { relationship: relationship || null },
    })
  })

  revalidatePath("/dashboard/parents")
  redirect("/dashboard/parents")
}

export async function deleteParent(id: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const parent = await prisma.parent.findUnique({ where: { id } })
  if (!parent) return { error: "학부모를 찾을 수 없습니다" }

  await prisma.user.delete({ where: { id: parent.userId } })
  revalidatePath("/dashboard/parents")
  return { success: true }
}

export async function linkStudentToParent(parentId: string, studentId: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  await prisma.studentParent.create({
    data: { studentId, parentId },
  })

  revalidatePath("/dashboard/parents")
  revalidatePath("/dashboard/students")
  return { success: true }
}

export async function unlinkStudentFromParent(parentId: string, studentId: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  await prisma.studentParent.deleteMany({
    where: { studentId, parentId },
  })

  revalidatePath("/dashboard/parents")
  revalidatePath("/dashboard/students")
  return { success: true }
}

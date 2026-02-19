"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ITEMS_PER_PAGE } from "@/lib/constants"

const ACADEMY_ID = "default-academy"

export async function getStories(params: { page?: number; search?: string }) {
  const session = await auth()
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    throw new Error("권한이 없습니다")
  }

  const page = params.page || 1
  const where: Record<string, unknown> = { academyId: ACADEMY_ID }

  if (params.search) {
    where.OR = [
      { studentName: { contains: params.search } },
      { title: { contains: params.search } },
      { university: { contains: params.search } },
    ]
  }

  const [stories, total] = await Promise.all([
    prisma.successStory.findMany({
      where,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.successStory.count({ where }),
  ])

  return {
    data: stories,
    total,
    pageCount: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  }
}

export async function getStory(id: string) {
  return prisma.successStory.findUnique({
    where: { id },
  })
}

export async function createStory(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const studentName = formData.get("studentName") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const university = formData.get("university") as string
  const year = formData.get("year") as string
  const isPublished = formData.get("isPublished") === "true"

  if (!studentName || !title || !content) {
    return { error: "필수 항목을 입력해주세요" }
  }

  await prisma.successStory.create({
    data: {
      academyId: ACADEMY_ID,
      studentName,
      title,
      content,
      university: university || null,
      year: year ? parseInt(year) : null,
      isPublished,
    },
  })

  revalidatePath("/stories")
  redirect("/stories")
}

export async function updateStory(id: string, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const story = await prisma.successStory.findUnique({ where: { id } })
  if (!story) return { error: "합격수기를 찾을 수 없습니다" }

  const studentName = formData.get("studentName") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const university = formData.get("university") as string
  const year = formData.get("year") as string
  const isPublished = formData.get("isPublished") === "true"

  if (!studentName || !title || !content) {
    return { error: "필수 항목을 입력해주세요" }
  }

  await prisma.successStory.update({
    where: { id },
    data: {
      studentName,
      title,
      content,
      university: university || null,
      year: year ? parseInt(year) : null,
      isPublished,
    },
  })

  revalidatePath("/stories")
  redirect("/stories")
}

export async function deleteStory(id: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const story = await prisma.successStory.findUnique({ where: { id } })
  if (!story) return { error: "합격수기를 찾을 수 없습니다" }

  await prisma.successStory.delete({ where: { id } })

  revalidatePath("/stories")
  return { success: true }
}

export async function getPublishedStories() {
  return prisma.successStory.findMany({
    where: { academyId: ACADEMY_ID, isPublished: true },
    orderBy: { createdAt: "desc" },
  })
}

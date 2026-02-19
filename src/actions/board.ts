"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import type { BoardType } from "@prisma/client"

const ACADEMY_ID = "default-academy"

async function findOrCreateBoard(boardType: BoardType) {
  let board = await prisma.board.findFirst({
    where: { academyId: ACADEMY_ID, type: boardType },
  })

  if (!board) {
    const nameMap: Record<string, string> = {
      NOTICE: "공지사항",
      PARENT: "학부모 게시판",
      INQUIRY: "문의 게시판",
    }
    board = await prisma.board.create({
      data: {
        academyId: ACADEMY_ID,
        name: nameMap[boardType] || boardType,
        type: boardType,
      },
    })
  }

  return board
}

export async function getPosts(
  boardType: string,
  params: { page?: number; search?: string }
) {
  const session = await auth()
  if (!session) {
    throw new Error("인증이 필요합니다")
  }

  const board = await findOrCreateBoard(boardType as BoardType)
  const page = params.page || 1

  const where: any = { boardId: board.id }
  if (params.search) {
    where.title = { contains: params.search }
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: { select: { name: true, role: true } },
        _count: { select: { comments: true } },
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    }),
    prisma.post.count({ where }),
  ])

  return {
    data: posts,
    total,
    pageCount: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
    board,
  }
}

export async function getPost(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, role: true } },
      board: { select: { type: true, name: true } },
      comments: {
        where: { parentId: null },
        include: {
          author: { select: { id: true, name: true, role: true } },
          replies: {
            include: {
              author: { select: { id: true, name: true, role: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      files: true,
    },
  })
}

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session) {
    return { error: "인증이 필요합니다" }
  }

  const boardType = formData.get("boardType") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  if (!boardType || !title || !content) {
    return { error: "필수 항목을 입력해주세요" }
  }

  const board = await findOrCreateBoard(boardType as BoardType)

  await prisma.post.create({
    data: {
      boardId: board.id,
      authorId: session.user.id,
      title,
      content,
    },
  })

  revalidatePath(`/dashboard/boards/${boardType}`)
  redirect(`/dashboard/boards/${boardType}`)
}

export async function updatePost(id: string, formData: FormData) {
  const session = await auth()
  if (!session) {
    return { error: "인증이 필요합니다" }
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string

  if (!title || !content) {
    return { error: "필수 항목을 입력해주세요" }
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: { board: true },
  })
  if (!post) return { error: "게시글을 찾을 수 없습니다" }

  // Only author or admin can update
  if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  await prisma.post.update({
    where: { id },
    data: { title, content },
  })

  const boardType = post.board.type
  revalidatePath(`/dashboard/boards/${boardType}/${id}`)
  redirect(`/dashboard/boards/${boardType}/${id}`)
}

export async function deletePost(id: string) {
  const session = await auth()
  if (!session) {
    return { error: "인증이 필요합니다" }
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: { board: true },
  })
  if (!post) return { error: "게시글을 찾을 수 없습니다" }

  // Only author or admin can delete
  if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  await prisma.post.delete({ where: { id } })

  const boardType = post.board.type
  revalidatePath(`/dashboard/boards/${boardType}`)
  return { success: true, boardType }
}

export async function incrementViewCount(id: string) {
  await prisma.post.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  })
}

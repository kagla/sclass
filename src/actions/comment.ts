"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createComment(formData: FormData) {
  const session = await auth()
  if (!session) {
    return { error: "인증이 필요합니다" }
  }

  const postId = formData.get("postId") as string
  const content = formData.get("content") as string
  const parentId = formData.get("parentId") as string | null

  if (!postId || !content) {
    return { error: "내용을 입력해주세요" }
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { board: true },
  })
  if (!post) return { error: "게시글을 찾을 수 없습니다" }

  await prisma.comment.create({
    data: {
      postId,
      authorId: session.user.id,
      content,
      parentId: parentId || null,
    },
  })

  revalidatePath(`/dashboard/boards/${post.board.type}/${postId}`)
  return { success: true }
}

export async function deleteComment(id: string) {
  const session = await auth()
  if (!session) {
    return { error: "인증이 필요합니다" }
  }

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { post: { include: { board: true } } },
  })
  if (!comment) return { error: "댓글을 찾을 수 없습니다" }

  // Only author or admin can delete
  if (comment.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  await prisma.comment.delete({ where: { id } })

  revalidatePath(
    `/dashboard/boards/${comment.post.board.type}/${comment.postId}`
  )
  return { success: true }
}

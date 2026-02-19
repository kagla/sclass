import { notFound } from "next/navigation"
import { getPost, updatePost } from "@/actions/board"
import { PostForm } from "@/components/forms/post-form"
import { BOARD_TYPE_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardType: string; postId: string }>
}) {
  const { postId } = await params
  const post = await getPost(postId)
  return { title: post ? `${post.title} - 수정` : "게시글 수정" }
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ boardType: string; postId: string }>
}) {
  const { boardType, postId } = await params
  const post = await getPost(postId)
  if (!post) notFound()

  const boardName = BOARD_TYPE_LABELS[boardType] || "게시판"
  const action = updatePost.bind(null, postId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/dashboard/boards/${boardType}/${postId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">게시글 수정</h1>
          <p className="text-muted-foreground">{boardName}</p>
        </div>
      </div>
      <PostForm
        action={action}
        isEdit
        defaultValues={{
          title: post.title,
          content: post.content,
        }}
      />
    </div>
  )
}

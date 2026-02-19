import { createPost } from "@/actions/board"
import { PostForm } from "@/components/forms/post-form"
import { BOARD_TYPE_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardType: string }>
}) {
  const { boardType } = await params
  return { title: `${BOARD_TYPE_LABELS[boardType] || "게시판"} - 글쓰기` }
}

export default async function NewPostPage({
  params,
}: {
  params: Promise<{ boardType: string }>
}) {
  const { boardType } = await params
  const boardName = BOARD_TYPE_LABELS[boardType] || "게시판"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/dashboard/boards/${boardType}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">글쓰기</h1>
          <p className="text-muted-foreground">{boardName}에 새 글을 작성합니다.</p>
        </div>
      </div>
      <PostForm action={createPost} boardType={boardType} />
    </div>
  )
}

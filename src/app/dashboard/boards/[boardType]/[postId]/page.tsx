import { notFound } from "next/navigation"
import { getPost, incrementViewCount } from "@/actions/board"
import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Pencil, Eye } from "lucide-react"
import { BOARD_TYPE_LABELS, ROLE_LABELS } from "@/lib/constants"
import { CommentSection } from "@/components/dashboard/boards/comment-section"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardType: string; postId: string }>
}) {
  const { postId } = await params
  const post = await getPost(postId)
  return { title: post?.title || "게시글" }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ boardType: string; postId: string }>
}) {
  const { boardType, postId } = await params
  const session = await auth()

  const post = await getPost(postId)
  if (!post) notFound()

  // Increment view count
  await incrementViewCount(postId)

  const boardName = BOARD_TYPE_LABELS[boardType] || "게시판"
  const isAuthor = session?.user?.id === post.author.id
  const isAdmin = session?.user?.role === "ADMIN"
  const canEdit = isAuthor || isAdmin

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/dashboard/boards/${boardType}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">{boardName}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{post.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>{post.author.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {ROLE_LABELS[post.author.role] || post.author.role}
                  </Badge>
                </div>
                <span>
                  {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.viewCount + 1}</span>
                </div>
              </div>
            </div>
            {canEdit && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/boards/${boardType}/${postId}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  수정
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
            {post.content}
          </div>
        </CardContent>
      </Card>

      {/* Attached files */}
      {post.files.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold">첨부파일 ({post.files.length})</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {post.files.map((file) => (
                <div key={file.id} className="text-sm text-muted-foreground">
                  {file.originalName} ({Math.round(file.fileSize / 1024)}KB)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments */}
      <CommentSection
        postId={postId}
        comments={post.comments as any}
        currentUserId={session?.user?.id}
        currentUserRole={session?.user?.role}
      />
    </div>
  )
}

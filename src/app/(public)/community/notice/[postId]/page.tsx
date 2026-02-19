import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Pin, Eye, Calendar, User } from "lucide-react"
import { format } from "date-fns"

export const metadata = { title: "공지사항 상세" }

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>
}) {
  const { postId } = await params

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { name: true } },
      board: { select: { type: true } },
    },
  })

  if (!post || !post.isPublic || post.board.type !== "NOTICE") {
    notFound()
  }

  // Increment view count
  await prisma.post.update({
    where: { id: postId },
    data: { viewCount: { increment: 1 } },
  })

  return (
    <div>
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/community/notice">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-start gap-3">
                {post.isPinned && (
                  <Badge variant="default" className="shrink-0">
                    <Pin className="mr-1 h-3 w-3" />
                    공지
                  </Badge>
                )}
                <h1 className="text-xl font-bold sm:text-2xl">{post.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {post.author.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(post.createdAt), "yyyy년 MM월 dd일")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  조회 {post.viewCount + 1}
                </span>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-line leading-relaxed">
                {post.content}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

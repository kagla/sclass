import { prisma } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Pin, Eye } from "lucide-react"
import { format } from "date-fns"
import { ITEMS_PER_PAGE } from "@/lib/constants"

export const metadata = { title: "공지사항" }

const ACADEMY_ID = "default-academy"

export default async function NoticeBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const board = await prisma.board.findFirst({
    where: { academyId: ACADEMY_ID, type: "NOTICE", isActive: true },
  })

  if (!board) {
    return (
      <div>
        <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                공지사항
              </h1>
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4">
            <div className="flex h-40 items-center justify-center rounded-md border text-muted-foreground">
              공지사항 게시판이 준비 중입니다.
            </div>
          </div>
        </section>
      </div>
    )
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { boardId: board.id, isPublic: true },
      include: {
        author: { select: { name: true } },
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    }),
    prisma.post.count({ where: { boardId: board.id, isPublic: true } }),
  ])

  const pageCount = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              공지사항
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              학원의 중요한 공지사항을 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Posts List */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/community/notice/${post.id}`}>
                  <Card className="transition-colors hover:bg-muted/30">
                    <CardContent className="flex items-center gap-4 py-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {post.isPinned && (
                            <Pin className="h-3.5 w-3.5 shrink-0 text-primary" />
                          )}
                          <h3 className="truncate font-medium">
                            {post.title}
                          </h3>
                          {post.isPinned && (
                            <Badge variant="default" className="shrink-0 text-xs">
                              공지
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{post.author.name}</span>
                          <span>
                            {format(new Date(post.createdAt), "yyyy-MM-dd")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.viewCount}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border text-muted-foreground">
              등록된 공지사항이 없습니다.
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/community/notice?page=${p}`}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm ${
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "border hover:bg-muted"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

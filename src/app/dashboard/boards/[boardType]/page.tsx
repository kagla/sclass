import Link from "next/link"
import { getPosts } from "@/actions/board"
import { DataTable } from "@/components/dashboard/data-table"
import { createPostColumns } from "@/components/dashboard/boards/post-columns"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import { BOARD_TYPE_LABELS } from "@/lib/constants"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardType: string }>
}) {
  const { boardType } = await params
  return { title: BOARD_TYPE_LABELS[boardType] || "게시판" }
}

export default async function BoardPostsPage({
  params,
  searchParams,
}: {
  params: Promise<{ boardType: string }>
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const { boardType } = await params
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const search = sp.search || ""

  const result = await getPosts(boardType, { page, search })
  const boardName = BOARD_TYPE_LABELS[boardType] || "게시판"
  const columns = createPostColumns(boardType)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/boards">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{boardName}</h1>
            <p className="text-muted-foreground">총 {result.total}개의 게시글</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/boards/${boardType}/new`}>
            <Plus className="mr-2 h-4 w-4" />
            글쓰기
          </Link>
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={result.data}
        totalPages={result.pageCount}
        currentPage={result.currentPage}
        searchPlaceholder="제목으로 검색..."
      />
    </div>
  )
}

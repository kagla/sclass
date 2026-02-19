"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Pin } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { deletePost } from "@/actions/board"
import { toast } from "sonner"
import { ROLE_LABELS } from "@/lib/constants"

type PostRow = {
  id: string
  title: string
  isPinned: boolean
  viewCount: number
  createdAt: Date
  author: { name: string | null; role: string }
  _count: { comments: number }
  _boardType?: string
}

export function createPostColumns(boardType: string): ColumnDef<PostRow>[] {
  return [
    {
      id: "pin",
      header: "",
      cell: ({ row }) =>
        row.original.isPinned ? (
          <Pin className="h-4 w-4 text-primary" />
        ) : null,
      size: 30,
    },
    {
      accessorKey: "title",
      header: "제목",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/boards/${boardType}/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {row.original.title}
          </Link>
          {row.original._count.comments > 0 && (
            <Badge variant="secondary" className="text-xs">
              {row.original._count.comments}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "author.name",
      header: "작성자",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span>{row.original.author.name}</span>
          <Badge variant="outline" className="text-xs">
            {ROLE_LABELS[row.original.author.role] || row.original.author.role}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "viewCount",
      header: "조회수",
      cell: ({ row }) => row.original.viewCount,
    },
    {
      accessorKey: "createdAt",
      header: "작성일",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt)
        return date.toLocaleDateString("ko-KR")
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const handleDelete = async () => {
          if (!confirm("정말 삭제하시겠습니까?")) return
          const result = await deletePost(row.original.id)
          if (result?.error) toast.error(result.error)
          else toast.success("삭제되었습니다")
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/boards/${boardType}/${row.original.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  수정
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { deleteTeacher } from "@/actions/teacher"
import { toast } from "sonner"

type TeacherRow = {
  id: string
  specialization: string | null
  isActive: boolean
  user: { name: string | null; email: string; phone: string | null }
}

export const teacherColumns: ColumnDef<TeacherRow>[] = [
  {
    accessorKey: "user.name",
    header: "이름",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/teachers/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.user.name}
      </Link>
    ),
  },
  {
    accessorKey: "user.email",
    header: "이메일",
    cell: ({ row }) => row.original.user.email,
  },
  {
    accessorKey: "user.phone",
    header: "연락처",
    cell: ({ row }) => row.original.user.phone || "-",
  },
  {
    accessorKey: "specialization",
    header: "전문 분야",
    cell: ({ row }) =>
      row.original.specialization ? (
        <Badge variant="secondary">{row.original.specialization}</Badge>
      ) : (
        "-"
      ),
  },
  {
    accessorKey: "isActive",
    header: "상태",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "활성" : "비활성"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return
        const result = await deleteTeacher(row.original.id)
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
              <Link href={`/dashboard/teachers/${row.original.id}/edit`}>
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

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
import { deleteStudent } from "@/actions/student"
import { toast } from "sonner"

type StudentRow = {
  id: string
  grade: string | null
  school: string | null
  isActive: boolean
  user: { name: string | null; email: string; phone: string | null }
  studentParents: Array<{ parent: { user: { name: string | null } } }>
}

export const studentColumns: ColumnDef<StudentRow>[] = [
  {
    accessorKey: "user.name",
    header: "이름",
    cell: ({ row }) => (
      <Link href={`/dashboard/students/${row.original.id}`} className="font-medium hover:underline">
        {row.original.user.name}
      </Link>
    ),
  },
  {
    accessorKey: "grade",
    header: "학년",
    cell: ({ row }) => row.original.grade || "-",
  },
  {
    accessorKey: "school",
    header: "학교",
    cell: ({ row }) => row.original.school || "-",
  },
  {
    accessorKey: "user.phone",
    header: "연락처",
    cell: ({ row }) => row.original.user.phone || "-",
  },
  {
    id: "parents",
    header: "학부모",
    cell: ({ row }) => {
      const parents = row.original.studentParents
      return parents.length > 0
        ? parents.map((sp) => sp.parent.user.name).join(", ")
        : "-"
    },
  },
  {
    accessorKey: "isActive",
    header: "상태",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "수강중" : "퇴원"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return
        const result = await deleteStudent(row.original.id)
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
              <Link href={`/dashboard/students/${row.original.id}/edit`}>
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

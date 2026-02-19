"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { deleteParent } from "@/actions/parent"
import { toast } from "sonner"

type ParentRow = {
  id: string
  relationship: string | null
  user: { name: string | null; email: string; phone: string | null }
  studentParents: Array<{ student: { user: { name: string | null } } }>
}

export const parentColumns: ColumnDef<ParentRow>[] = [
  {
    accessorKey: "user.name",
    header: "이름",
    cell: ({ row }) => (
      <Link href={`/dashboard/parents/${row.original.id}`} className="font-medium hover:underline">
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
    accessorKey: "relationship",
    header: "관계",
    cell: ({ row }) => row.original.relationship || "-",
  },
  {
    id: "children",
    header: "자녀",
    cell: ({ row }) => {
      const children = row.original.studentParents
      return children.length > 0
        ? children.map((sp) => sp.student.user.name).join(", ")
        : "-"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return
        const result = await deleteParent(row.original.id)
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
              <Link href={`/dashboard/parents/${row.original.id}/edit`}>
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

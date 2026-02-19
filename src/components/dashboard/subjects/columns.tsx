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
import { deleteSubject } from "@/actions/subject"
import { toast } from "sonner"

type SubjectRow = {
  id: string
  name: string
  level: string | null
  maxStudents: number | null
  isActive: boolean
  _count: { enrollments: number; teacherSubjects: number }
}

export const subjectColumns: ColumnDef<SubjectRow>[] = [
  {
    accessorKey: "name",
    header: "과목명",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/subjects/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "level",
    header: "레벨",
    cell: ({ row }) =>
      row.original.level ? (
        <Badge variant="secondary">{row.original.level}</Badge>
      ) : (
        "-"
      ),
  },
  {
    accessorKey: "maxStudents",
    header: "정원",
    cell: ({ row }) =>
      row.original.maxStudents ? `${row.original.maxStudents}명` : "-",
  },
  {
    id: "enrollments",
    header: "수강생",
    cell: ({ row }) => `${row.original._count.enrollments}명`,
  },
  {
    id: "teachers",
    header: "담당 강사",
    cell: ({ row }) => `${row.original._count.teacherSubjects}명`,
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
        const result = await deleteSubject(row.original.id)
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
              <Link href={`/dashboard/subjects/${row.original.id}/edit`}>
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

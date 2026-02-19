"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle, Clock, XCircle, MessageSquare } from "lucide-react"
import { CONSULTATION_STATUS_LABELS } from "@/lib/constants"
import { updateConsultationStatus } from "@/actions/consultation"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

type ConsultationRow = {
  id: string
  parentName: string
  studentName: string
  phone: string
  email: string | null
  studentGrade: string | null
  subject: string | null
  message: string | null
  status: string
  adminNote: string | null
  createdAt: Date
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  CONFIRMED: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
}

function ConsultationActions({ row }: { row: ConsultationRow }) {
  const router = useRouter()

  const handleStatusChange = async (status: string) => {
    const result = await updateConsultationStatus(row.id, status)
    if (result.error) toast.error(result.error)
    else {
      toast.success("상태가 변경되었습니다")
      router.refresh()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleStatusChange("CONFIRMED")}>
          <Clock className="mr-2 h-4 w-4" />
          확인
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("COMPLETED")}>
          <CheckCircle className="mr-2 h-4 w-4" />
          완료
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleStatusChange("CANCELLED")}
          className="text-destructive"
        >
          <XCircle className="mr-2 h-4 w-4" />
          취소
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const consultationColumns: ColumnDef<ConsultationRow>[] = [
  {
    accessorKey: "parentName",
    header: "학부모명",
  },
  {
    accessorKey: "studentName",
    header: "학생명",
  },
  {
    accessorKey: "phone",
    header: "연락처",
  },
  {
    accessorKey: "studentGrade",
    header: "학년",
    cell: ({ row }) => row.original.studentGrade || "-",
  },
  {
    accessorKey: "subject",
    header: "관심 과목",
    cell: ({ row }) => row.original.subject || "-",
  },
  {
    accessorKey: "message",
    header: "메시지",
    cell: ({ row }) => {
      const msg = row.original.message
      if (!msg) return "-"
      return (
        <span className="line-clamp-1 max-w-[200px]" title={msg}>
          {msg}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => (
      <Badge variant={statusVariants[row.original.status] || "outline"}>
        {CONSULTATION_STATUS_LABELS[row.original.status] || row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "신청일",
    cell: ({ row }) => format(new Date(row.original.createdAt), "yyyy-MM-dd HH:mm"),
  },
  {
    id: "actions",
    cell: ({ row }) => <ConsultationActions row={row.original} />,
  },
]

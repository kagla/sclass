"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { PAYMENT_STATUS_LABELS } from "@/lib/constants"
import { format } from "date-fns"

type PaymentRow = {
  id: string
  merchantUid: string
  amount: unknown
  status: string
  method: string
  description: string | null
  paidAt: Date | null
  createdAt: Date
  student: {
    user: { name: string | null }
  }
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  PAID: "default",
  FAILED: "destructive",
  CANCELLED: "secondary",
  REFUNDED: "secondary",
}

const methodLabels: Record<string, string> = {
  CARD: "카드",
  BANK_TRANSFER: "계좌이체",
  VIRTUAL_ACCOUNT: "가상계좌",
  SUBSCRIPTION: "정기결제",
}

export const paymentColumns: ColumnDef<PaymentRow>[] = [
  {
    accessorKey: "merchantUid",
    header: "주문번호",
    cell: ({ row }) => (
      <Link
        href={`/payments/${row.original.id}`}
        className="font-mono text-xs hover:underline"
      >
        {row.original.merchantUid}
      </Link>
    ),
  },
  {
    id: "studentName",
    header: "학생명",
    cell: ({ row }) => row.original.student.user.name || "-",
  },
  {
    accessorKey: "description",
    header: "설명",
    cell: ({ row }) => row.original.description || "-",
  },
  {
    accessorKey: "amount",
    header: "금액",
    cell: ({ row }) => (
      <span className="font-medium">
        {Number(row.original.amount).toLocaleString()}원
      </span>
    ),
  },
  {
    accessorKey: "method",
    header: "결제수단",
    cell: ({ row }) => methodLabels[row.original.method] || row.original.method,
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => (
      <Badge variant={statusVariants[row.original.status] || "outline"}>
        {PAYMENT_STATUS_LABELS[row.original.status] || row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "결제일",
    cell: ({ row }) => {
      const date = row.original.paidAt || row.original.createdAt
      return format(new Date(date), "yyyy-MM-dd HH:mm")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/payments/${row.original.id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
    ),
  },
]

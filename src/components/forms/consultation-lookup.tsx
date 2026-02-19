"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  lookupConsultations,
  updateConsultationByUser,
} from "@/actions/consultation"
import { CONSULTATION_STATUS_LABELS } from "@/lib/constants"
import { toast } from "sonner"
import { Loader2, Search, ArrowLeft, Pencil } from "lucide-react"

type Consultation = {
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
  updatedAt: Date
}

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
}

export function ConsultationLookup() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [consultations, setConsultations] = useState<Consultation[] | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setConsultations(null)
    setEditingId(null)

    const result = await lookupConsultations(phone, password)

    if (result.error) {
      toast.error(result.error)
    } else if (result.data) {
      setConsultations(result.data)
    }
    setIsPending(false)
  }

  const handleUpdate = async (id: string, formData: FormData) => {
    setIsSaving(true)
    const result = await updateConsultationByUser(id, phone, password, formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("상담 내용이 수정되었습니다")
      setEditingId(null)
      // 재조회
      const refreshed = await lookupConsultations(phone, password)
      if (refreshed.data) setConsultations(refreshed.data)
    }
    setIsSaving(false)
  }

  // 조회 전: 조회 폼
  if (!consultations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>상담 조회</CardTitle>
          <CardDescription>
            신청 시 입력한 연락처와 비밀번호로 조회할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lookup-phone">연락처</Label>
              <Input
                id="lookup-phone"
                type="tel"
                required
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lookup-password">비밀번호</Label>
              <Input
                id="lookup-password"
                type="password"
                required
                placeholder="신청 시 입력한 비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  조회 중...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  조회하기
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  // 조회 결과
  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setConsultations(null)
          setEditingId(null)
        }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        다시 조회
      </Button>

      <p className="text-sm text-muted-foreground">
        총 <strong>{consultations.length}</strong>건의 상담 신청이 있습니다.
      </p>

      {consultations.map((c) => (
        <Card key={c.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {c.studentName} ({c.parentName})
              </CardTitle>
              <Badge variant={statusVariant[c.status] || "secondary"}>
                {CONSULTATION_STATUS_LABELS[c.status] || c.status}
              </Badge>
            </div>
            <CardDescription>
              {new Date(c.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editingId === c.id ? (
              <form
                action={(formData) => handleUpdate(c.id, formData)}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>학생 이름</Label>
                    <Input
                      name="studentName"
                      defaultValue={c.studentName}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>이메일</Label>
                    <Input
                      name="email"
                      type="email"
                      defaultValue={c.email || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>학생 학년</Label>
                    <Input
                      name="studentGrade"
                      defaultValue={c.studentGrade || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>관심 과목</Label>
                    <Input
                      name="subject"
                      defaultValue={c.subject || ""}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>상담 내용</Label>
                  <Textarea
                    name="message"
                    rows={4}
                    defaultValue={c.message || ""}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSaving} size="sm">
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    저장
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(null)}
                  >
                    취소
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  {c.studentGrade && (
                    <div>
                      <span className="text-muted-foreground">학년: </span>
                      {c.studentGrade}
                    </div>
                  )}
                  {c.subject && (
                    <div>
                      <span className="text-muted-foreground">관심 과목: </span>
                      {c.subject}
                    </div>
                  )}
                  {c.email && (
                    <div>
                      <span className="text-muted-foreground">이메일: </span>
                      {c.email}
                    </div>
                  )}
                </div>
                {c.message && (
                  <div className="rounded-md bg-muted/50 p-3 text-sm">
                    {c.message}
                  </div>
                )}
                {c.adminNote && (
                  <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
                    <span className="font-medium text-primary">관리자 메모: </span>
                    {c.adminNote}
                  </div>
                )}
                {c.status === "PENDING" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(c.id)}
                  >
                    <Pencil className="mr-2 h-3 w-3" />
                    수정
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

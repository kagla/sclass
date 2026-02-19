"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StudentFormProps {
  action: (formData: FormData) => void
  defaultValues?: {
    name?: string
    email?: string
    phone?: string
    grade?: string
    school?: string
  }
  isEdit?: boolean
  isPending?: boolean
}

export function StudentForm({ action, defaultValues, isEdit, isPending }: StudentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "학생 정보 수정" : "새 학생 등록"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input id="name" name="name" defaultValue={defaultValues?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일 *</Label>
              <Input id="email" name="email" type="email" defaultValue={defaultValues?.email} required disabled={isEdit} />
            </div>
            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호 *</Label>
                <Input id="password" name="password" type="password" required minLength={6} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="phone">연락처</Label>
              <Input id="phone" name="phone" defaultValue={defaultValues?.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">학년</Label>
              <Input id="grade" name="grade" defaultValue={defaultValues?.grade} placeholder="예: 중1, 고2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">학교</Label>
              <Input id="school" name="school" defaultValue={defaultValues?.school} />
            </div>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "처리 중..." : isEdit ? "수정" : "등록"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

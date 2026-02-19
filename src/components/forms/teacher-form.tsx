"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TeacherFormProps {
  action: (formData: FormData) => void
  defaultValues?: {
    name?: string
    email?: string
    phone?: string
    specialization?: string
    bio?: string
  }
  isEdit?: boolean
  isPending?: boolean
}

export function TeacherForm({ action, defaultValues, isEdit, isPending }: TeacherFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "강사 정보 수정" : "새 강사 등록"}</CardTitle>
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
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={defaultValues?.email}
                required
                disabled={isEdit}
              />
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
              <Label htmlFor="specialization">전문 분야</Label>
              <Input
                id="specialization"
                name="specialization"
                defaultValue={defaultValues?.specialization}
                placeholder="예: 수학, 영어"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">소개</Label>
            <Textarea id="bio" name="bio" rows={3} defaultValue={defaultValues?.bio} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "처리 중..." : isEdit ? "수정" : "등록"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

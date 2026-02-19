"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ParentFormProps {
  action: (formData: FormData) => void
  defaultValues?: {
    name?: string
    email?: string
    phone?: string
    relationship?: string
  }
  isEdit?: boolean
  isPending?: boolean
}

export function ParentForm({ action, defaultValues, isEdit, isPending }: ParentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "학부모 정보 수정" : "새 학부모 등록"}</CardTitle>
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
              <Label htmlFor="relationship">관계</Label>
              <Select name="relationship" defaultValue={defaultValues?.relationship || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="부">부</SelectItem>
                  <SelectItem value="모">모</SelectItem>
                  <SelectItem value="조부">조부</SelectItem>
                  <SelectItem value="조모">조모</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
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

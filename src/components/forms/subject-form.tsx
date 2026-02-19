"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SubjectFormProps {
  action: (formData: FormData) => void
  defaultValues?: {
    name?: string
    description?: string
    level?: string
    maxStudents?: number | null
  }
  isEdit?: boolean
  isPending?: boolean
}

export function SubjectForm({ action, defaultValues, isEdit, isPending }: SubjectFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "과목 정보 수정" : "새 과목 등록"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">과목명 *</Label>
              <Input id="name" name="name" defaultValue={defaultValues?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">레벨</Label>
              <Input
                id="level"
                name="level"
                defaultValue={defaultValues?.level}
                placeholder="예: 초급, 중급, 고급"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStudents">최대 수강인원</Label>
              <Input
                id="maxStudents"
                name="maxStudents"
                type="number"
                min={1}
                defaultValue={defaultValues?.maxStudents ?? ""}
                placeholder="예: 20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={defaultValues?.description}
              placeholder="과목에 대한 설명을 입력하세요"
            />
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

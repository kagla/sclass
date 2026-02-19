"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StoryFormProps {
  action: (formData: FormData) => void
  defaultValues?: {
    studentName?: string
    title?: string
    content?: string
    university?: string
    year?: number | null
    isPublished?: boolean
  }
  isEdit?: boolean
}

export function StoryForm({ action, defaultValues, isEdit }: StoryFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "합격수기 수정" : "합격수기 등록"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="studentName">학생 이름 *</Label>
              <Input
                id="studentName"
                name="studentName"
                defaultValue={defaultValues?.studentName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">합격 대학교</Label>
              <Input
                id="university"
                name="university"
                defaultValue={defaultValues?.university}
                placeholder="예: 서울대학교"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">합격 년도</Label>
              <Input
                id="year"
                name="year"
                type="number"
                defaultValue={defaultValues?.year ?? ""}
                placeholder="예: 2025"
                min={2000}
                max={2100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isPublished">공개 여부</Label>
              <Select
                name="isPublished"
                defaultValue={defaultValues?.isPublished ? "true" : "false"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">공개</SelectItem>
                  <SelectItem value="false">비공개</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={defaultValues?.title}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={defaultValues?.content}
              required
              rows={12}
              placeholder="합격 수기를 작성해주세요..."
            />
          </div>
          <Button type="submit">{isEdit ? "수정" : "등록"}</Button>
        </form>
      </CardContent>
    </Card>
  )
}

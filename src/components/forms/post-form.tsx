"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PostFormProps {
  action: (formData: FormData) => void
  boardType?: string
  defaultValues?: {
    title?: string
    content?: string
  }
  isEdit?: boolean
  isPending?: boolean
}

export function PostForm({ action, boardType, defaultValues, isEdit, isPending }: PostFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "게시글 수정" : "새 게시글 작성"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {boardType && (
            <input type="hidden" name="boardType" value={boardType} />
          )}
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={defaultValues?.title}
              required
              placeholder="제목을 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              name="content"
              rows={12}
              defaultValue={defaultValues?.content}
              required
              placeholder="내용을 입력하세요"
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

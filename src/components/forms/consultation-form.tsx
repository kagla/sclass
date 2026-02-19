"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createConsultation } from "@/actions/consultation"
import { toast } from "sonner"
import { Loader2, CheckCircle } from "lucide-react"

export function ConsultationForm() {
  const [isPending, setIsPending] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [privacyChecked, setPrivacyChecked] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    if (!privacyChecked) {
      toast.error("개인정보 수집 및 이용에 동의해주세요")
      return
    }
    formData.set("privacy", "true")

    setIsPending(true)
    const result = await createConsultation(formData)

    if (result.error) {
      toast.error(result.error)
      setIsPending(false)
    } else {
      setIsSubmitted(true)
      setIsPending(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">상담 신청이 완료되었습니다</h3>
          <p className="mt-2 text-muted-foreground">
            빠른 시일 내에 연락 드리겠습니다. 감사합니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>상담 신청</CardTitle>
        <CardDescription>
          아래 양식을 작성해 주시면 담당 상담사가 연락 드립니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="parentName">학부모 성함 *</Label>
              <Input
                id="parentName"
                name="parentName"
                required
                placeholder="홍길동"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentName">학생 이름 *</Label>
              <Input
                id="studentName"
                name="studentName"
                required
                placeholder="홍길순"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">연락처 *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="010-0000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호 *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={4}
                placeholder="조회 시 사용할 비밀번호 (4자 이상)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentGrade">학생 학년</Label>
              <Input
                id="studentGrade"
                name="studentGrade"
                placeholder="예: 중1, 고2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">관심 과목</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="예: 수학, 영어"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">상담 내용</Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              placeholder="상담하고 싶은 내용을 자유롭게 작성해주세요."
            />
          </div>
          <div className="flex items-start gap-2 rounded-md border p-4">
            <Checkbox
              id="privacy"
              checked={privacyChecked}
              onCheckedChange={(checked) => setPrivacyChecked(checked === true)}
            />
            <div className="space-y-1">
              <Label htmlFor="privacy" className="cursor-pointer text-sm font-medium">
                개인정보 수집 및 이용 동의 *
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                상담 진행을 위해 성명, 연락처, 이메일 등의 개인정보를 수집합니다.
                수집된 정보는 상담 목적으로만 사용되며, 상담 완료 후 파기됩니다.
              </p>
            </div>
          </div>
          <Button type="submit" disabled={isPending || !privacyChecked} className="w-full sm:w-auto">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                제출 중...
              </>
            ) : (
              "상담 신청하기"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

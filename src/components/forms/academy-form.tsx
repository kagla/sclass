"use client"

import { useActionState } from "react"
import { updateAcademy } from "@/actions/academy"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect } from "react"

interface AcademyFormProps {
  academy: {
    name: string
    address?: string | null
    detailAddress?: string | null
    phone?: string | null
    fax?: string | null
    email?: string | null
    description?: string | null
    visionStatement?: string | null
  } | null
}

export function AcademyForm({ academy }: AcademyFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) => {
      return await updateAcademy(formData)
    },
    undefined
  )

  useEffect(() => {
    if (state?.success) {
      toast.success("학원 정보가 저장되었습니다")
    }
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <Card>
      <CardHeader>
        <CardTitle>학원 기본 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">학원명 *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={academy?.name || ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={academy?.email || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={academy?.phone || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fax">팩스</Label>
              <Input
                id="fax"
                name="fax"
                defaultValue={academy?.fax || ""}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">주소</Label>
              <Input
                id="address"
                name="address"
                defaultValue={academy?.address || ""}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="detailAddress">상세주소</Label>
              <Input
                id="detailAddress"
                name="detailAddress"
                defaultValue={academy?.detailAddress || ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">학원 소개</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={academy?.description || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visionStatement">교육 비전</Label>
            <Textarea
              id="visionStatement"
              name="visionStatement"
              rows={3}
              defaultValue={academy?.visionStatement || ""}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "저장 중..." : "저장"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

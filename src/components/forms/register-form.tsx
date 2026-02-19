"use client"

import { useActionState } from "react"
import { registerAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await registerAction(formData)
    },
    undefined
  )

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          name="name"
          placeholder="이름을 입력하세요"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="이메일을 입력하세요"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">연락처</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="연락처를 입력하세요"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="6자 이상 입력하세요"
          required
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  )
}

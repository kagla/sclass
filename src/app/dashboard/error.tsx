"use client"

import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">오류가 발생했습니다</h1>
        <p className="text-muted-foreground">
          {error.message || "대시보드를 불러오는 중 오류가 발생했습니다."}
        </p>
      </div>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  )
}

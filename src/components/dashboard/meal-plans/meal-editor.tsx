"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { upsertMealPlan } from "@/actions/meal-plan"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Save, Loader2 } from "lucide-react"

const DAY_LABELS: Record<string, string> = {
  monday: "월요일",
  tuesday: "화요일",
  wednesday: "수요일",
  thursday: "목요일",
  friday: "금요일",
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"]

interface MealData {
  lunch: string
  dinner: string
}

interface MealEditorProps {
  weekStart: string
  initialMeals?: Record<string, MealData> | null
}

export function MealEditor({ weekStart, initialMeals }: MealEditorProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [meals, setMeals] = useState<Record<string, MealData>>(
    initialMeals ||
      DAYS.reduce(
        (acc, day) => ({ ...acc, [day]: { lunch: "", dinner: "" } }),
        {} as Record<string, MealData>
      )
  )

  const updateMeal = (day: string, type: "lunch" | "dinner", value: string) => {
    setMeals((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }))
  }

  const handleSubmit = async () => {
    setIsPending(true)
    const formData = new FormData()
    formData.set("weekStart", weekStart)

    for (const day of DAYS) {
      formData.set(`${day}_lunch`, meals[day]?.lunch || "")
      formData.set(`${day}_dinner`, meals[day]?.dinner || "")
    }

    const result = await upsertMealPlan(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("식단표가 저장되었습니다")
      router.refresh()
    }

    setIsPending(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">주간 식단표</CardTitle>
        <Button onClick={handleSubmit} disabled={isPending} size="sm">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              저장
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-20 pb-3 text-left text-sm font-medium text-muted-foreground">
                  구분
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="pb-3 text-center text-sm font-medium text-muted-foreground"
                  >
                    {DAY_LABELS[day]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-3 text-sm font-medium">점심</td>
                {DAYS.map((day) => (
                  <td key={`${day}_lunch`} className="p-1">
                    <Textarea
                      value={meals[day]?.lunch || ""}
                      onChange={(e) => updateMeal(day, "lunch", e.target.value)}
                      placeholder="메뉴 입력"
                      className="min-h-[80px] text-sm"
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 pr-3 text-sm font-medium">저녁</td>
                {DAYS.map((day) => (
                  <td key={`${day}_dinner`} className="p-1">
                    <Textarea
                      value={meals[day]?.dinner || ""}
                      onChange={(e) => updateMeal(day, "dinner", e.target.value)}
                      placeholder="메뉴 입력"
                      className="min-h-[80px] text-sm"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

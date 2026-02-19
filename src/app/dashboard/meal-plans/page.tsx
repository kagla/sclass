import { getMealPlan } from "@/actions/meal-plan"
import { MealEditor } from "@/components/dashboard/meal-plans/meal-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfWeek, addWeeks, subWeeks } from "date-fns"
import { ko } from "date-fns/locale"

export const metadata = { title: "식단 관리" }

function getMonday(dateStr?: string) {
  const date = dateStr ? new Date(dateStr) : new Date()
  return startOfWeek(date, { weekStartsOn: 1 })
}

export default async function MealPlansPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>
}) {
  const params = await searchParams
  const monday = getMonday(params.week)
  const weekStr = format(monday, "yyyy-MM-dd")

  const prevWeek = format(subWeeks(monday, 1), "yyyy-MM-dd")
  const nextWeek = format(addWeeks(monday, 1), "yyyy-MM-dd")

  const mealPlan = await getMealPlan(weekStr)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">식단 관리</h1>
        <p className="text-muted-foreground">주간 식단표를 관리합니다.</p>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/meal-plans?week=${prevWeek}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            {format(monday, "yyyy년 MM월 dd일", { locale: ko })} 주차
          </h2>
          <p className="text-sm text-muted-foreground">
            {format(monday, "MM/dd")} ~ {format(addWeeks(monday, 0), "MM/dd", { locale: ko }).replace(/\d+\/\d+/, format(new Date(monday.getTime() + 4 * 24 * 60 * 60 * 1000), "MM/dd"))}
          </p>
        </div>
        <Button variant="outline" size="icon" asChild>
          <Link href={`/meal-plans?week=${nextWeek}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <MealEditor weekStart={weekStr} initialMeals={mealPlan?.meals} />
    </div>
  )
}

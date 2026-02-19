"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const ACADEMY_ID = "default-academy"

export async function getMealPlan(weekStart: string) {
  const session = await auth()
  if (!session) {
    throw new Error("로그인이 필요합니다")
  }

  const mealPlan = await prisma.mealPlan.findUnique({
    where: {
      academyId_weekStart: {
        academyId: ACADEMY_ID,
        weekStart: new Date(weekStart),
      },
    },
  })

  if (!mealPlan) return null

  return {
    ...mealPlan,
    meals: JSON.parse(mealPlan.meals) as Record<
      string,
      { lunch: string; dinner: string }
    >,
  }
}

export async function upsertMealPlan(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const weekStart = formData.get("weekStart") as string
  if (!weekStart) {
    return { error: "주차를 선택해주세요" }
  }

  const meals: Record<string, { lunch: string; dinner: string }> = {}
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"]

  for (const day of days) {
    meals[day] = {
      lunch: (formData.get(`${day}_lunch`) as string) || "",
      dinner: (formData.get(`${day}_dinner`) as string) || "",
    }
  }

  await prisma.mealPlan.upsert({
    where: {
      academyId_weekStart: {
        academyId: ACADEMY_ID,
        weekStart: new Date(weekStart),
      },
    },
    create: {
      academyId: ACADEMY_ID,
      weekStart: new Date(weekStart),
      meals: JSON.stringify(meals),
    },
    update: {
      meals: JSON.stringify(meals),
    },
  })

  revalidatePath("/meal-plans")
  return { success: true }
}

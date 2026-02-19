"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { academySchema } from "@/lib/validations/academy"
import { revalidatePath } from "next/cache"

const ACADEMY_ID = "default-academy"

export async function getAcademy() {
  return prisma.academy.findUnique({ where: { id: ACADEMY_ID } })
}

export async function updateAcademy(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const raw = Object.fromEntries(formData)
  const parsed = academySchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.message }
  }

  await prisma.academy.update({
    where: { id: ACADEMY_ID },
    data: {
      name: parsed.data.name,
      address: parsed.data.address || null,
      detailAddress: parsed.data.detailAddress || null,
      phone: parsed.data.phone || null,
      fax: parsed.data.fax || null,
      email: parsed.data.email || null,
      description: parsed.data.description || null,
      visionStatement: parsed.data.visionStatement || null,
    },
  })

  revalidatePath("/dashboard/academy")
  return { success: true }
}

"use server"

import { prisma } from "@/lib/db"
import { hashPassword } from "@/lib/auth-utils"
import { signIn } from "@/lib/auth"
import { registerSchema } from "@/lib/validations/auth"
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"

export async function registerAction(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    phone: formData.get("phone") as string | undefined,
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.message }
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  })
  if (existing) {
    return { error: "이미 등록된 이메일입니다" }
  }

  const hashedPassword = await hashPassword(parsed.data.password)

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
      phone: parsed.data.phone || null,
      role: "STUDENT",
    },
  })

  redirect("/login?registered=true")
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "이메일 또는 비밀번호가 올바르지 않습니다" }
    }
    throw error
  }
}

"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getAttendanceByDate(scheduleId: string, date: string) {
  const session = await auth()
  if (!session) {
    throw new Error("인증이 필요합니다")
  }

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      subject: {
        include: {
          enrollments: {
            where: { status: "ACTIVE" },
            include: {
              student: {
                include: { user: { select: { name: true } } },
              },
            },
          },
        },
      },
    },
  })

  if (!schedule) return null

  const attendances = await prisma.attendance.findMany({
    where: {
      scheduleId,
      date: new Date(date),
    },
    include: {
      student: {
        include: { user: { select: { name: true } } },
      },
    },
  })

  const attendanceMap = new Map(
    attendances.map((a) => [a.studentId, a])
  )

  const students = schedule.subject.enrollments.map((enrollment) => ({
    studentId: enrollment.student.id,
    studentName: enrollment.student.user.name || "",
    status: attendanceMap.get(enrollment.student.id)?.status || null,
    note: attendanceMap.get(enrollment.student.id)?.note || "",
  }))

  return {
    schedule,
    students,
    date,
  }
}

export async function markAttendance(formData: FormData) {
  const session = await auth()
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return { error: "권한이 없습니다" }
  }

  const scheduleId = formData.get("scheduleId") as string
  const date = formData.get("date") as string
  const attendanceData = formData.get("attendanceData") as string

  if (!scheduleId || !date || !attendanceData) {
    return { error: "필수 항목을 입력해주세요" }
  }

  let records: Record<string, { status: string; note?: string }>
  try {
    records = JSON.parse(attendanceData)
  } catch {
    return { error: "출석 데이터 형식이 올바르지 않습니다" }
  }

  const attendanceDate = new Date(date)

  const operations = Object.entries(records).map(([studentId, data]) =>
    prisma.attendance.upsert({
      where: {
        studentId_scheduleId_date: {
          studentId,
          scheduleId,
          date: attendanceDate,
        },
      },
      create: {
        studentId,
        scheduleId,
        date: attendanceDate,
        status: data.status as any,
        note: data.note || null,
      },
      update: {
        status: data.status as any,
        note: data.note || null,
      },
    })
  )

  await prisma.$transaction(operations)

  revalidatePath("/dashboard/schedules")
  return { success: true }
}

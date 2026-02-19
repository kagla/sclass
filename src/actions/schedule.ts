"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const ACADEMY_ID = "default-academy"

export async function getSchedules() {
  const session = await auth()
  if (!session) {
    throw new Error("인증이 필요합니다")
  }

  return prisma.schedule.findMany({
    where: { isActive: true },
    include: {
      subject: { select: { id: true, name: true } },
      teacher: {
        include: { user: { select: { name: true } } },
      },
      classroom: { select: { id: true, name: true } },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  })
}

export async function createSchedule(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const subjectId = formData.get("subjectId") as string
  const teacherId = formData.get("teacherId") as string
  const classroomId = formData.get("classroomId") as string
  const dayOfWeek = formData.get("dayOfWeek") as string
  const startTime = formData.get("startTime") as string
  const endTime = formData.get("endTime") as string

  if (!subjectId || !teacherId || !dayOfWeek || !startTime || !endTime) {
    return { error: "필수 항목을 입력해주세요" }
  }

  if (startTime >= endTime) {
    return { error: "종료 시간은 시작 시간보다 늦어야 합니다" }
  }

  // Conflict detection: same teacher at overlapping times on same day
  const teacherConflict = await prisma.schedule.findFirst({
    where: {
      teacherId,
      dayOfWeek: dayOfWeek as any,
      isActive: true,
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
    include: { subject: { select: { name: true } } },
  })

  if (teacherConflict) {
    return {
      error: `해당 강사는 ${teacherConflict.startTime}~${teacherConflict.endTime}에 "${teacherConflict.subject.name}" 수업이 있습니다`,
    }
  }

  // Conflict detection: same classroom at overlapping times on same day
  if (classroomId) {
    const classroomConflict = await prisma.schedule.findFirst({
      where: {
        classroomId,
        dayOfWeek: dayOfWeek as any,
        isActive: true,
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } },
        ],
      },
      include: {
        subject: { select: { name: true } },
        classroom: { select: { name: true } },
      },
    })

    if (classroomConflict) {
      return {
        error: `"${classroomConflict.classroom?.name}" 교실은 ${classroomConflict.startTime}~${classroomConflict.endTime}에 "${classroomConflict.subject.name}" 수업이 있습니다`,
      }
    }
  }

  await prisma.schedule.create({
    data: {
      subjectId,
      teacherId,
      classroomId: classroomId || null,
      dayOfWeek: dayOfWeek as any,
      startTime,
      endTime,
    },
  })

  revalidatePath("/dashboard/schedules")
  return { success: true }
}

export async function updateSchedule(id: string, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const subjectId = formData.get("subjectId") as string
  const teacherId = formData.get("teacherId") as string
  const classroomId = formData.get("classroomId") as string
  const dayOfWeek = formData.get("dayOfWeek") as string
  const startTime = formData.get("startTime") as string
  const endTime = formData.get("endTime") as string

  if (!subjectId || !teacherId || !dayOfWeek || !startTime || !endTime) {
    return { error: "필수 항목을 입력해주세요" }
  }

  if (startTime >= endTime) {
    return { error: "종료 시간은 시작 시간보다 늦어야 합니다" }
  }

  const existing = await prisma.schedule.findUnique({ where: { id } })
  if (!existing) return { error: "시간표를 찾을 수 없습니다" }

  // Conflict detection: same teacher (excluding current schedule)
  const teacherConflict = await prisma.schedule.findFirst({
    where: {
      id: { not: id },
      teacherId,
      dayOfWeek: dayOfWeek as any,
      isActive: true,
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
    include: { subject: { select: { name: true } } },
  })

  if (teacherConflict) {
    return {
      error: `해당 강사는 ${teacherConflict.startTime}~${teacherConflict.endTime}에 "${teacherConflict.subject.name}" 수업이 있습니다`,
    }
  }

  // Conflict detection: same classroom (excluding current schedule)
  if (classroomId) {
    const classroomConflict = await prisma.schedule.findFirst({
      where: {
        id: { not: id },
        classroomId,
        dayOfWeek: dayOfWeek as any,
        isActive: true,
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } },
        ],
      },
      include: {
        subject: { select: { name: true } },
        classroom: { select: { name: true } },
      },
    })

    if (classroomConflict) {
      return {
        error: `"${classroomConflict.classroom?.name}" 교실은 ${classroomConflict.startTime}~${classroomConflict.endTime}에 "${classroomConflict.subject.name}" 수업이 있습니다`,
      }
    }
  }

  await prisma.schedule.update({
    where: { id },
    data: {
      subjectId,
      teacherId,
      classroomId: classroomId || null,
      dayOfWeek: dayOfWeek as any,
      startTime,
      endTime,
    },
  })

  revalidatePath("/dashboard/schedules")
  return { success: true }
}

export async function deleteSchedule(id: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "권한이 없습니다" }
  }

  const schedule = await prisma.schedule.findUnique({ where: { id } })
  if (!schedule) return { error: "시간표를 찾을 수 없습니다" }

  await prisma.schedule.delete({ where: { id } })

  revalidatePath("/dashboard/schedules")
  return { success: true }
}

export async function getAllClassrooms() {
  return prisma.classroom.findMany({
    where: { academyId: ACADEMY_ID },
    orderBy: { name: "asc" },
    select: { id: true, name: true, capacity: true },
  })
}

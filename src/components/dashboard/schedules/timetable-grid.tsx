"use client"

import { useState } from "react"
import { DAY_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { deleteSchedule } from "@/actions/schedule"
import { toast } from "sonner"
import { ScheduleDialog } from "./schedule-dialog"

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const

const TIME_SLOTS: string[] = []
for (let h = 8; h < 22; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`)
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:30`)
}

const COLORS = [
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-green-100 border-green-300 text-green-800",
  "bg-purple-100 border-purple-300 text-purple-800",
  "bg-orange-100 border-orange-300 text-orange-800",
  "bg-pink-100 border-pink-300 text-pink-800",
  "bg-teal-100 border-teal-300 text-teal-800",
  "bg-indigo-100 border-indigo-300 text-indigo-800",
  "bg-rose-100 border-rose-300 text-rose-800",
  "bg-amber-100 border-amber-300 text-amber-800",
  "bg-cyan-100 border-cyan-300 text-cyan-800",
]

function hashColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

function timeToRow(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return (h - 8) * 2 + (m >= 30 ? 1 : 0) + 2 // +2 for header row (1-based grid)
}

type Schedule = {
  id: string
  subjectId: string
  teacherId: string
  classroomId: string | null
  dayOfWeek: string
  startTime: string
  endTime: string
  subject: { id: string; name: string }
  teacher: { id: string; user: { name: string | null } }
  classroom: { id: string; name: string } | null
}

type Subject = { id: string; name: string }
type Teacher = { id: string; user: { name: string | null } }
type Classroom = { id: string; name: string; capacity: number | null }

interface TimetableGridProps {
  schedules: Schedule[]
  subjects: Subject[]
  teachers: Teacher[]
  classrooms: Classroom[]
}

export function TimetableGrid({
  schedules,
  subjects,
  teachers,
  classrooms,
}: TimetableGridProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)

  const handleAdd = () => {
    setEditingSchedule(null)
    setDialogOpen(true)
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    const result = await deleteSchedule(id)
    if (result?.error) toast.error(result.error)
    else toast.success("삭제되었습니다")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          수업 추가
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <div
          className="grid min-w-[800px]"
          style={{
            gridTemplateColumns: "80px repeat(6, 1fr)",
            gridTemplateRows: `40px repeat(${TIME_SLOTS.length}, 28px)`,
          }}
        >
          {/* Header row */}
          <div className="sticky left-0 z-10 bg-muted border-b border-r flex items-center justify-center text-xs font-medium text-muted-foreground">
            시간
          </div>
          {DAYS.map((day) => (
            <div
              key={day}
              className="bg-muted border-b border-r last:border-r-0 flex items-center justify-center text-sm font-medium"
            >
              {DAY_LABELS[day]}
            </div>
          ))}

          {/* Time slot rows */}
          {TIME_SLOTS.map((time, index) => (
            <div
              key={time}
              className="sticky left-0 z-10 bg-background border-r flex items-center justify-center text-xs text-muted-foreground"
              style={{
                gridRow: index + 2,
                gridColumn: 1,
                borderBottom: time.endsWith(":00") ? "1px solid hsl(var(--border))" : "1px dashed hsl(var(--border) / 0.4)",
              }}
            >
              {time.endsWith(":00") ? time : ""}
            </div>
          ))}

          {/* Day column backgrounds */}
          {DAYS.map((_, dayIndex) => (
            <div
              key={`bg-${dayIndex}`}
              className="border-r last:border-r-0"
              style={{
                gridRow: `2 / ${TIME_SLOTS.length + 2}`,
                gridColumn: dayIndex + 2,
              }}
            />
          ))}

          {/* Grid lines for time slots */}
          {TIME_SLOTS.map((time, index) =>
            DAYS.map((_, dayIndex) => (
              <div
                key={`cell-${index}-${dayIndex}`}
                style={{
                  gridRow: index + 2,
                  gridColumn: dayIndex + 2,
                  borderBottom: time.endsWith(":00")
                    ? "1px solid hsl(var(--border))"
                    : "1px dashed hsl(var(--border) / 0.4)",
                  borderRight: dayIndex < DAYS.length - 1 ? "1px solid hsl(var(--border))" : undefined,
                }}
              />
            ))
          )}

          {/* Schedule blocks */}
          {schedules.map((schedule) => {
            const dayIndex = DAYS.indexOf(schedule.dayOfWeek as any)
            if (dayIndex === -1) return null

            const rowStart = timeToRow(schedule.startTime)
            const rowEnd = timeToRow(schedule.endTime)
            const colorClass = hashColor(schedule.subject.name)

            return (
              <div
                key={schedule.id}
                className={`${colorClass} border rounded-sm mx-0.5 p-1 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity group relative z-[5]`}
                style={{
                  gridRow: `${rowStart} / ${rowEnd}`,
                  gridColumn: dayIndex + 2,
                }}
                onClick={() => handleEdit(schedule)}
              >
                <div className="text-xs font-semibold truncate">
                  {schedule.subject.name}
                </div>
                <div className="text-[10px] truncate">
                  {schedule.teacher.user.name}
                </div>
                {schedule.classroom && (
                  <div className="text-[10px] truncate">
                    {schedule.classroom.name}
                  </div>
                )}
                <div className="text-[10px] truncate">
                  {schedule.startTime}~{schedule.endTime}
                </div>
                <div className="absolute top-0.5 right-0.5 hidden group-hover:flex gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(schedule)
                    }}
                    className="p-0.5 rounded bg-white/80 hover:bg-white"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(schedule.id)
                    }}
                    className="p-0.5 rounded bg-white/80 hover:bg-white text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        schedule={editingSchedule}
        subjects={subjects}
        teachers={teachers}
        classrooms={classrooms}
      />
    </div>
  )
}

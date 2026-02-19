"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createSchedule, updateSchedule } from "@/actions/schedule"
import { toast } from "sonner"
import { DAY_LABELS } from "@/lib/constants"

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const

const TIME_OPTIONS: string[] = []
for (let h = 8; h <= 22; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:00`)
  if (h < 22) {
    TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:30`)
  }
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

interface ScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule: Schedule | null
  subjects: Subject[]
  teachers: Teacher[]
  classrooms: Classroom[]
}

export function ScheduleDialog({
  open,
  onOpenChange,
  schedule,
  subjects,
  teachers,
  classrooms,
}: ScheduleDialogProps) {
  const isEdit = !!schedule
  const [pending, setPending] = useState(false)
  const [subjectId, setSubjectId] = useState("")
  const [teacherId, setTeacherId] = useState("")
  const [classroomId, setClassroomId] = useState("")
  const [dayOfWeek, setDayOfWeek] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  useEffect(() => {
    if (schedule) {
      setSubjectId(schedule.subjectId)
      setTeacherId(schedule.teacherId)
      setClassroomId(schedule.classroomId || "")
      setDayOfWeek(schedule.dayOfWeek)
      setStartTime(schedule.startTime)
      setEndTime(schedule.endTime)
    } else {
      setSubjectId("")
      setTeacherId("")
      setClassroomId("")
      setDayOfWeek("")
      setStartTime("")
      setEndTime("")
    }
  }, [schedule, open])

  const handleSubmit = async () => {
    setPending(true)
    const formData = new FormData()
    formData.set("subjectId", subjectId)
    formData.set("teacherId", teacherId)
    formData.set("classroomId", classroomId)
    formData.set("dayOfWeek", dayOfWeek)
    formData.set("startTime", startTime)
    formData.set("endTime", endTime)

    const result = isEdit
      ? await updateSchedule(schedule.id, formData)
      : await createSchedule(formData)

    setPending(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(isEdit ? "수정되었습니다" : "등록되었습니다")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "수업 수정" : "수업 추가"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>과목 *</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="과목 선택" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>강사 *</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="강사 선택" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>교실</Label>
            <Select value={classroomId} onValueChange={setClassroomId}>
              <SelectTrigger>
                <SelectValue placeholder="교실 선택 (선택사항)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">없음</SelectItem>
                {classrooms.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                    {c.capacity ? ` (정원 ${c.capacity}명)` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>요일 *</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger>
                <SelectValue placeholder="요일 선택" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day} value={day}>
                    {DAY_LABELS[day]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>시작 시간 *</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <SelectValue placeholder="시작" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem key={`start-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>종료 시간 *</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger>
                  <SelectValue placeholder="종료" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem key={`end-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={pending}>
              {pending ? "처리 중..." : isEdit ? "수정" : "등록"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

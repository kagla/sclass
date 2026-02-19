import { getSchedules, getAllClassrooms } from "@/actions/schedule"
import { getAllSubjects, getAllTeachers } from "@/actions/subject"
import { TimetableGrid } from "@/components/dashboard/schedules/timetable-grid"

export const metadata = { title: "시간표" }

export default async function SchedulesPage() {
  const [schedules, subjects, teachers, classrooms] = await Promise.all([
    getSchedules(),
    getAllSubjects(),
    getAllTeachers(),
    getAllClassrooms(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">시간표</h1>
        <p className="text-muted-foreground">주간 수업 시간표를 관리합니다.</p>
      </div>
      <TimetableGrid
        schedules={schedules as any}
        subjects={subjects}
        teachers={teachers as any}
        classrooms={classrooms}
      />
    </div>
  )
}

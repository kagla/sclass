import { createStudent } from "@/actions/student"
import { StudentForm } from "@/components/forms/student-form"

export const metadata = { title: "학생 등록" }

export default function NewStudentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">학생 등록</h1>
        <p className="text-muted-foreground">새 학생을 등록합니다.</p>
      </div>
      <StudentForm action={createStudent} />
    </div>
  )
}

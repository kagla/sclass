import { createTeacher } from "@/actions/teacher"
import { TeacherForm } from "@/components/forms/teacher-form"

export const metadata = { title: "강사 등록" }

export default function NewTeacherPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">강사 등록</h1>
        <p className="text-muted-foreground">새 강사를 등록합니다.</p>
      </div>
      <TeacherForm action={createTeacher} />
    </div>
  )
}

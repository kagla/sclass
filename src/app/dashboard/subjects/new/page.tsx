import { createSubject } from "@/actions/subject"
import { SubjectForm } from "@/components/forms/subject-form"

export const metadata = { title: "과목 등록" }

export default function NewSubjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">과목 등록</h1>
        <p className="text-muted-foreground">새 과목을 등록합니다.</p>
      </div>
      <SubjectForm action={createSubject} />
    </div>
  )
}

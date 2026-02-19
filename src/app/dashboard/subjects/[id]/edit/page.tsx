import { notFound } from "next/navigation"
import { getSubject, updateSubject } from "@/actions/subject"
import { SubjectForm } from "@/components/forms/subject-form"

export const metadata = { title: "과목 수정" }

export default async function EditSubjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const subject = await getSubject(id)
  if (!subject) notFound()

  const action = updateSubject.bind(null, id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">과목 수정</h1>
        <p className="text-muted-foreground">{subject.name} 과목의 정보를 수정합니다.</p>
      </div>
      <SubjectForm
        action={action}
        isEdit
        defaultValues={{
          name: subject.name,
          description: subject.description || "",
          level: subject.level || "",
          maxStudents: subject.maxStudents,
        }}
      />
    </div>
  )
}

import { notFound } from "next/navigation"
import { getStudent, updateStudent } from "@/actions/student"
import { StudentForm } from "@/components/forms/student-form"

export const metadata = { title: "학생 수정" }

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const student = await getStudent(id)
  if (!student) notFound()

  const action = updateStudent.bind(null, id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">학생 수정</h1>
        <p className="text-muted-foreground">{student.user.name}님의 정보를 수정합니다.</p>
      </div>
      <StudentForm
        action={action}
        isEdit
        defaultValues={{
          name: student.user.name || "",
          email: student.user.email,
          phone: student.user.phone || "",
          grade: student.grade || "",
          school: student.school || "",
        }}
      />
    </div>
  )
}

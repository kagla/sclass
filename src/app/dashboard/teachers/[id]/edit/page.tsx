import { notFound } from "next/navigation"
import { getTeacher, updateTeacher } from "@/actions/teacher"
import { TeacherForm } from "@/components/forms/teacher-form"

export const metadata = { title: "강사 수정" }

export default async function EditTeacherPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const teacher = await getTeacher(id)
  if (!teacher) notFound()

  const action = updateTeacher.bind(null, id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">강사 수정</h1>
        <p className="text-muted-foreground">{teacher.user.name}님의 정보를 수정합니다.</p>
      </div>
      <TeacherForm
        action={action}
        isEdit
        defaultValues={{
          name: teacher.user.name || "",
          email: teacher.user.email,
          phone: teacher.user.phone || "",
          specialization: teacher.specialization || "",
          bio: teacher.bio || "",
        }}
      />
    </div>
  )
}

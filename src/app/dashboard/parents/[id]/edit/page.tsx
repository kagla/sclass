import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { updateParent } from "@/actions/parent"
import { ParentForm } from "@/components/forms/parent-form"

export const metadata = { title: "학부모 수정" }

export default async function EditParentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const parent = await prisma.parent.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true, phone: true } } },
  })
  if (!parent) notFound()

  const action = updateParent.bind(null, id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">학부모 수정</h1>
        <p className="text-muted-foreground">{parent.user.name}님의 정보를 수정합니다.</p>
      </div>
      <ParentForm
        action={action}
        isEdit
        defaultValues={{
          name: parent.user.name || "",
          email: parent.user.email,
          phone: parent.user.phone || "",
          relationship: parent.relationship || "",
        }}
      />
    </div>
  )
}

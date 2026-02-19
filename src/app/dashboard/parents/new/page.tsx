import { createParent } from "@/actions/parent"
import { ParentForm } from "@/components/forms/parent-form"

export const metadata = { title: "학부모 등록" }

export default function NewParentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">학부모 등록</h1>
        <p className="text-muted-foreground">새 학부모를 등록합니다.</p>
      </div>
      <ParentForm action={createParent} />
    </div>
  )
}

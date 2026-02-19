import { getAcademy } from "@/actions/academy"
import { AcademyForm } from "@/components/forms/academy-form"

export const metadata = { title: "학원 관리" }

export default async function AcademyPage() {
  const academy = await getAcademy()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">학원 관리</h1>
        <p className="text-muted-foreground">학원의 기본 정보를 관리합니다.</p>
      </div>
      <AcademyForm academy={academy} />
    </div>
  )
}

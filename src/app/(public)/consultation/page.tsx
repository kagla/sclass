import { ConsultationTabs } from "@/components/forms/consultation-tabs"

export const metadata = { title: "상담신청" }

export default function ConsultationPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              상담 신청
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              아래 양식을 작성해 주시면 빠른 시일 내에 연락 드리겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs: 신청 / 조회 */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <ConsultationTabs />
        </div>
      </section>
    </div>
  )
}

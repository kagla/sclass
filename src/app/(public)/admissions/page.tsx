import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight,
  ClipboardList,
  PhoneCall,
  UserCheck,
  BookOpen,
} from "lucide-react"

export const metadata = { title: "입학안내" }

const steps = [
  {
    icon: PhoneCall,
    step: "01",
    title: "상담 신청",
    description:
      "온라인 또는 전화로 상담을 신청하세요. 학생의 현재 학습 상황과 목표를 파악합니다.",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "레벨 테스트",
    description:
      "학생의 현재 수준을 정확히 파악하기 위한 진단 평가를 실시합니다.",
  },
  {
    icon: UserCheck,
    step: "03",
    title: "맞춤 상담",
    description:
      "진단 결과를 바탕으로 학생에게 최적화된 교육 프로그램을 안내합니다.",
  },
  {
    icon: BookOpen,
    step: "04",
    title: "수강 등록",
    description:
      "상담 후 적합한 반에 배정되어 수업을 시작합니다.",
  },
]

export default function AdmissionsPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              입학안내
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              S-Class 학원 입학 절차를 안내합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold">입학 절차</h2>
            <div className="mt-12 space-y-8">
              {steps.map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <item.icon className="h-5 w-5" />
                    </div>
                    {i < steps.length - 1 && (
                      <div className="mt-2 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="pb-8">
                    <div className="text-xs font-semibold text-primary">
                      STEP {item.step}
                    </div>
                    <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="border-t bg-muted/20 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">준비물</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    학생 및 학부모 신분증
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    최근 성적표 또는 모의고사 성적
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    수강료 납부를 위한 결제 수단
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">유의사항</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    레벨 테스트는 무료로 진행됩니다
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    상담 후 7일 이내 등록 시 할인 혜택 제공
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    환불 규정은 학원법에 따릅니다
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">지금 바로 시작하세요</h2>
            <p className="mt-4 text-muted-foreground">
              온라인으로 간편하게 상담을 신청하실 수 있습니다.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/consultation">
                상담 신청하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

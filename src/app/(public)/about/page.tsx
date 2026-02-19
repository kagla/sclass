import { prisma } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Target, Eye } from "lucide-react"

export const metadata = { title: "학원소개" }

const ACADEMY_ID = "default-academy"

export default async function AboutPage() {
  const academy = await prisma.academy.findUnique({
    where: { id: ACADEMY_ID },
  })

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              학원소개
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {academy?.name || "S-Class 학원"}의 교육 철학과 비전을 소개합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex rounded-lg bg-primary/10 p-3">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">
                {academy?.name || "S-Class 학원"}
              </h2>
              {academy?.description ? (
                <div className="space-y-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                  {academy.description}
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  S-Class 학원은 학생 개개인의 잠재력을 최대한 이끌어내는 것을
                  목표로 합니다. 체계적인 커리큘럼과 전문 강사진의 밀착 관리를
                  통해 학생들이 자신의 목표를 달성할 수 있도록 최선의 교육
                  환경을 제공합니다.
                </p>
              )}
            </div>

            <div className="space-y-6">
              <Card className="border-0 bg-muted/30">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">교육 목표</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      학생 맞춤형 교육을 통해 학업 성취도를 극대화하고, 자기주도
                      학습 능력을 키워 미래를 스스로 개척하는 인재를 양성합니다.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-muted/30">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">비전</h3>
                    {academy?.visionStatement ? (
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {academy.visionStatement}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        대한민국 최고의 교육 기관으로서 학생들의 꿈과 미래를
                        함께 만들어 나가겠습니다.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Hours */}
      {academy?.operatingHours && (
        <section className="border-t bg-muted/20 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold">운영 시간</h2>
              <div className="mt-6 whitespace-pre-line text-muted-foreground">
                {academy.operatingHours}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold">오시는 길</h2>
            <div className="mt-6 space-y-2 text-muted-foreground">
              {academy?.address && (
                <p>
                  {academy.address}
                  {academy.detailAddress && ` ${academy.detailAddress}`}
                </p>
              )}
              {academy?.phone && <p>TEL: {academy.phone}</p>}
              {academy?.fax && <p>FAX: {academy.fax}</p>}
              {academy?.email && <p>EMAIL: {academy.email}</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

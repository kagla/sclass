import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import {
  GraduationCap,
  Users,
  BookOpen,
  Trophy,
  ArrowRight,
  Star,
  Target,
  Sparkles,
} from "lucide-react"

const ACADEMY_ID = "default-academy"

async function getStats() {
  const [studentCount, teacherCount, subjectCount, storyCount] = await Promise.all([
    prisma.student.count({ where: { academyId: ACADEMY_ID, isActive: true } }),
    prisma.teacher.count({ where: { academyId: ACADEMY_ID, isActive: true } }),
    prisma.subject.count({ where: { academyId: ACADEMY_ID, isActive: true } }),
    prisma.successStory.count({ where: { academyId: ACADEMY_ID, isPublished: true } }),
  ])

  return { studentCount, teacherCount, subjectCount, storyCount }
}

const features = [
  {
    icon: Target,
    title: "맞춤형 교육",
    description:
      "학생 개개인의 수준과 목표에 맞춘 체계적인 커리큘럼으로 최적의 학습 효과를 제공합니다.",
  },
  {
    icon: Star,
    title: "전문 강사진",
    description:
      "풍부한 교육 경험과 전문성을 갖춘 강사진이 학생들의 성장을 책임집니다.",
  },
  {
    icon: Sparkles,
    title: "체계적 관리",
    description:
      "출결, 성적, 상담까지 체계적인 학생 관리 시스템으로 학부모님께 신뢰를 드립니다.",
  },
]

export default async function HomePage() {
  const stats = await getStats()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
              <GraduationCap className="h-4 w-4 text-primary" />
              최고의 교육, 최상의 결과
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-primary">S-Class</span> 학원
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              체계적인 커리큘럼과 전문 강사진이 학생 한 명 한 명의 잠재력을
              최대한 이끌어냅니다. 꿈을 향한 여정을 S-Class와 함께하세요.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/consultation">
                  상담 신청하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/programs">교육과정 보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              왜 S-Class인가요?
            </h2>
            <p className="mt-4 text-muted-foreground">
              S-Class만의 차별화된 교육 시스템을 소개합니다.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="border-0 bg-muted/30 transition-colors hover:bg-muted/50"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/20 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stats.studentCount}</div>
              <div className="mt-1 text-sm text-muted-foreground">재원생</div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stats.teacherCount}</div>
              <div className="mt-1 text-sm text-muted-foreground">전문 강사</div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stats.subjectCount}</div>
              <div className="mt-1 text-sm text-muted-foreground">교육 과정</div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stats.storyCount}</div>
              <div className="mt-1 text-sm text-muted-foreground">합격 수기</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight">
              지금 바로 상담을 시작하세요
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              전문 상담사가 학생의 현재 수준과 목표에 맞는 최적의 교육 프로그램을
              안내해 드립니다.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Link href="/consultation">
                  무료 상담 신청
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
              >
                <Link href="/about">학원 알아보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

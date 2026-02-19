import { GraduationCap, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/db"

const ACADEMY_ID = "default-academy"

async function getAcademyInfo() {
  return prisma.academy.findUnique({
    where: { id: ACADEMY_ID },
    select: {
      name: true,
      address: true,
      detailAddress: true,
      phone: true,
      fax: true,
      email: true,
    },
  })
}

export async function Footer() {
  const academy = await getAcademyInfo()

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">{academy?.name || "S-Class 학원"}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              최고의 교육으로 학생들의 꿈을 실현합니다.
              체계적인 커리큘럼과 전문 강사진이 함께합니다.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">바로가기</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">
                학원소개
              </Link>
              <Link href="/programs" className="hover:text-foreground transition-colors">
                교육과정
              </Link>
              <Link href="/faculty" className="hover:text-foreground transition-colors">
                강사소개
              </Link>
              <Link href="/admissions" className="hover:text-foreground transition-colors">
                입학안내
              </Link>
              <Link href="/consultation" className="hover:text-foreground transition-colors">
                상담신청
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">연락처</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              {academy?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    {academy.address}
                    {academy.detailAddress && ` ${academy.detailAddress}`}
                  </span>
                </div>
              )}
              {academy?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{academy.phone}</span>
                </div>
              )}
              {academy?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a
                    href={`mailto:${academy.email}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {academy.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {academy?.name || "S-Class 학원"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

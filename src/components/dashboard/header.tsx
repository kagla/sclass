"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ThemeToggle } from "./theme-toggle"

const pathLabels: Record<string, string> = {
  dashboard: "대시보드",
  academy: "학원 관리",
  teachers: "강사 관리",
  students: "학생 관리",
  parents: "학부모 관리",
  subjects: "과목 관리",
  schedules: "시간표",
  payments: "수납 관리",
  boards: "게시판",
  "meal-plans": "식단표",
  stories: "합격수기",
  consultations: "상담 관리",
  new: "등록",
  edit: "수정",
}

export function DashboardHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1
            const label = pathLabels[segment] || segment
            const href = "/" + segments.slice(0, index + 1).join("/")

            return (
              <React.Fragment key={segment + index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  )
}

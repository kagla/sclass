"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { GraduationCap, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/about", label: "학원소개" },
  { href: "/programs", label: "교육과정" },
  { href: "/faculty", label: "강사소개" },
  { href: "/admissions", label: "입학안내" },
  { href: "/stories", label: "합격수기" },
  { href: "/community/notice", label: "커뮤니티" },
  { href: "/consultation", label: "상담신청" },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">S-Class</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="default" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">로그인</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 pt-8">
                <Link
                  href="/"
                  className="flex items-center gap-2 pb-4"
                  onClick={() => setOpen(false)}
                >
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold">S-Class</span>
                </Link>
                <nav className="flex flex-col gap-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="pt-4">
                  <Button asChild className="w-full">
                    <Link href="/login" onClick={() => setOpen(false)}>
                      로그인
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

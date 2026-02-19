import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, HelpCircle } from "lucide-react"

export const metadata = { title: "게시판" }

const boards = [
  {
    type: "NOTICE",
    title: "공지사항",
    description: "학원 공지사항을 확인하세요.",
    icon: FileText,
  },
  {
    type: "PARENT",
    title: "학부모 게시판",
    description: "학부모님들의 소통 공간입니다.",
    icon: Users,
  },
  {
    type: "INQUIRY",
    title: "문의 게시판",
    description: "궁금한 사항을 문의해주세요.",
    icon: HelpCircle,
  },
]

export default function BoardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">게시판</h1>
        <p className="text-muted-foreground">게시판을 선택하세요.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {boards.map((board) => (
          <Link key={board.type} href={`/dashboard/boards/${board.type}`}>
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-3">
                <board.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-lg">{board.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {board.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

export const metadata = { title: "합격수기" }

const ACADEMY_ID = "default-academy"

export default async function StoriesPage() {
  const stories = await prisma.successStory.findMany({
    where: { academyId: ACADEMY_ID, isPublished: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              합격수기
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              S-Class 학원 졸업생들의 합격 이야기를 만나보세요.
            </p>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {stories.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {stories.map((story) => (
                <Card
                  key={story.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{story.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{story.studentName}</span>
                          {story.university && (
                            <>
                              <span className="text-border">|</span>
                              <span>{story.university}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {story.year && (
                          <Badge variant="outline">{story.year}년</Badge>
                        )}
                        <div className="rounded-full bg-primary/10 p-1.5">
                          <Trophy className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6 whitespace-pre-line">
                      {story.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border text-muted-foreground">
              등록된 합격수기가 없습니다.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

import Link from "next/link"
import { getStories, deleteStory } from "@/actions/story"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Trophy } from "lucide-react"
import { format } from "date-fns"
import { DeleteStoryButton } from "./delete-story-button"

export const metadata = { title: "합격수기 관리" }

export default async function StoriesManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const result = await getStories({
    page: Number(params.page) || 1,
    search: params.search || "",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">합격수기 관리</h1>
          <p className="text-muted-foreground">총 {result.total}건</p>
        </div>
        <Button asChild>
          <Link href="/stories/new">
            <Plus className="mr-2 h-4 w-4" />
            합격수기 등록
          </Link>
        </Button>
      </div>

      {result.data.length > 0 ? (
        <div className="space-y-3">
          {result.data.map((story) => (
            <Card key={story.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium">{story.title}</h3>
                    <Badge variant={story.isPublished ? "default" : "secondary"}>
                      {story.isPublished ? "공개" : "비공개"}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{story.studentName}</span>
                    {story.university && <span>{story.university}</span>}
                    {story.year && <span>{story.year}년</span>}
                    <span>{format(new Date(story.createdAt), "yyyy-MM-dd")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/stories/${story.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteStoryButton id={story.id} />
                </div>
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
  )
}

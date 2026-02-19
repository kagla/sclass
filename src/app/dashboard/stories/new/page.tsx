import { createStory } from "@/actions/story"
import { StoryForm } from "@/components/forms/story-form"

export const metadata = { title: "합격수기 등록" }

export default function NewStoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">합격수기 등록</h1>
        <p className="text-muted-foreground">새 합격수기를 등록합니다.</p>
      </div>
      <StoryForm action={createStory} />
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteStory } from "@/actions/story"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function DeleteStoryButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    const result = await deleteStory(id)
    if (result?.error) toast.error(result.error)
    else {
      toast.success("삭제되었습니다")
      router.refresh()
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Reply } from "lucide-react"
import { createComment, deleteComment } from "@/actions/comment"
import { toast } from "sonner"
import { ROLE_LABELS } from "@/lib/constants"

type CommentType = {
  id: string
  content: string
  createdAt: Date
  author: { id: string; name: string | null; role: string }
  replies: {
    id: string
    content: string
    createdAt: Date
    author: { id: string; name: string | null; role: string }
  }[]
}

interface CommentSectionProps {
  postId: string
  comments: CommentType[]
  currentUserId?: string
  currentUserRole?: string
}

export function CommentSection({
  postId,
  comments,
  currentUserId,
  currentUserRole,
}: CommentSectionProps) {
  const [content, setContent] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [pending, setPending] = useState(false)

  const handleSubmitComment = async () => {
    if (!content.trim()) return
    setPending(true)

    const formData = new FormData()
    formData.set("postId", postId)
    formData.set("content", content)

    const result = await createComment(formData)
    setPending(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      setContent("")
      toast.success("댓글이 등록되었습니다")
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return
    setPending(true)

    const formData = new FormData()
    formData.set("postId", postId)
    formData.set("content", replyContent)
    formData.set("parentId", parentId)

    const result = await createComment(formData)
    setPending(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      setReplyContent("")
      setReplyTo(null)
      toast.success("답글이 등록되었습니다")
    }
  }

  const handleDeleteComment = async (id: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return
    const result = await deleteComment(id)
    if (result?.error) toast.error(result.error)
    else toast.success("삭제되었습니다")
  }

  const canDelete = (authorId: string) => {
    return currentUserId === authorId || currentUserRole === "ADMIN"
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">댓글 ({comments.length})</h3>

      {/* Comment input */}
      <div className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
          rows={3}
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment} disabled={pending || !content.trim()}>
            {pending ? "등록 중..." : "댓글 등록"}
          </Button>
        </div>
      </div>

      {/* Comment list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {/* Parent comment */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {ROLE_LABELS[comment.author.role] || comment.author.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setReplyTo(replyTo === comment.id ? null : comment.id)
                    }
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    답글
                  </Button>
                  {canDelete(comment.author.id) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>

            {/* Reply input */}
            {replyTo === comment.id && (
              <div className="ml-8 space-y-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글을 입력하세요"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyTo(null)
                      setReplyContent("")
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={pending || !replyContent.trim()}
                  >
                    답글 등록
                  </Button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="ml-8 space-y-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="rounded-lg border bg-muted/50 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{reply.author.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {ROLE_LABELS[reply.author.role] || reply.author.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(reply.createdAt).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {canDelete(reply.author.id) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(reply.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요.
          </p>
        )}
      </div>
    </div>
  )
}

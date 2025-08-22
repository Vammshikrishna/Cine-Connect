"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share2, MapPin, Users, MoreHorizontal, Send } from "lucide-react"

const formatDistanceToNow = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

interface Post {
  id: string
  user_id: string
  content: string
  media_urls?: string[]
  media_types?: string[]
  project_title?: string
  craft_tags?: string[]
  location?: string
  collaboration_open: boolean
  likes_count: number
  comments_count: number
  shares_count: number
  created_at: string
  user: {
    name: string
    username: string
    avatar_url?: string
    primary_craft: string
    verified: boolean
  }
  is_liked?: boolean
}

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string, content: string) => void
}

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isLiking, setIsLiking] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    await onLike?.(post.id)
    setIsLiking(false)
  }

  const handleComment = async () => {
    if (!commentText.trim() || isCommenting) return
    setIsCommenting(true)
    await onComment?.(post.id, commentText)
    setCommentText("")
    setIsCommenting(false)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.user.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>
                {post.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{post.user.name}</h3>
                {post.user.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>@{post.user.username}</span>
                <span>•</span>
                <Badge variant="outline" className="text-xs py-0">
                  {post.user.primary_craft}
                </Badge>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(post.created_at))}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Title */}
        {post.project_title && <div className="font-medium text-lg">{post.project_title}</div>}

        {/* Content */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</div>

        {/* Media */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div
            className={`grid gap-2 ${
              post.media_urls.length === 1
                ? "grid-cols-1"
                : post.media_urls.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {post.media_urls.map((url, index) => (
              <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Post media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Tags and Meta */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {post.craft_tags &&
            post.craft_tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          {post.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {post.location}
            </div>
          )}
          {post.collaboration_open && (
            <div className="flex items-center gap-1 text-green-600">
              <Users className="h-3 w-3" />
              Open for collaboration
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 ${post.is_liked ? "text-red-500" : ""}`}
            >
              <Heart className={`h-4 w-4 ${post.is_liked ? "fill-current" : ""}`} />
              {post.likes_count}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              {post.comments_count}
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              {post.shares_count}
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-3 pt-3 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[60px] resize-none"
                disabled={isCommenting}
              />
              <Button onClick={handleComment} disabled={!commentText.trim() || isCommenting} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-gray-500">Comments will be loaded here...</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

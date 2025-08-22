"use client"

import { useState, useEffect } from "react"
import { PostCard } from "./post-card"
import { CreatePost } from "./create-post"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

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

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts/feed", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error("Fetch posts error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, is_liked: data.liked, likes_count: data.likes_count } : post,
          ),
        )
      }
    } catch (error) {
      console.error("Like post error:", error)
    }
  }

  const handleComment = async (postId: string, content: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(posts.map((post) => (post.id === postId ? { ...post, comments_count: data.comments_count } : post)))
      }
    } catch (error) {
      console.error("Comment post error:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CreatePost onPostCreated={fetchPosts} />

      {posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No posts yet. Be the first to share something!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} />
          ))}
        </div>
      )}
    </div>
  )
}

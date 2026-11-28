"use client";

import { supabaseClient } from "@/supabase";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Heart,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

const supabase = supabaseClient;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data, error } = await supabase.from("posts").select(`
          *,
          profile (
            username,
            profileimage
          ), comments(count), like( userId)
        `);

        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }

        setPosts(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);
  const getUser = async () => {
    const response = await supabase.auth.getUser();
    setUserId(response.data.user.id);
  };
  useEffect(() => {
    getUser();
  }, []);
  const redirectCommentPage = (postId) => {
    router.push(`/comment/${postId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-7 h-7 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
      </div>
    );
  }
  const toggleLike = async (postId, likedUsers) => {
    const userIds = Object.values(likedUsers).map((like) => like.userId);
    if (userIds.includes(userId)) {
      const response = await supabase
        .from("like")
        .delete()
        .eq("postId", postId)
        .eq("userId", userId);
      console.log(response);
      return;
    }else {
      const response = await supabase.from("like").insert({
        postId: postId,
        userId: userId,
      });
      console.log(response);
    }
      
  }
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm border-x border-zinc-200/80">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-200/70">
          <span className="text-xl font-bold tracking-tight italic">
            Instagram
          </span>
          <div className="flex items-center gap-4">
            <Heart
              size={22}
              className="cursor-pointer hover:text-zinc-500 transition-colors"
            />
            <Send
              size={22}
              className="cursor-pointer hover:text-zinc-500 transition-colors"
            />
          </div>
        </div>

        {/* Stories */}
        <div className="flex items-center gap-3.5 px-4 py-3.5 overflow-x-auto border-b border-zinc-200/70">
          {["Your story", "Explore", "Friends", "Moments"].map((story) => (
            <div
              key={story}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
            >
              <div className="p-[2px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600">
                <div className="w-14 h-14 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-sm font-semibold text-zinc-700">
                  {story === "Your story" ? "+" : story[0]}
                </div>
              </div>
              <span className="text-[11px] text-zinc-600">{story}</span>
            </div>
          ))}
        </div>

        {/* Feed */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-14 h-14 rounded-full border border-zinc-300 flex items-center justify-center mb-3">
              <Heart size={24} className="text-zinc-700" />
            </div>
            <h2 className="text-base font-semibold">No posts yet</h2>
            <p className="text-xs text-zinc-500 mt-1">
              When people share photos, you&apos;ll see them here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200/70">
            {posts.map((post) => (
              <div key={post.id} className="bg-white">
                {/* Author Row */}
                <div className="flex items-center justify-between px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      className="w-8 h-8 cursor-pointer ring-1 ring-zinc-200"
                      onClick={() => router.push("/profile")}
                    >
                      <AvatarImage src={post.profile?.profileimage} />
                      <AvatarFallback className="bg-zinc-900 text-white text-xs font-medium">
                        {post.profile?.username?.slice(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <p
                        onClick={() => router.push("/profile")}
                        className="text-xs font-semibold cursor-pointer hover:text-zinc-600"
                      >
                        {post.profile?.username || "Unknown"}
                      </p>
                      {post.created_at && (
                        <p className="text-[11px] text-zinc-400">
                          {formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  <MoreHorizontal
                    size={18}
                    className="text-zinc-600 cursor-pointer"
                  />
                </div>

                {/* Image */}
                <div className="w-full bg-zinc-100">
                  <img
                    src={post.imageUrl}
                    alt={post.caption || "Post image"}
                    className="w-full max-h-[520px] object-cover"
                  />
                </div>

                {/* Actions & Meta */}
                <div className="px-3.5 py-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      
                      <div className="flex items-center gap-1">
                        <Heart
                          size={22}
                          onClick={() => toggleLike(post.id, post.like)}
                          className="cursor-pointer hover:text-zinc-500 transition-colors"
                        />
                        <span className="text-xs font-medium text-zinc-700">
                          {post.like.length} {post.like.length === 1 ? "like" : "likes"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle
                          size={22}
                          onClick={() => redirectCommentPage(post.id)}
                          className="cursor-pointer hover:text-zinc-500 transition-colors"
                        />
                        <span className="text-xs font-medium text-zinc-700">
                          {post.comments[0].count} {post.comments[0].count === 1 ? "comment" : "comments"}
                        </span>
                      </div>
                      <Send
                        size={21}
                        className="cursor-pointer hover:text-zinc-500 transition-colors"
                      />
                    </div>
                    <Bookmark
                      size={22}
                      className="cursor-pointer hover:text-zinc-500 transition-colors"
                    />
                  </div>

                  <p className="text-xs text-zinc-800 leading-normal break-words">
                    <span className="font-semibold mr-1.5">
                      {post.profile?.username || "Unknown"}
                    </span>
                    {post.caption}
                  </p>

                  <button
                    type="button"
                    onClick={() => redirectCommentPage(post.id)}
                    className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    View comments
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
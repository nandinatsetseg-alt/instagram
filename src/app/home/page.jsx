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

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data, error } = await supabase.from("posts").select(`
          *,
          profile (
            username,
            profileimage
          )
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

  const redirectCommentPage = (postId) => {
    router.push(`/comment/${postId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0095f6] rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 px-4">
      <div className="max-w-[630px] mx-auto">
        {/* Instagram Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 italic">
            Instagram
          </h1>

          <div className="flex items-center gap-5">
            <Heart
              size={25}
              className="text-gray-800 cursor-pointer hover:text-gray-500 transition"
            />
            <Send
              size={24}
              className="text-gray-800 cursor-pointer hover:text-gray-500 transition"
            />
          </div>
        </div>

        {/* Stories Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex gap-5 overflow-x-auto">
            {["Your story", "Explore", "Friends", "Moments"].map(
              (story, index) => (
                <div
                  key={story}
                  className="flex flex-col items-center gap-2 shrink-0"
                >
                  <div className="w-[62px] h-[62px] rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                      <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold">
                        {story === "Your story" ? "+" : story[0]}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-gray-600">{story}</span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center mx-auto mb-4">
                <Heart size={30} />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                No posts yet
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                When people share photos, you'll see them here.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="w-10 h-10 cursor-pointer"
                      onClick={() => router.push("/profile")}
                    >
                      <AvatarImage src={post.profile?.profileimage} />

                      <AvatarFallback className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white font-semibold">
                        {post.profile?.username?.slice(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p
                        onClick={() => router.push("/profile")}
                        className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-gray-500"
                      >
                        {post.profile?.username || "Unknown"}
                      </p>

                      <p className="text-xs text-gray-400">
                        {post.created_at &&
                          formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                          })}
                      </p>
                    </div>
                  </div>

                  <MoreHorizontal
                    size={23}
                    className="text-gray-700 cursor-pointer"
                  />
                </div>

                {/* Post Image */}
                <div className="w-full bg-gray-50">
                  <img
                    src={post.imageUrl}
                    alt={post.caption || "Post image"}
                    className="w-full max-h-[650px] object-contain"
                  />
                </div>

                {/* Post Actions */}
                <div className="px-4 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <Heart
                        size={25}
                        className="text-gray-800 cursor-pointer hover:text-gray-400 transition"
                      />

                      <MessageCircle
                        size={25}
                        onClick={() => redirectCommentPage(post.id)}
                        className="text-gray-800 cursor-pointer hover:text-gray-400 transition"
                      />

                      <Send
                        size={24}
                        className="text-gray-800 cursor-pointer hover:text-gray-400 transition"
                      />
                    </div>

                    <Bookmark
                      size={24}
                      className="text-gray-800 cursor-pointer hover:text-gray-400 transition"
                    />
                  </div>

                  {/* Caption */}
                  <div className="py-3">
                    <p className="text-sm text-gray-800 leading-relaxed break-words">
                      <span className="font-semibold mr-2">
                        {post.profile?.username || "Unknown"}
                      </span>

                      {post.caption}
                    </p>

                    <button
                      onClick={() => redirectCommentPage(post.id)}
                      className="text-sm text-gray-400 mt-2 hover:text-gray-600"
                    >
                      View comments
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

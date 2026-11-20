
"use client";

import { supabaseClient } from "@/supabase";
import { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const supabase = supabaseClient();

  const getPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, profile(username, profileimage)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <main className="min-h-screen bg-[#fafafa] py-8 px-4">

      <div className="max-w-[630px] mx-auto">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Instagram
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Discover what's happening
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-gray-500">
            Loading posts...
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="bg-white border rounded-2xl p-10 text-center">
            <h2 className="font-semibold text-lg">No posts yet</h2>
            <p className="text-gray-500 text-sm mt-2">
              Be the first to share something!
            </p>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-7">

          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >

              {/* User information */}
              <div className="flex items-center justify-between p-4">

                <div className="flex items-center gap-3">

                  <Avatar className="h-11 w-11 ring-2 ring-pink-400 ring-offset-2">
                    <AvatarImage src={post.profile?.profileimage || ""} />
                    <AvatarFallback className="bg-gray-100 font-semibold">
                      {post.profile?.username?.slice(0, 2)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {post.profile?.username || "Unknown user"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {post.created_at
                        ? formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                          })
                        : ""}
                    </p>
                  </div>

                </div>

                <button className="text-gray-500 hover:text-black">
                  <MoreHorizontal size={23} />
                </button>

              </div>

              {/* Post image */}
              <div className="bg-gray-100">
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full max-h-[650px] object-cover"
                />
              </div>

              {/* Actions */}
              <div className="p-4">

                <div className="flex items-center justify-between mb-3">

                  <div className="flex items-center gap-5">

                    <button className="hover:text-red-500 transition">
                      <Heart size={25} />
                    </button>

                    <button className="hover:text-gray-500 transition">
                      <MessageCircle size={25} />
                    </button>

                    <button className="hover:text-gray-500 transition">
                      <Send size={24} />
                    </button>

                  </div>

                  <button className="hover:text-gray-500 transition">
                    <Bookmark size={24} />
                  </button>

                </div>

                {/* Caption */}
                <p className="text-sm text-gray-800 leading-relaxed">
                  <span className="font-semibold mr-2">
                    {post.profile?.username || "Unknown user"}
                  </span>
                  {post.caption}
                </p>

              </div>

            </article>
          ))}

        </div>

      </div>

    </main>
  );
}

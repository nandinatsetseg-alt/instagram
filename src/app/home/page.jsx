"use client";
import { supabaseClient } from "@/supabase";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
export default function Home() {
  const [posts, setPosts] = useState([]);
  const supabase = supabaseClient();
  const router = useRouter();
  const getPosts = async () => {
    const response = await supabase
      .from("posts")
      .select("*, profile(username, profileimage)");
    setPosts(response.data);
  };
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <div>
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <div>
              <Avatar onClick={() => router.push("/profile")}>
                <AvatarImage src={post.profile.profileimage} />
                <AvatarFallback>
                  {post.profile.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>{post.profile.username}</div>
              <div>
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </div>
            </div>
            <img src={post.imageUrl} width="300" height="400" />
            <div>{post.caption}</div>
          </div>
        );
      })}
    </div>
  );
}

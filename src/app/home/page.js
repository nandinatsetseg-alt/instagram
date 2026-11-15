"use client";
import { supabaseClient } from "@/supabase";
import { useEffect, useState } from "react";
export default function Home() {
  const [posts, setPosts] = useState([]);
  const supabase = supabaseClient();
  const getPosts = async () => {
    const response = await supabase.from("posts").select("*");
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
            <img src={post.imageUrl} />
          </div>
        );
      })}
    </div>
  );
}

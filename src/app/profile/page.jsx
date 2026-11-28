"use client";

import { supabaseClient } from "@/supabase";
import { useEffect, useState } from "react";

const supabase = supabaseClient;
export default function Home() {
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        const response = await supabase
            .from("posts")
            .select("*, profile(username, profileimage)");

        if (response.error) {
            console.log(response.error);
            return;
        }

        setPosts(response.data || []);
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div>
            {posts.map((item, index) => (
                <div key={index}>
                    <div>{item.profile?.username}</div>

                    <img
                        src={item.profile?.profileimage}
                        alt="Profile"
                        width="50"
                    />
                </div>
            ))}
        </div>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/supabase";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/toast";

const Page = () => {
  const params = useParams();
  const postId = params.postId;
  const supabase = supabaseClient;
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);

  
  const getPostComments = async () => {
    const response = await supabase
    .from("comments")
    .select("*, profile(username, profileimage)")
    .eq("postId", postId);
    
    setPostComments(response.data);
  };
  
  useEffect(() => {
    getPostComments();
  }, []);
  
  const addComment = async () => {
    const response = await supabase.from("comments").insert({
      postId: postId,
      content: comment,
    });
    if (response.success) {
      await getPostComments();
      toast.add({
        type: "success",
        description: "Comment added successfully.",
      });
      setComment("");
    }
      else {
        toast.add({
          type: "error",
          description: "Failed to add comment.",
        });
    }
    console.log(response);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex justify-center items-start py-10 px-4">

      {/* Main Comment Card */}
      <div className="w-full max-w-[600px] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Comments
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Join the conversation
            </p>
          </div>

          <div className="text-sm text-gray-400">
            {postComments.length} comments
          </div>
        </div>

        {/* Comments List */}
        <div className="p-5 space-y-6 min-h-[350px] max-h-[550px] overflow-y-auto">

          {postComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center mb-4">
                <span className="text-3xl">♡</span>
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                No comments yet
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            postComments.map((comment) => {
              return (
                <div
                  key={comment.id}
                  className="flex items-start gap-3 group"
                >

                  {/* Avatar */}
                  <Avatar className="w-10 h-10 shrink-0 cursor-pointer">
                    <AvatarImage src={comment.profile?.profileimage} />
                    <AvatarFallback className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white font-semibold">
                      {comment.profile?.username?.slice(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {comment.profile?.username}
                      </span>

                      <span className="text-xs text-gray-400">
                        {comment.created_at &&
                          formatDistanceToNow(
                            new Date(comment.created_at),
                            { addSuffix: true }
                          )}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mt-1 leading-relaxed break-words">
                      {comment.content}
                    </p>

                  </div>

                </div>
              );
            })
          )}

        </div>

        {/* Add Comment Section */}
        <div className="border-t border-gray-200 p-4 bg-white">

          <div className="flex items-center gap-3">

            {/* Input */}
            <div className="flex-1">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="h-11 bg-[#fafafa] border-gray-200 rounded-full px-5 text-sm focus-visible:ring-1 focus-visible:ring-[#0095f6]"
              />
            </div>

            {/* Button */}
            <Button
              onClick={addComment}
              className="bg-[#0095f6] hover:bg-[#1877f2] text-white rounded-full px-6 font-semibold"
            >
              Post
            </Button>

          </div>

          <p className="text-[11px] text-gray-400 mt-3 ml-2">
            Share your thoughts with the community.
          </p>

        </div>

      </div>
    </div>
  );
};

export default Page;

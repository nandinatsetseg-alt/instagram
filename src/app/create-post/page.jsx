
"use client";

import { useState } from "react";
import { supabaseClient } from "@/supabase";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
export default function Home() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = supabaseClient();

  // Select image
  const handleFile = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.add({
        type: "error",
        description: "Please select an image.",
      });
      return;
    }

    setFile(selectedFile);
  };

  // Drag over upload area
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Drag leaves upload area
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Avoid triggering when moving between child elements
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  // Drop image
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];

    if (!droppedFile) return;

    if (!droppedFile.type.startsWith("image/")) {
      toast.add({
        type: "error",
        description: "Please drop an image file.",
      });
      return;
    }

    setFile(droppedFile);
  };

  // Remove image
  const removeImage = () => {
    setFile(null);
  };

  // Create post
  const handlePost = async () => {
    if (!file) {
      toast.add({
        type: "error",
        description: "Please select an image first.",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload image to Supabase
      const filePath = `images/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("POST_IMAGES")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from("POST_IMAGES")
        .getPublicUrl(filePath);

      // Insert post into database
      const { error: insertError } = await supabase
        .from("posts")
        .insert({
          imageUrl: data.publicUrl,
          caption: caption,
        });

      if (insertError) throw insertError;

      toast.add({
        type: "success",
        description: "Post created successfully!",
      });

      router.push("/home");

    } catch (error) {
      console.error("Post error:", error);

      toast.add({
        type: "error",
        description: error.message || "Something went wrong.",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">

      <div className="w-full max-w-[850px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">

          <button
            onClick={() => router.back()}
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            Cancel
          </button>

          <h1 className="font-semibold text-base text-gray-900">
            Create new post
          </h1>

          <button
            onClick={handlePost}
            disabled={!file || loading}
            className="text-sm font-semibold text-[#0095f6] hover:text-blue-700 disabled:opacity-40"
          >
            {loading ? "Sharing..." : "Share"}
          </button>

        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] min-h-[450px]">

          {/* Image Upload Section */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-[#fafafa] flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 relative min-h-[350px] transition-all duration-200 ${
              isDragging
                ? "bg-blue-50 border-2 border-dashed border-[#0095f6]"
                : ""
            }`}
          >

            {file ? (

              /* Image Preview */
              <div className="relative w-full h-full min-h-[350px]">

                <img
                  src={URL.createObjectURL(file)}
                  alt="Post preview"
                  className="absolute inset-0 w-full h-full object-contain"
                />

                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
                >
                  <X size={18} />
                </button>

              </div>

            ) : (

              /* Empty Upload Area */
              <div className="flex flex-col items-center text-center p-8">

                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center mb-5">
                  <ImagePlus size={38} className="text-white" />
                </div>

                <h2 className="text-xl font-light text-gray-800 mb-2">
                  {isDragging
                    ? "Drop your photo here!"
                    : "Drag photos here"}
                </h2>

                <p className="text-sm text-gray-400 mb-6">
                  Share your moments with everyone
                </p>

                <label className="bg-[#0095f6] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg cursor-pointer transition">
                  Select from computer

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>

              </div>

            )}

          </div>

          {/* Caption Section */}
          <div className="flex flex-col p-5">

            {/* Profile */}
            <div className="flex items-center gap-3 mb-5">

              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">

                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-700">
                  U
                </div>

              </div>

              <span className="text-sm font-semibold text-gray-900">
                username
              </span>

            </div>

            {/* Caption */}
            <Textarea
              placeholder="Write a caption..."
              maxLength={100}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="resize-none border-0 shadow-none focus-visible:ring-0 p-0 text-sm min-h-[180px] placeholder:text-gray-400"
            />

            {/* Character Counter */}
            <div className="text-right text-xs text-gray-400 mt-2">
              {caption.length}/100
            </div>

            {/* Additional Options */}
            <div className="border-t border-gray-100 mt-5 pt-4">

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Add to your post</span>
                <ImagePlus size={18} />
              </div>

            </div>

            {/* Share Button */}
            <button
              onClick={handlePost}
              disabled={!file || loading}
              className="mt-auto w-full bg-[#0095f6] hover:bg-[#1877f2] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-lg transition-all"
            >
              {loading ? "Sharing..." : "Share post"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

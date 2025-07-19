"use client";

import { useState } from "react";
import { postItem } from "@/app/utils/postItem";
import Link from "next/link";

export default function PostForm({ userEmail }: { userEmail: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"lost" | "found">("lost");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("🚀 Posting item:", { title, description, status, userEmail });

    const { data, error } = await postItem({
      title,
      description,
      status,
      posted_by: userEmail,
      photo_url: photoUrl,
    });

    setLoading(false);
    
    if (error) {
      console.error("❌ Error posting item:", error);
      setMessage("❌ Error posting item. Check console for details.");
    } else {
      console.log("✅ Item posted successfully:", data);
      setMessage("✅ Item posted successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setPhotoUrl("");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
          ← Back to Home
        </Link>
      </div>

      {/* User info */}
      <div className="mb-6 p-3 bg-gray-800 rounded">
        <p className="text-sm text-gray-300">
          Posting as: <span className="text-yellow-400">{userEmail}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            placeholder="e.g., Blue iPhone 13"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-yellow-400 focus:outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            id="description"
            placeholder="Describe the item and where it was lost/found..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-yellow-400 focus:outline-none resize-none"
            required
          />
        </div>

        {/* Photo URL */}
        <div>
          <label htmlFor="photoUrl" className="block text-sm font-medium mb-2">
            Photo URL (optional)
          </label>
          <input
            type="url"
            id="photoUrl"
            placeholder="https://example.com/photo.jpg"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-yellow-400 focus:outline-none"
          />
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "lost" | "found")}
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none"
          >
            <option value="lost">🔍 Lost</option>
            <option value="found">🎉 Found</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-yellow-400 text-black px-4 py-3 rounded font-medium hover:bg-yellow-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          disabled={loading}
        >
          {loading ? "Posting..." : `Post ${status.charAt(0).toUpperCase() + status.slice(1)} Item`}
        </button>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded text-center ${
            message.includes("✅") 
              ? "bg-green-900 text-green-300" 
              : "bg-red-900 text-red-300"
          }`}>
            {message}
          </div>
        )}
      </form>

      {/* Quick navigation after posting */}
      {message.includes("✅") && (
        <div className="mt-6 p-4 bg-gray-800 rounded text-center">
          <p className="mb-3 text-gray-300">View your item:</p>
          <div className="flex gap-2 justify-center">
            <Link 
              href="/lost" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Lost Items
            </Link>
            <Link 
              href="/found" 
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Found Items
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

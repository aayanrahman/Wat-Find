"use client";

import { useState } from "react";
import { postItem } from "@/app/utils/postItem";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";


export default function PostForm({ userEmail }: { userEmail: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"lost" | "found">("lost");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadPhoto(file: File) {
    const fileName = `${Date.now()}-${file.name}`;
    console.log("📸 Uploading photo:", fileName);
    console.log("📁 File details:", {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    try {
      // Check if storage bucket exists and is accessible
      console.log("🔍 Checking storage bucket access...");
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      console.log("Available buckets:", buckets);
      if (bucketError) {
        console.error("❌ Bucket list error:", bucketError);
        return null;
      }

      // Attempt to upload
      console.log("⬆️ Attempting upload to 'item-photos' bucket...");
      const { data, error } = await supabase.storage
        .from("item-photos")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("❌ Upload error details:", {
          message: error.message,
          error: error
        });
        
        // More specific error messages
        if (error.message?.includes('not found')) {
          console.error("💡 Bucket 'item-photos' doesn't exist. Create it in Supabase Storage.");
        } else if (error.message?.includes('permission')) {
          console.error("💡 Permission denied. Check RLS policies or make bucket public.");
        }
        return null;
      }

      console.log("✅ Upload successful:", data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("item-photos")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log("🌐 Public URL generated:", publicUrl);
      
      return publicUrl;
    } catch (err) {
      console.error("💥 Unexpected upload error:", err);
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("🚀 Posting item:", { title, description, status, userEmail });

    let finalPhotoUrl = photoUrl;
    
    // Upload file if one is selected
    if (photoFile) {
      console.log("📤 Uploading photo file...");
      const uploadedUrl = await uploadPhoto(photoFile);
      if (uploadedUrl) {
        finalPhotoUrl = uploadedUrl;
      } else {
        setMessage("❌ Error uploading photo. Check console for details.");
        setLoading(false);
        return;
      }
    }

    const { data, error } = await postItem({
      title,
      description,
      status,
      posted_by: userEmail,
      photo_url: finalPhotoUrl,
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
      setPhotoFile(null);
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

        {/* Photo Upload Section */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Photo
          </label>
          
          {/* File Upload */}
          <div className="mb-3">
            <label htmlFor="photoFile" className="block text-xs text-gray-400 mb-1">
              Upload from device (recommended)
            </label>
            <input
              type="file"
              id="photoFile"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setPhotoFile(e.target.files[0]);
                  setPhotoUrl(""); // Clear URL if file is selected
                }
              }}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-yellow-400 file:text-black hover:file:bg-yellow-300"
            />
          </div>

          {/* OR divider */}
          <div className="flex items-center my-3">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          {/* URL Input */}
          <div>
            <label htmlFor="photoUrl" className="block text-xs text-gray-400 mb-1">
              Photo URL
            </label>
            <input
              type="url"
              id="photoUrl"
              placeholder="https://example.com/photo.jpg"
              value={photoUrl}
              onChange={(e) => {
                setPhotoUrl(e.target.value);
                if (e.target.value) setPhotoFile(null); // Clear file if URL is entered
              }}
              disabled={!!photoFile}
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-yellow-400 focus:outline-none disabled:bg-gray-700 disabled:text-gray-500"
            />
          </div>
          
          {/* Photo preview */}
          {(photoFile || photoUrl) && (
            <div className="mt-3 p-3 bg-gray-700 rounded">
              <p className="text-sm text-gray-300 mb-2">Preview:</p>
              {photoFile ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-400">📁</span>
                  <span className="text-sm">{photoFile.name}</span>
                  <span className="text-xs text-gray-400">({(photoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ) : (
                <div className="relative w-full h-32">
                  <Image 
                    src={photoUrl} 
                    alt="Preview" 
                    fill
                    className="object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}
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
            {message.includes("Error uploading photo") && (
              <div className="mt-3 text-left text-sm">
                <p className="font-semibold mb-2">🔧 Setup Required:</p>
                <ol className="space-y-1 text-xs">
                  <li>1. Go to Supabase Dashboard → Storage</li>
                  <li>2. Create new bucket named: <code className="bg-gray-800 px-1 rounded">item-photos</code></li>
                  <li>3. Make bucket public or set RLS policies</li>
                  <li>4. Check console for detailed error info</li>
                </ol>
              </div>
            )}
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

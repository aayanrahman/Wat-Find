"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ItemCard from "./ItemCard";

interface Item {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  posted_by: string;
  photo_url?: string;
}

interface FeedProps {
  status: string;
}

export default function Feed({ status }: FeedProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      console.log(`🔍 Fetching ${status} items...`);
      console.log("Status filter being used:", JSON.stringify(status));
      
      try {
        // First, let's see ALL items in the table (no filters)
        console.log("📋 Fetching ALL items first...");
        const { data: allItems, error: allError } = await supabase
          .from("items")
          .select("*");
        
        console.log("ALL items in database:", allItems);
        console.log("All items error:", allError);
        
        if (allItems && allItems.length > 0) {
          console.log("📊 Status values found in DB:", allItems.map(item => `"${item.status}"`));
          console.log("📝 Sample item:", allItems[0]);
        } else {
          console.log("❌ No items found in database at all!");
        }
        
        // Now try the filtered query
        console.log(`🎯 Now filtering for status: "${status}"`);
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("status", status)
          .order("created_at", { ascending: false });

        console.log(`✅ Query result for "${status}":`, { 
          data, 
          error,
          count: data?.length || 0 
        });

        if (error) {
          console.error("❌ Supabase error:", error);
          setError(error.message);
        } else {
          console.log(`🎉 Successfully loaded ${data?.length || 0} ${status} items`);
          setItems(data || []);
        }
      } catch (err) {
        console.error("💥 Unexpected error:", err);
        setError("Unexpected error occurred");
      }
      
      setLoading(false);
    };

    fetchItems();
  }, [status]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="text-lg">Loading {status} items...</div>
        <div className="text-sm text-gray-400 mt-2">Check console for debug info</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <div className="text-lg">Error: {error}</div>
        <div className="text-sm mt-2">Check console for more details</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Debug info */}
      <div className="bg-gray-800 p-3 rounded text-sm">
        <div className="text-gray-300">
          🐛 <strong>Debug Info:</strong>
        </div>
        <div className="text-gray-400">
          • Looking for status: <span className="text-yellow-400">"{status}"</span>
        </div>
        <div className="text-gray-400">
          • Found: <span className="text-green-400">{items.length}</span> items
        </div>
        <div className="text-gray-400 text-xs mt-1">
          Check browser console for detailed logs
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-gray-400 bg-gray-800 p-6 rounded">
          <div className="text-lg mb-2">No {status} items found</div>
          <div className="text-sm">
            This could mean:
            <ul className="mt-2 text-left max-w-md mx-auto">
              <li>• No items with status "{status}" in database</li>
              <li>• Status values don't match exactly (check console)</li>
              <li>• Database connection issues</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-gray-400 text-sm mb-4">
            Showing {items.length} {status} item{items.length !== 1 ? 's' : ''}
          </div>
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
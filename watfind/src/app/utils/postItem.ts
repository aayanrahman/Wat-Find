import {supabase} from "@/lib/supabaseClient";

export async function postItem({
    title,
    description,
    status, 
    posted_by,
    photo_url,
}: {
    title: string; 
    description: string;
    status: "lost" | "found";
    posted_by: string;
    photo_url?: string;
}) {
    const { data, error } = await supabase
    .from("items")
    .insert([
      {
        title,
        description,
        status,
        posted_by,
        photo_url: photo_url ?? "",
      },
    ]);

  if (error) {
    console.error("❌ Error posting item:", error);
    return { error };
  }
  console.log("✅ Posted successfully:", data);
  return { data };
}
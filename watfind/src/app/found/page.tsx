import Feed from "@/components/Feed";
import Link from "next/link";

export default function FoundPage() {
  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="mb-4">
        <Link href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
          ← Back to Home
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-4">🎉 Found Items</h1>
      <Feed status="found" />
    </main>
  );
}

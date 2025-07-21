import PostForm from "@/components/PostForm";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function PostPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white p-4">
        <div className="max-w-md mx-auto text-center">
          {/* Back button */}
          <div className="mb-6 text-left">
            <Link href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              ← Back to Home
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-4">� Post an Item</h1>
          
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl mb-4">🔒 Authentication Required</h2>
            <p className="text-gray-300 mb-4">
              Normally you&apos;d need to log in, but for testing purposes:
            </p>
            
            {/* Test Mode */}
            <div className="bg-yellow-900 border border-yellow-600 p-4 rounded mb-4">
              <h3 className="text-yellow-200 font-semibold mb-2">🧪 Test Mode</h3>
              <p className="text-yellow-100 text-sm mb-3">
                Skip authentication and test posting with a dummy email
              </p>
              <PostForm userEmail="test@uwaterloo.ca" />
            </div>
            
            <div className="text-sm text-gray-400">
              <p>To use real authentication:</p>
              <ol className="text-left mt-2 space-y-1">
                <li>1. Go back to home</li>
                <li>2. Enter your @uwaterloo.ca email</li>
                <li>3. Click &quot;Send Magic Link&quot;</li>
                <li>4. Check your email and click the link</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-4">📢 Post a Lost or Found Item</h1>
      <PostForm userEmail={user.email ?? ''} />
    </main>
  );
}

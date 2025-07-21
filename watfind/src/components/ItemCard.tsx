import Image from "next/image";

type Item = {
  id: string;
  title: string;
  description: string;
  photo_url?: string;
  created_at: string;
  posted_by: string;
  status?: string;
};

export default function ItemCard({ item }: { item: Item }) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 mb-3 shadow text-white max-w-sm mx-auto">
      <h2 className="text-lg font-bold">{item.title}</h2>
      {item.photo_url && (
        <div className="relative w-full max-h-64 mt-2">
          <Image
            src={item.photo_url}
            alt={item.title}
            width={400}
            height={256}
            className="w-full max-h-64 h-auto object-contain rounded"
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
      <p className="text-sm text-gray-300 mt-1">{item.description}</p>
      
      <div className="text-sm text-gray-500 mt-2 mb-2">
        Posted by: <span className="text-yellow-400">{item.posted_by}</span>
      </div>
      <div className="text-xs text-gray-500 mb-3">
        {new Date(item.created_at).toLocaleString()}
      </div>

      {/* Contact Poster button */}
      <a
        href={`mailto:${item.posted_by}?subject=I saw your ${item.status || 'item'} on WatFind&body=Hi, I saw your post about "${item.title}" on WatFind. I wanted to reach out about it.`}
        className="inline-block bg-yellow-400 text-black px-3 py-2 rounded font-medium hover:bg-yellow-300 transition-colors text-sm w-full text-center"
      >
        📧 Contact Poster
      </a>
    </div>
  );
}

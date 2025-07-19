type Item = {
  id: string;
  title: string;
  description: string;
  photo_url?: string;
  created_at: string;
  posted_by: string;
};

export default function ItemCard({ item }: { item: Item }) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 mb-3 shadow text-white">
      <h2 className="text-lg font-bold">{item.title}</h2>
      {item.photo_url && (
        <img
          src={item.photo_url}
          alt={item.title}
          className="w-full h-40 object-cover rounded mt-2"
        />
      )}
      <p className="text-sm text-gray-300 mt-1">{item.description}</p>
      <div className="text-xs text-gray-400 mt-2">
        Posted by: {item.posted_by}
      </div>
      <div className="text-xs text-gray-500">
        {new Date(item.created_at).toLocaleString()}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function AIToolsPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    const { data, error } = await supabase
      .from("ai_tools")
      .select("*");

    if (!error) {
      setTools(data || []);
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        AI Tools
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {tools.map((tool) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            className="bg-white dark:bg-gray-900 p-4 rounded-2xl border hover:shadow-lg transition"
          >

            <img
              src={tool.image}
              className="w-full h-40 object-cover rounded-xl mb-3"
            />

            <h3 className="font-bold dark:text-white">
              {tool.name}
            </h3>

            <p className="text-sm text-gray-500">
              {tool.description}
            </p>

            <div className="flex justify-between mt-3 text-xs">
              <span className="bg-blue-500 text-white px-2 py-1 rounded">
                {tool.type}
              </span>
              <span className="bg-green-500 text-white px-2 py-1 rounded">
                {tool.pricing}
              </span>
            </div>

          </a>
        ))}

      </div>
    </div>
  );
}
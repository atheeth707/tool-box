import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_KEY!
);

export default function AIToolsPage() {
  const { categoryId } = useParams();
  const [tools, setTools] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    if (!categoryId) return;

    loadData();
  }, [categoryId]);

  const loadData = async () => {
    // Load category
    const { data: cat } = await supabase
      .from("categories")
      .select("*")
      .eq("id", categoryId)
      .single();

    setCategory(cat);

    // Load tools
    const { data } = await supabase
      .from("ai_tools")
      .select("*")
      .eq("category_id", categoryId);

    setTools(data || []);
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      {category && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {category.icon} {category.name}
          </h1>
          <p className="text-gray-500">{category.description}</p>
        </div>
      )}

      {/* TOOLS */}
      <div className="grid md:grid-cols-3 gap-6">
        {tools.map(tool => (
          <div key={tool.id} className="p-4 border rounded-xl">

            <h2 className="font-bold">{tool.name}</h2>
            <p className="text-sm text-gray-500">{tool.description}</p>

            <a
              href={tool.url}
              target="_blank"
              className="text-blue-600 mt-2 inline-block"
            >
              Open Tool →
            </a>

          </div>
        ))}
      </div>

    </div>
  );
}
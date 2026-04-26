import React, { useState } from "react";

// Using a standard constant for data to avoid "type" keyword issues in older compilers
const toolsData = [
  // 🎥 YOUTUBE & VIDEO
  { name: "YTZolo", url: "https://ytzolo.com", type: "Freemium", category: "YouTube & Video", tags: ["growth", "scripts", "thumbnails"] },
  { name: "vidIQ AI", url: "https://vidiq.com", type: "Freemium", category: "YouTube & Video", tags: ["keywords", "competitors", "seo"] },
  { name: "TubeBuddy", url: "https://tubebuddy.com", type: "Freemium", category: "YouTube & Video", tags: ["a/b testing", "bulk edits"] },
  
  // 🌐 SEO & GEO
  { name: "Atomic AGI", url: "https://atomic.ag", type: "Paid", category: "SEO & GEO", tags: ["geo", "ai search ranking"] },
  { name: "Sight AI", url: "https://trysight.ai", type: "Paid", category: "SEO & GEO", tags: ["visibility", "brand tracking"] },
  { name: "Perplexity", url: "https://perplexity.ai", type: "Free", category: "SEO & GEO", tags: ["research", "citation check"] },

  // ✂️ REPURPOSING
  { name: "OpusClip Pro", url: "https://opus.pro", type: "Freemium", category: "Repurposing", tags: ["shorts", "virality score"] },
  { name: "Descript", url: "https://descript.com", type: "Freemium", category: "Repurposing", tags: ["editing", "transcription"] }
];

export default function AIContentHub() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = toolsData.filter(function(tool) {
    const matchFilter = filter === "All" || tool.type === filter;
    const matchSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.category.toLowerCase().includes(search.toLowerCase()) ||
      tool.tags.join(" ").toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          🚀 <span style={{ color: '#2563eb' }}>AI</span> Content Creator Hub
        </h1>
        <p style={{ color: '#6b7280' }}>Top 2026 tools for YouTube, SEO, and Brand Visibility.</p>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search tools (YouTube, SEO, Shorts)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '16px',
          marginBottom: '24px',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          outline: 'none'
        }}
      />

      {/* FILTER */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {["All", "Free", "Freemium", "Paid"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 24px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: filter === f ? '#2563eb' : '#f3f4f6',
              color: filter === f ? '#ffffff' : '#4b5563'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        {filtered.map((tool, i) => (
          <a
            key={i}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #f3f4f6',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>{tool.name}</h2>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: 'bold', 
                padding: '4px 8px', 
                borderRadius: '6px',
                backgroundColor: tool.type === 'Free' ? '#dcfce7' : '#dbeafe',
                color: tool.type === 'Free' ? '#166534' : '#1e40af'
              }}>
                {tool.type}
              </span>
            </div>

            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '12px' }}>
              {tool.category}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {tool.tags.map(tag => (
                <span key={tag} style={{ fontSize: '11px', backgroundColor: '#f9fafb', padding: '4px 8px', borderRadius: '8px', color: '#6b7280' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
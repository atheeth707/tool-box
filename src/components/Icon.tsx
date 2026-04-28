import React from 'react';
import * as LucideIcons from 'lucide-react';

const ICON_MAP: Record<string, keyof typeof LucideIcons> = {
  'ai': 'Sparkles',
  'content': 'PenTool',
  'image': 'Image',
  'video': 'Video',
  'website': 'Globe',
  'seo & keywords': 'Search',
  'script & ideas': 'Lightbulb',
  'video & voice': 'Mic',
  'analytics': 'BarChart3'
};

export const Icon = ({ name, className }: { name: string, className?: string }) => {
  // 1. First, check if the name (lowercase) exists in our custom AI mapping
  const cleanName = name.toLowerCase().trim();
  const mappedIconName = ICON_MAP[cleanName];

  // 2. If it's in the map, use the mapped Lucide name.
  // 3. If NOT in the map, use the original 'name' exactly as passed (to support FileCode, Calendar, etc.)
  const finalIconName = mappedIconName || name;
  
  const LucideIcon = (LucideIcons as any)[finalIconName];

  // Fallback to Wrench only if the icon literally doesn't exist in the library
  if (!LucideIcon) return <LucideIcons.Wrench className={className} />;
  
  return <LucideIcon className={className} />;
};
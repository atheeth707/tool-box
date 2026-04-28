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
  // 1. Try to find an exact match in Lucide first (preserves your old icons like 'FileCode')
  let LucideIcon = (LucideIcons as any)[name];

  // 2. If not found, check the custom AI mapping (lowercase for flexibility)
  if (!LucideIcon) {
    const cleanName = name.toLowerCase().trim();
    const mappedName = ICON_MAP[cleanName];
    if (mappedName) {
      LucideIcon = (LucideIcons as any)[mappedName];
    }
  }

  // 3. Fallback to Wrench if it's still not found
  if (!LucideIcon) return <LucideIcons.Wrench className={className} />;
  
  return <LucideIcon className={className} />;
};
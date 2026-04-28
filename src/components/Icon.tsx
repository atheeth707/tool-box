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
  const cleanName = name.toLowerCase().trim();
  const iconName = ICON_MAP[cleanName] || (cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
  
  const LucideIcon = (LucideIcons as any)[iconName];
  if (!LucideIcon) return <LucideIcons.Wrench className={className} />;
  
  return <LucideIcon className={className} />;
};
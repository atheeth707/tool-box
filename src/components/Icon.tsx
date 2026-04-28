import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * Mapping simple category names to specific Lucide components.
 * This makes it easier to manage in your Supabase database.
 */
const ICON_MAP: Record<string, keyof typeof LucideIcons> = {
  // AI & Content
  'ai': 'Sparkles',
  'content': 'PenTool',
  'creation': 'Wand2',
  
  // Media
  'image': 'Image',
  'video': 'Video',
  'music': 'Music',
  
  // Technical & Web
  'website': 'Globe',
  'filecode': 'FileCode',
  'binary': 'Binary',
  
  // Utilities
  'calendar': 'Calendar',
  'eraser': 'Eraser',
  'type': 'Type',
  'wrench': 'Wrench'
};

interface IconProps {
  name: string;
  className?: string;
}

export const Icon = ({ name, className }: IconProps) => {
  // 1. Normalize the input (lowercase and remove spaces)
  const cleanName = name.toLowerCase().trim();

  // 2. Check if the name exists in our mapping first
  let iconComponentName = ICON_MAP[cleanName];

  // 3. If not in mapping, try to match the Lucide name exactly (e.g., "FileCode")
  if (!iconComponentName) {
    // Convert "file-code" or "filecode" to "FileCode"
    iconComponentName = (cleanName.charAt(0).toUpperCase() + cleanName.slice(1)) as keyof typeof LucideIcons;
  }

  // 4. Get the Component from the Lucide library
  const LucideIcon = (LucideIcons as any)[iconComponentName];

  // 5. Fallback: If icon doesn't exist, use the Wrench icon as default
  if (!LucideIcon) {
    return <LucideIcons.Wrench className={className} />;
  }

  return <LucideIcon className={className} />;
};
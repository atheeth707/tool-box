import React from 'react';
import * as LucideIcons from 'lucide-react';

export const Icon = ({ name, className }: { name: string, className?: string }) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) return <LucideIcons.Wrench className={className} />;
  return <LucideIcon className={className} />;
};

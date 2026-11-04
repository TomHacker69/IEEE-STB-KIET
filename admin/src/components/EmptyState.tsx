import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center neu-card rounded-3xl border border-white/60 my-6">
      <div className="w-16 h-16 rounded-2xl neu-inset flex items-center justify-center text-ieee-blue mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm font-medium text-slate-500 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="neu-btn-primary inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

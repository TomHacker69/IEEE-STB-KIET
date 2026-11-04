import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionHref,
  actionLabel,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#e8edf5] rounded-3xl shadow-[inset_4px_4px_10px_#c5d0e0,inset_-4px_-4px_10px_#ffffff] border border-white/60 my-8 max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-[#e8edf5] shadow-[5px_5px_12px_#c5d0e0,-5px_-5px_12px_#ffffff] border border-white/80 text-ieee-blue flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-md">{description}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex items-center px-5 py-2.5 text-xs font-bold rounded-xl text-white neu-btn-primary transition shadow-md"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

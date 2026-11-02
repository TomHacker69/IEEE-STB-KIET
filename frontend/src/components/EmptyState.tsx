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
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 my-8 max-w-xl mx-auto">
      <div className="w-14 h-14 rounded-full bg-blue-50 text-ieee-blue flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-5 max-w-md">{description}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg text-white bg-ieee-blue hover:bg-ieee-dark transition-colors shadow-sm"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};


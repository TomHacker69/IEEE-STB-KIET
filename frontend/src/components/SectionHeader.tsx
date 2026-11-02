import React from 'react';

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  centered = true,
}) => {
  if (!title && !subtitle && !badge) return null;

  return (
    <div className={`mb-12 ${centered ? 'text-center max-w-2xl mx-auto' : ''}`}>
      {badge && (
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-ieee-blue border border-blue-100 mb-3">
          {badge}
        </span>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`w-12 h-1 bg-ieee-cyan rounded-full mt-4 ${centered ? 'mx-auto' : ''}`} />
    </div>
  );
};


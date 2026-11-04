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
        <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#e8edf5] text-ieee-blue shadow-[3px_3px_6px_#c5d0e0,-3px_-3px_6px_#ffffff] border border-white/80 mb-3.5">
          {badge}
        </span>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
      <div className={`w-14 h-1.5 bg-gradient-to-r from-ieee-blue to-ieee-cyan rounded-full mt-4 shadow-[2px_2px_4px_#c5d0e0] ${centered ? 'mx-auto' : ''}`} />
    </div>
  );
};

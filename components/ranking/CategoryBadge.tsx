'use client';

import { Category } from '@/types';
import { CATEGORY_COLORS } from '@/lib/constants';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`
        ${CATEGORY_COLORS[category]}
        ${sizeClasses}
        rounded-full font-medium inline-block
      `}
    >
      {category}
    </span>
  );
}

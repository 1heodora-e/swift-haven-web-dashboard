interface BrandedTitleProps {
  text: string;
  className?: string;
  as?: 'h2' | 'h3';
}

/** Highlights the word "Haven" in pink when present in the title */
export function BrandedTitle({ text, className = 'chart-card-title', as: Tag = 'h2' }: BrandedTitleProps) {
  const parts = text.split(/(Haven)/g);
  return (
    <Tag className={className}>
      {parts.map((part, i) =>
        part === 'Haven' ? (
          <span key={i} className="brand-haven">
            Haven
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </Tag>
  );
}

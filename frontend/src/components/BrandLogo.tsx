type BrandLogoProps = {
  showName?: boolean;
  compact?: boolean;
};

export function BrandLogo({
  showName = true,
  compact = false,
}: BrandLogoProps) {
  return (
    <span className={`brand-logo ${compact ? "is-compact" : ""}`}>
      <svg
        className="brand-symbol"
        viewBox="0 0 48 48"
        role="img"
        aria-label="GearVIa Me 로고"
      >
        <path
          className="brand-gear"
          d="M21 4h6l1.2 5a16 16 0 0 1 3.8 1.6l4.4-2.7 4.2 4.2-2.7 4.4a16 16 0 0 1 1.6 3.8l5 1.2v6l-5 1.2a16 16 0 0 1-1.6 3.8l2.7 4.4-4.2 4.2-4.4-2.7a16 16 0 0 1-3.8 1.6L27 44h-6l-1.2-5a16 16 0 0 1-3.8-1.6l-4.4 2.7-4.2-4.2 2.7-4.4a16 16 0 0 1-1.6-3.8l-5-1.2v-6l5-1.2a16 16 0 0 1 1.6-3.8l-2.7-4.4 4.2-4.2 4.4 2.7A16 16 0 0 1 19.8 9L21 4Z"
        />
        <circle cx="24" cy="24" r="10" />
        <path className="brand-check" d="m18.5 24.5 3.7 3.7 7.7-8.2" />
      </svg>
      {showName && <strong>GearVIa Me</strong>}
    </span>
  );
}

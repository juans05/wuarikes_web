export function BenefitBadge({ hasActiveBenefit }: { hasActiveBenefit?: boolean }) {
  if (!hasActiveBenefit) return null;

  return (
    <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary dark:bg-secondary/25">
      🎁 Beneficios
    </span>
  );
}

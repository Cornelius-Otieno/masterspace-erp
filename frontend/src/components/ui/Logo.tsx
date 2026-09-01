interface LogoProps {
  className?: string;
  variant?: 'full' | 'mark';
  dark?: boolean;
}

export function Logo({ className = '', variant = 'full', dark = false }: LogoProps) {
  const isMark = variant === 'mark';

  return (
    <div
      className={`overflow-hidden ${isMark ? 'h-10 w-10' : 'h-12 w-52'} ${dark ? 'rounded bg-white px-1' : ''} ${className}`}
    >
      <img
        src="/brand/masterspace_logo.png"
        alt="Masterspace Solutions"
        className={isMark ? 'h-10 w-[120px] max-w-none object-left object-cover' : 'h-12 w-52 object-contain'}
      />
    </div>
  );
}

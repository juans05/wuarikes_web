import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <Link href="/" className={clsx("flex items-center gap-2", className)}>
      <Image
        src="/logo-icon.jpg"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 rounded-xl"
      />
      <span
        className={clsx(
          "font-heading text-xl font-bold tracking-tight",
          light ? "text-white" : "text-primary",
        )}
      >
        Wuarikes
      </span>
    </Link>
  );
}

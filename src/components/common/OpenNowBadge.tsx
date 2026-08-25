import clsx from "clsx";
import { isOpenNowFromStructured, parseOpenHours, type StructuredOpeningHour } from "@/utils/parseOpenHours";

export function OpenNowBadge({
  openHoursText,
  openingHours,
}: {
  openHoursText: string | null;
  openingHours?: StructuredOpeningHour[] | null;
}) {
  const structured = isOpenNowFromStructured(openingHours ?? null);
  const isOpenNow = structured ?? parseOpenHours(openHoursText).isOpenNow;
  if (isOpenNow === null) return null;

  return (
    <span
      className={clsx(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        isOpenNow
          ? "bg-accent/15 text-accent dark:bg-accent/25 dark:text-accent"
          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
      )}
    >
      {isOpenNow ? "Abierto ahora" : "Cerrado"}
    </span>
  );
}

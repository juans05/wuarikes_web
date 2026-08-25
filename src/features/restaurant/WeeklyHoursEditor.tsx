"use client";

import { WEEK_DAYS } from "@/utils/weekDays";

export interface DayHours {
  day: string;
  open: string;
  close: string;
}

export function WeeklyHoursEditor({
  value,
  onChange,
}: {
  value: DayHours[];
  onChange: (value: DayHours[]) => void;
}) {
  function getDay(key: string) {
    return value.find((d) => d.day === key);
  }

  function toggleDay(key: string, enabled: boolean) {
    if (enabled) {
      onChange([...value, { day: key, open: "12:00", close: "22:00" }]);
    } else {
      onChange(value.filter((d) => d.day !== key));
    }
  }

  function updateDay(key: string, field: "open" | "close", time: string) {
    onChange(value.map((d) => (d.day === key ? { ...d, [field]: time } : d)));
  }

  return (
    <div className="flex flex-col gap-2">
      {WEEK_DAYS.map(({ key, label }) => {
        const entry = getDay(key);
        return (
          <div key={key} className="flex items-center gap-3">
            <label className="flex w-32 shrink-0 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(entry)}
                onChange={(e) => toggleDay(key, e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              {label}
            </label>
            {entry ? (
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="time"
                  value={entry.open}
                  onChange={(e) => updateDay(key, "open", e.target.value)}
                  className="rounded-lg border border-neutral-200 bg-white px-2 py-1 outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-950"
                />
                <span className="text-neutral-400">a</span>
                <input
                  type="time"
                  value={entry.close}
                  onChange={(e) => updateDay(key, "close", e.target.value)}
                  className="rounded-lg border border-neutral-200 bg-white px-2 py-1 outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-950"
                />
              </div>
            ) : (
              <span className="text-sm text-neutral-400">Cerrado</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

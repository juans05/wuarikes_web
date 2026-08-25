// ponytail: heurística best-effort sobre texto libre (Place.openHoursText no tiene
// estructura por día). No entiende días de la semana ni feriados — solo extrae el
// primer rango horario del texto y asume que aplica todos los días. Upgrade path:
// reemplazar por `openingHours: {day, open, close}[]` estructurado en el backend
// (ver TODO.md) y borrar este parser.

export interface OpenHoursInfo {
  isOpenNow: boolean | null;
  label: string;
}

const ALWAYS_OPEN = /24\s*h|24\s*horas/i;
const TIME_RANGE =
  /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:-|–|a)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i;

function to24h(hour: number, minute: number, meridiem?: string) {
  let h = hour % 12;
  if (meridiem?.toLowerCase() === "pm") h += 12;
  if (!meridiem && hour >= 1 && hour <= 7) h += 12; // "9 - 22:00" sin am/pm en la hora de cierre
  return h * 60 + minute;
}

export interface StructuredOpeningHour {
  day: string;
  open: string;
  close: string;
}

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

// Prefer this over parseOpenHours(text) once a place has structured hours —
// reliable per-day evaluation instead of a free-text heuristic.
export function isOpenNowFromStructured(hours: StructuredOpeningHour[] | null): boolean | null {
  if (!hours || hours.length === 0) return null;
  const now = new Date();
  const today = hours.find((h) => h.day === DAY_KEYS[now.getDay()]);
  if (!today) return false;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = toMinutes(today.open);
  let closeMinutes = toMinutes(today.close);
  if (closeMinutes <= openMinutes) closeMinutes += 24 * 60; // cruza medianoche

  return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
}

export function parseOpenHours(text: string | null): OpenHoursInfo {
  if (!text) return { isOpenNow: null, label: "Horario no disponible" };
  if (ALWAYS_OPEN.test(text)) return { isOpenNow: true, label: "Abierto 24 horas" };

  const match = text.match(TIME_RANGE);
  if (!match) return { isOpenNow: null, label: text };

  const [, oh, om = "0", omer, ch, cm = "0", cmer] = match;
  const openMinutes = to24h(Number(oh), Number(om), omer);
  let closeMinutes = to24h(Number(ch), Number(cm), cmer ?? omer);
  if (closeMinutes <= openMinutes) closeMinutes += 24 * 60; // cruza medianoche

  const now = new Date();
  let nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (nowMinutes < openMinutes) nowMinutes += 24 * 60;

  const isOpenNow = nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  return { isOpenNow, label: text };
}

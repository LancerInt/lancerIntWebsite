/** Minimal class joiner. No dependency needed for what we use it for. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Builds an SVG polyline from a numeric series, normalised to a box. */
export function seriesToPoints(
  values: number[],
  width: number,
  height: number,
  padding = 0,
) {
  if (values.length === 0) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const step = values.length > 1 ? innerW / (values.length - 1) : 0;

  return values
    .map((v, i) => {
      const x = padding + i * step;
      const y = padding + innerH - ((v - min) / span) * innerH;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

/** Clamps a number into a range. */
export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

// Quarter-teaspoon ticks: 1 US fl oz = 6 tsp = 24 ticks.
// Group whole ounces for the jiggers, then the remaining tablespoons/teaspoons.
export function formatPours(volumeOz: number): string {
  if (!Number.isFinite(volumeOz) || volumeOz <= 0) return '0 oz';
  const exactTicks = volumeOz * 24;
  let remaining = Math.round(exactTicks);
  if (remaining === 0) return '< ¼ tsp';
  const approximate = Math.abs(remaining - exactTicks) > 1e-8;
  const parts: string[] = [];
  const ounces = Math.floor(remaining / 24);
  if (ounces) parts.push(`${ounces} oz`);
  remaining %= 24;
  const tablespoons = Math.floor(remaining / 12);
  if (tablespoons) parts.push(`${tablespoons} tbsp`);
  remaining %= 12;
  if (remaining) {
    const whole = Math.floor(remaining / 4);
    const fraction = ['', '¼', '½', '¾'][remaining % 4];
    parts.push(`${whole || ''}${fraction} tsp`);
  }
  return `${approximate ? '≈ ' : ''}${parts.join(' + ')}`;
}

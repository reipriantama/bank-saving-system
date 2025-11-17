export function calculateEndingBalance(
  starting: number,
  yearlyReturn: number,
  months: number
) {
  const monthly = yearlyReturn / 12;
  return starting * (1 + monthly * months);
}


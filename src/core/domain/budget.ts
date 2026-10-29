export interface BudgetStatus {
  remaining: number;
  pctUsed: number;
  status: 'ok' | 'warning' | 'exceeded';
}

export function computeBudgetStatus(limitAmount: number, actualSpend: number): BudgetStatus {
  // Zero/negative limit means "no budget set": no spend is `ok`, any spend is `exceeded`.
  if (limitAmount <= 0) {
    if (actualSpend <= 0) return { remaining: -actualSpend, pctUsed: 0, status: 'ok' };
    return { remaining: limitAmount - actualSpend, pctUsed: 100, status: 'exceeded' };
  }

  const pctUsed = (actualSpend / limitAmount) * 100;
  const remaining = limitAmount - actualSpend;
  const status = pctUsed >= 100 ? 'exceeded' : pctUsed >= 80 ? 'warning' : 'ok';
  return { remaining, pctUsed, status };
}

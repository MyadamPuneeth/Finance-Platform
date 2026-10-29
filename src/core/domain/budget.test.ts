import { describe, expect, it } from 'vitest';
import { computeBudgetStatus } from './budget';

describe('computeBudgetStatus', () => {
  it('is ok below 80% used', () => {
    expect(computeBudgetStatus(100, 50).status).toBe('ok');
  });

  it('is warning at the 80% boundary', () => {
    expect(computeBudgetStatus(100, 80).status).toBe('warning');
  });

  it('is exceeded at the 100% boundary', () => {
    expect(computeBudgetStatus(100, 100).status).toBe('exceeded');
  });

  it('is exceeded above 100%', () => {
    const result = computeBudgetStatus(100, 150);
    expect(result.status).toBe('exceeded');
    expect(result.remaining).toBe(-50);
  });

  it('treats a zero/negative limit with no spend as ok', () => {
    expect(computeBudgetStatus(0, 0).status).toBe('ok');
    expect(computeBudgetStatus(-10, 0).status).toBe('ok');
  });

  it('treats a zero/negative limit with any spend as exceeded', () => {
    expect(computeBudgetStatus(0, 1).status).toBe('exceeded');
  });
});

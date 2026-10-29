import type { Category, TransactionType } from './types';

// Assumption: keyword lists are a reasonable, non-exhaustive guess at common merchant/description
// substrings per category. First category (in this order) whose list matches wins; 'Other' is the fallback.
const KEYWORDS: Record<Exclude<Category, 'Income'>, string[]> = {
  Food: [
    'restaurant', 'cafe', 'coffee', 'starbucks', 'mcdonald', 'grocery', 'supermarket',
    'whole foods', 'doordash', 'uber eats', 'ubereats', 'grubhub', 'pizza', 'diner', 'bakery',
  ],
  Shopping: ['amazon', 'walmart', 'target', 'mall', 'clothing', 'ebay', 'best buy', 'shop', 'store'],
  Transport: [
    'uber', 'lyft', 'gas station', 'fuel', 'shell', 'chevron', 'exxon', 'parking',
    'transit', 'metro', 'taxi', 'airline', 'flight',
  ],
  Bills: [
    'electric', 'utility', 'utilities', 'internet', 'phone bill', 'verizon', 'at&t',
    'comcast', 'water bill', 'insurance', 'subscription', 'netflix', 'spotify',
  ],
  Rent: ['rent', 'landlord', 'lease', 'apartment'],
  Healthcare: ['pharmacy', 'doctor', 'hospital', 'clinic', 'cvs', 'walgreens', 'dental', 'medical', 'health'],
  Other: [],
};

const ORDER: Exclude<Category, 'Income'>[] = ['Food', 'Shopping', 'Transport', 'Bills', 'Rent', 'Healthcare'];

export function categorize(description: string, type: TransactionType): Category {
  if (type === 'income') return 'Income';
  const lower = description.toLowerCase();
  for (const category of ORDER) {
    if (KEYWORDS[category].some((keyword) => lower.includes(keyword))) return category;
  }
  return 'Other';
}

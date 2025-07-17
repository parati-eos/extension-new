export const getStaticPricing = (currency: string) => {
    const pricingMap: Record<'INR' | 'USD', { current: number; original: number }> = {
      INR: { current: 199, original: 99 },
      USD: { current: 9, original: 5 },
    };
  
    return pricingMap[currency as 'INR' | 'USD'] || pricingMap['USD']; // default fallback
  };
  
  // For calculating per-credit cost for credit purchases
export const getCreditPricing = (currency: string) => {
  const perCreditPriceMap: Record<'INR' | 'USD', number> = {
    INR: 19.9,
    USD: 0.25,
  };

  return perCreditPriceMap[currency as 'INR' | 'USD'] || perCreditPriceMap['USD'];
};

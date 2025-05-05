export const getStaticPricing = (currency: string) => {
    const pricingMap: Record<'INR' | 'USD', { current: number; original: number }> = {
      INR: { current: 199, original: 99 },
      USD: { current: 9, original: 5 },
    };
  
    return pricingMap[currency as 'INR' | 'USD'] || pricingMap['USD']; // default fallback
  };
  
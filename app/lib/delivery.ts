export const FREE_DELIVERY_OVER = 150000;
export const FLAT_DELIVERY_FEE = 3500;

export function deliveryFeeFor(subtotal: number) {
  return subtotal >= FREE_DELIVERY_OVER ? 0 : FLAT_DELIVERY_FEE;
}

// Единые условия доставки — используются на странице товара, в корзине и на /delivery
export const FREE_DELIVERY_FROM = 30000;
export const DELIVERY_PRICE = 2000;
export const EXPRESS_MINUTES = 60;

export function deliveryCost(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_PRICE;
}

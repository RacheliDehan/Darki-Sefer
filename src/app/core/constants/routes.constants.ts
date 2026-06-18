export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  BOOK_DETAILS: '/books/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  CONTACT: '/contact',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];

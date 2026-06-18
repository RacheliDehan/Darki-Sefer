import { Routes } from '@angular/router';
import { ROUTES as ROUTE_CONSTANTS } from './core/constants/routes.constants';

function pathFromRoute(value: string): string {
  return value.startsWith('/') ? value.slice(1) : value;
}

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        data: {
          title: 'בית | DSefer',
          meta: [{ name: 'description', content: 'חנות ספרים מקומית - דפסת ספרים, קטלוג והזמנות' }]
        }
      },
      {
        path: pathFromRoute(ROUTE_CONSTANTS.CATALOG),
        loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent),
        data: {
          title: 'קטלוג | DSefer',
          meta: [{ name: 'description', content: 'עיין בקטלוג הספרים שלנו לפי קטגוריות ומחירים' }]
        }
      },
      {
        path: pathFromRoute(ROUTE_CONSTANTS.CART),
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
        data: { title: 'עגלת קניות | DSefer' }
      },
      {
        path: pathFromRoute(ROUTE_CONSTANTS.CHECKOUT),
        loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
        data: { title: 'תשלום | DSefer' }
      },
      {
        path: pathFromRoute(ROUTE_CONSTANTS.CONTACT),
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
        data: { title: 'יצירת קשר | DSefer' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
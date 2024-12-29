import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/app/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('../../pages/home/home.component').then(
        (c) => c.HomeComponent,
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('../../pages/products/products.component').then(
        (c) => c.ProductsComponent,
      ),
  },
  {
    path: 'stock',
    loadComponent: () =>
      import('../../pages/stock/stock.component').then(
        (c) => c.StockComponent,
      ),
  },
  {
    path: 'sales',
    loadComponent: () =>
      import('../../pages/sales/sales.component').then(
        (c) => c.SalesComponent,
      ),
  }
];

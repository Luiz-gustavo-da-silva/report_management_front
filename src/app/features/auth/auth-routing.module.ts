import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../../pages/login/login.component').then(
        (c) => c.LoginComponent,
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../../pages/signup/signup.component').then(
        (c) => c.SignupComponent,
      ),
  },
];

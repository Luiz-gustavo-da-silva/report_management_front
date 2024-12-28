import { Routes } from '@angular/router';
import { authenticatedGuard } from './core/guards/authenticated.guard';
import { notAuthenticatedGuard } from './core/guards/not-authenticated.guard';

export const routes: Routes = [
    {
      path: '',
      redirectTo: '/app/home',
      pathMatch: 'full',
    },
    {
      path: 'app',
      canActivate: [authenticatedGuard],
      canActivateChild: [authenticatedGuard],
      loadChildren: () =>
        import('./modules/content.module').then((c) => c.contentModule),
    },
    {
      path: 'auth',
      canActivate: [notAuthenticatedGuard],
      canActivateChild: [notAuthenticatedGuard],
      loadChildren: () =>
        import('./modules/auth.module').then((c) => c.AuthModule),
    },
  ];
  

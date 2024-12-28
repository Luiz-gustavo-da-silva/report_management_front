import { CanActivateFn } from '@angular/router';
import { AutenticacaoService } from '../services/autenticacao.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacaoService);
  const router = inject(Router);

  if (authService.isUsuarioLogado()) {
    return true;
  } else {
    router.navigate(['/auth']);
    return false;
  }
};

import { CanActivateFn } from '@angular/router';
import { AutenticacaoService } from '../services/autenticacao.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const notAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacaoService);
  const router = inject(Router);

  if (!authService.isUsuarioLogado()) {
    return true;
  } else {
    router.navigate(['/app']);
    return false;
  }
};

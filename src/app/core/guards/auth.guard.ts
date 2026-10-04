import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (authService.isLoggedIn()) {
    return true;
  }

  messageService.add({
    severity: 'error',
    summary: 'Please log in',
    detail: 'You need to be logged in to view this page.'
  });

  return router.createUrlTree(['/']);
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (authService.isAdmin()) {
    return true;
  }

  messageService.add({
    severity: 'error',
    summary: 'Access denied',
    detail: 'Route not accessible'
  });

  return router.createUrlTree(['/']);
};

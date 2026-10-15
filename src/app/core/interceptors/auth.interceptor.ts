import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Requests to these endpoints must go out without an Authorization header.
const EXCLUDED_URL_SEGMENTS = ['/Users/login', '/Users/signup', '/Categories', '/Products', '/Designs/', '/Promotions/active'];

// Module-level, not per-request: several authenticated requests can 401 together (e.g. on page load),
// and this keeps the session-expired toast/redirect from firing more than once for that burst.
let sessionExpiredHandled = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  const token = authService.token();
  const isExcluded = EXCLUDED_URL_SEGMENTS.some(segment => req.url.includes(segment));

  const outgoing = (!token || isExcluded)
    ? req
    : req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(outgoing).pipe(
    catchError((error: unknown) => {
      // A 401 on an authenticated, non-excluded request means the stored token is no longer valid
      // (most likely expired) — the login/signup endpoints themselves return 401 for wrong credentials,
      // which is not a session expiry, so they're excluded here too.
      if (token && !isExcluded && error instanceof HttpErrorResponse && error.status === 401) {
        handleSessionExpired(authService, router, messageService);
      }

      return throwError(() => error);
    })
  );
};

function handleSessionExpired(authService: AuthService, router: Router, messageService: MessageService): void {
  if (sessionExpiredHandled) {
    return;
  }
  sessionExpiredHandled = true;

  authService.logout();
  messageService.add({
    severity: 'warn',
    summary: 'Session expired',
    detail: 'Please log out and log in again.'
  });
  router.navigate(['/']);

  // Reset once this burst of requests has had time to settle, so a future expiry can show the toast again.
  setTimeout(() => {
    sessionExpiredHandled = false;
  }, 3000);
}

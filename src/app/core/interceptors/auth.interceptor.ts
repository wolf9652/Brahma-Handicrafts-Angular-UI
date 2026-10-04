import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Requests to these endpoints must go out without an Authorization header.
const EXCLUDED_URL_SEGMENTS = ['/Users/login', '/Users/signup', '/Categories', '/Products', '/Designs/'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  const isExcluded = EXCLUDED_URL_SEGMENTS.some(segment => req.url.includes(segment));
  if (!token || isExcluded) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
};

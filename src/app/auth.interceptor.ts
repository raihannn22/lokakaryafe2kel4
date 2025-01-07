import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/login')) {
    return next(req);
  }

  if (req.method === 'POST' && req.url.endsWith('/login')) {
    return next(req);
  }

  if (typeof window !== 'undefined' && localStorage.getItem('token')) {
    const token = localStorage.getItem('token');
    const authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authReq);
  }

  return next(req);
};

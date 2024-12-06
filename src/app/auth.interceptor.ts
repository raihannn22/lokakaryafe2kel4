import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Jangan tambahkan token jika URL adalah login
  if (req.url.includes('/login')) {
    return next(req);  // Lewatkan request tanpa modifikasi
  }

  if (req.method === 'POST' && req.url.endsWith('/login')) {
    return next(req);
  }

  if (typeof window !== 'undefined' && localStorage.getItem('token')) {
    const token = localStorage.getItem('token');
    const authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    // console.log("ini asdwasdw")
    return next(authReq);
  }

  return next(req);
};

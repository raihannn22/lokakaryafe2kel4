import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);

  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp && decodedToken.exp > currentTime) {
      return true;
    }
  }

  router.navigate(['/login']);
  return false;
};

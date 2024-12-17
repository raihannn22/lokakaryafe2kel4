import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router); // Inject router untuk navigasi
    
    const token = localStorage.getItem('token'); // Ambil token dari localStorage
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Waktu sekarang dalam detik
      
      if (decodedToken.exp && decodedToken.exp > currentTime) {
        router.navigate(['/dashboard']);
        return false;
      } else {
        return true;
      }
    }
  

    return true;
};

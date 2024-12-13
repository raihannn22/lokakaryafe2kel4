import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MenuManagementService } from '../service/menu-management/menu-management.service';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';

export const roleGuard: CanActivateFn = async (route, state) => {
  
  const token = localStorage.getItem('token'); // Ambil token dari localStorage
  const router = inject(Router);
  if (token) {
    const decodedToken: any = jwtDecode(token);
  
  const username = decodedToken.sub!;
  const menuService = inject(MenuManagementService);
  const data = await firstValueFrom(menuService.getMenuByUsername(username));
  let menus: any[] = [];
  try {
    menus = data.content;
  } catch (e) {
    router.navigate(['dashboard'])
    console.error(e);
    return false;
  }
//   console.log(menus , 'ini menunya');
  const requiredPermission = route.data['permission'];
  const canAccess = menus.some((menu) => menu.MENU_NAME === requiredPermission);
  if (canAccess) {
    return true
  }
  router.navigate(['dashboard'])
  return false
}else  {
    router.navigate(['login'])
    return false;
} 
};

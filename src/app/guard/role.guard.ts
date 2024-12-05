// import { inject } from '@angular/core';
// import { CanActivateFn } from '@angular/router';
// import { MenuManagementService } from '../service/menu-management/menu-management.service';

// export const roleGuard: CanActivateFn = async (route, state) => {
//   const tokenService = inject(Tken);
//   const jwtPayload = tokenService.decodeToken(tokenService.getToken()!);
//   const userId = jwtPayload.sub!;
//   const menuService = inject(MenuManagementService);
//   const data = await firstValueFrom(menuService.getMenuByUserId(userId));
//   let menus: Menu[] = [];
//   try {
//     menus = data.content;
//   } catch (e) {
//     console.error(e);
//     return false;
//   }
//   const requiredPermission = route.data['permission'];
//   return menus.some((menu) => menu.menu_name === requiredPermission);
// };

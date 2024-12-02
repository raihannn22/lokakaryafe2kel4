import { Component, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuManagementService } from '../service/menu-management/menu-management.service';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CheckboxModule, TableModule, FormsModule, ButtonModule],
  templateUrl: './menu-management.component.html',
  styleUrl: './menu-management.component.css'
})
export class MenuManagementComponent implements OnInit {
  roles: any[] = [];
  menus: any[] = [];
  roleMenuMap: { [key: string]: { [key: string]: boolean } } = {}; // Map untuk role dan menu

  constructor(private menuManagementService: MenuManagementService) {}

  ngOnInit(): void {
    this.getAllMenu();
    this.getAllRole();
  }

  getAllRole() {
    this.menuManagementService.gettAllRole().subscribe({
      next: (response) => {
        this.roles = response.content;
        this.initializeRoleMenuMap();
      },
      error: (error) => console.error('Error fetching roles:', error),
    });
  }

  getAllMenu() {
    this.menuManagementService.gettAllMenu().subscribe({
      next: (response) => {
        this.menus = response.content;
        this.initializeRoleMenuMap();
      },
      error: (error) => console.error('Error fetching menus:', error),
    });
  }

  initializeRoleMenuMap() {
    for (const role of this.roles) {
      this.roleMenuMap[role.ID] = {};
      for (const menu of this.menus) {
        this.roleMenuMap[role.ID][menu.ID] = false; // Inisialisasi semua checkbox
      }
    }
  }

  updateRoleMenu(roleId: string, menuId: string, isChecked: boolean) {
    this.roleMenuMap[roleId][menuId] = isChecked;
  }

  savePermissions() {
    const result: { [key: string]: string[] } = {};

    for (const roleId in this.roleMenuMap) {
      result[roleId] = Object.keys(this.roleMenuMap[roleId])
        .filter((menuId) => this.roleMenuMap[roleId][menuId]); // Ambil menu yang dicentang
    }

    this.menuManagementService.updateRoleMenu(result).subscribe({
      next: (response) => {
        console.log('Role-menu updated successfully:', response);
      },
      error: (error) => console.error('Error updating role-menu:', error),
    })

    console.log('Resulting JSON:', result);
    // Lakukan aksi lanjutan, seperti kirim ke backend
  }
}

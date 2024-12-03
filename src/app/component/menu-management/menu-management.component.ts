import { Component, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuManagementService } from '../../service/menu-management/menu-management.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CheckboxModule, TableModule, FormsModule, ButtonModule, ToastModule],
  templateUrl: './menu-management.component.html',
  styleUrl: './menu-management.component.css'
})
export class MenuManagementComponent implements OnInit {
  roles: any[] = [];
  menus: any[] = [];
  approlemenu: any[] = [];
  roleMenuMap: { [key: string]: { [key: string]: boolean } } = {}; // Map untuk role dan menu

  constructor(private menuManagementService: MenuManagementService, private messageService: MessageService) {}

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
  
  mapMenuName(name: string): string {
    const menuNameMapping: { [key: string]: string } = {
      'user#read': 'User Management - Read',
      'user#all': 'User Management - All',
      'division#all': 'Division Management - All',
      'role-menu#all': 'Role Menu - All',
      'group-attitude-skill#all': 'Group Attitude Skill - All',
      'attitude-skill#all': 'Attitude Skill - All',
      'technical-skill#all': 'Technical Skill - All',
      'dev-plan#all': 'Development Plan - All',
      'achievement#all': 'Achievement - All',
      'group-achievement#all': 'Group Achievement - All',
      'summary#read': 'Summary - Read (All)',
      'summary#read.self': 'Summary - Read (Self)',
      'emp-achievement#all': 'Emp Achievement - All',
      'emp-attitude-skill#all': 'Emp Attitude Skill - All',
      'emp-technical-skill#all': 'Emp Technical Skill - All',
      'emp-dev-plan#all': 'Emp Development Plan - All',
      'emp-suggestion#all': 'Emp Suggestion - All',
    };
    return menuNameMapping[name] || name; 
  }

  getAllMenu() {
    this.menuManagementService.gettAllMenu().subscribe({
      next: (response) => {
        this.menus = response.content.map((menu: any) => {
          return {
            ...menu,
            MENU_NAME: this.mapMenuName(menu.MENU_NAME) // Ganti nama menu
          };
        });
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

    this.menuManagementService.getAllRoleMenu().subscribe({
      next: (mappings) => {
        this.approlemenu = mappings.content;
        this.approlemenu.forEach((mapping: any) => {     
          const roleId = mapping.ROLE_ID.id;
          const menuId = mapping.MENU_ID.id;
          this.roleMenuMap[roleId][menuId] = true; // Set checkbox sesuai data backend
        });
      },
      error: (error) => console.error('Error fetching role-menu mappings:', error),
    });
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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
      },
      error: (error) => console.error('Error updating role-menu:', error),
    })

    console.log('Resulting JSON:', result);
    // Lakukan aksi lanjutan, seperti kirim ke backend
  }
}

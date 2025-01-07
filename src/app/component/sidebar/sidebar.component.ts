import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { RouterLink } from '@angular/router';
import { MenuManagementService } from '../../service/menu-management/menu-management.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  constructor(private menuManagementService: MenuManagementService) {}
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @Input() sidebarVisible: boolean = false;
  @Output() sidebarClosed = new EventEmitter<void>();
  menus: any[] = [];
  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }

  onSidebarHide(): void {
    this.sidebarClosed.emit();
  }
  role: string | null = '';

  ngOnInit() {
    const storedRole = localStorage.getItem('role');
    this.role = storedRole ? storedRole : 'Guest';
    const idUser = localStorage.getItem('id');
    this.menuManagementService
      .getMenuByUserId(idUser)
      .subscribe((response: any) => {
        this.menus = this.mapMenuData(response.content);
      });
  }

  mapMenuData(menuData: any[]): any[] {
    const menuMapping: {
      [key: string]: { name: string; path: string; icon: string };
    } = {
      'user#all': {
        name: 'User Management',
        path: '/user-management',
        icon: 'pi pi-user-edit',
      },
      'division#all': {
        name: 'Division Management',
        path: '/division-management',
        icon: 'pi pi-ethereum',
      },
      'summary#read': {
        name: 'All Summary View',
        path: '/summary/read',
        icon: 'pi pi-file-o',
      },
      'dev-plan#all': {
        name: 'Development Plan',
        path: '/development-plan',
        icon: 'pi pi-sparkles',
      },
      'technical-skill#all': {
        name: 'Technical Skill',
        path: '/technical-skill',
        icon: 'pi pi-list-check',
      },
      'group-achievement#all': {
        name: 'Group Achievement',
        path: '/group-achievement',
        icon: 'pi pi-sitemap',
      },
      'achievement#all': {
        name: 'Achievement',
        path: '/achievement',
        icon: 'pi pi-star',
      },
      'attitude-skill#all': {
        name: 'Attitude Skill',
        path: '/attitude-skill',
        icon: 'pi pi-bolt',
      },
      'group-attitude-skill#all': {
        name: 'Group Attitude',
        path: '/group-attitude-skill',
        icon: 'pi pi-sitemap',
      },
      'emp-dev-plan#read': {
        name: 'VIew Employee Development Plan',
        path: '/view-empdevplan',
        icon: 'pi pi-bullseye',
      },
      'emp-achievement#all': {
        name: 'Employee Achievement',
        path: '/emp-achievement-skill',
        icon: 'pi pi-list-check',
      },
      'role-menu#all': {
        name: 'Menu Management',
        path: '/menu-management',
        icon: 'pi pi-objects-column',
      },

      'summary#read.self': {
        name: 'Summary View',
        path: '/user/summary-view',
        icon: 'pi pi-file-o',
      },
      'emp-suggestion#all': {
        name: 'Employee Suggestion',
        path: '/emp-suggestion',
        icon: 'pi pi-list-check',
      },
      'emp-technical-skill#all': {
        name: 'Employee Technical Skill',
        path: '/emp-technical-skill',
        icon: 'pi pi-list-check',
      },
      'emp-dev-plan#all': {
        name: 'Employee Development Plan',
        path: '/employee-development-plan',
        icon: 'pi pi-bullseye',
      },
      'emp-attitude-skill#all': {
        name: 'Employee Attitude Skills',
        path: '/emp-attitude-skill',
        icon: 'pi pi-list-check',
      },
      'emp-assessment#all': {
        name: 'Employee Assessment',
        path: '/employee-assessment',
        icon: 'pi pi-list-check',
      },

      'user#read': {
        name: 'View User',
        path: '/view-user',
        icon: 'pi pi-users',
      },
      'summary#approve': {
        name: 'Approve Summary',
        path: '/summary-approve',
        icon: 'pi pi-list-check',
      },
    };

    return menuData.map((menu) => ({
      ...menu,
      MAPPED_NAME: menuMapping[menu.MENU_NAME]?.name || menu.MENU_NAME,
      path: menuMapping[menu.MENU_NAME]?.path || '/',
      icon: menuMapping[menu.MENU_NAME]?.icon || 'pi pi-file',
    }));
  }

  getMenuByRole(role: string): any[] {
    return this.menus.filter((menu) => menu.ROLE_NAME.toLowerCase() === role);
  }
}

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
item: any;

  constructor (private menuManagementService: MenuManagementService) {}
  ngOnInit(): void {
    this.getAllMenu();
      this.getAllRole();
  }
    
    roles:any = [];
    menus:any = [];
    nganu: {[key: string] : string[]} = {};

    

    getAllRole() {
      this.menuManagementService.gettAllRole().subscribe({
        next: (response) => {
          this.roles = response.content; 
          this.roles.array.forEach((role:any) => {
            this.nganu[role.ID] = role.menus!;
          });
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
    };
    
    getAllMenu() {
      this.menuManagementService.gettAllMenu().subscribe({
        next: (response) => {
          this.menus = response.content; 
          console.log('Total menus:', this.menus);
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
    };


    

    savePermissions() {
      console.log(this.nganu)
   
  }
}

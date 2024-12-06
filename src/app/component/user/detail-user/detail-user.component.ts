import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { UserService } from '../../../service/user/user.service';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ChipsModule } from 'primeng/chips';

@Component({
  selector: 'app-detail-user',
  standalone: true,
  imports: [DialogModule, InputTextModule, ButtonModule, CommonModule, CalendarModule, FormsModule, DropdownModule, CheckboxModule, TagModule, ChipsModule ],
  templateUrl: './detail-user.component.html',
  styleUrl: './detail-user.component.css'
})
export class DetailUserComponent {


  
  @Input() visible: boolean = false;  // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>();  // Emit perubahan visibility
  @Input() user: any = {};

  divisions: any[] = [];
  roles: any[] = [];

  constructor(
    private userService: UserService
  ) {}

  ngOnChanges() {
    if (this.user) {
      this.newUser = { ...this.user };
    }
    if (this.user && this.user.app_role) {
      // Ambil hanya ID dari setiap role di array app_role
      this.newUser.app_role = this.user.app_role.map((role: any) => role.roleName);
      console.log('Updated newUser app_role:', this.newUser); // Debug log
    }
  }

  ngOnInit() {
    this.getAllDivision();
    this.getAllRole();
    console.log(this.user , 'ini on inir');
    // this.newUser = { ...this.user };
    this.newUser = { ...this.user 
    };

  }

  

  getAllRole() {
    this.userService.getAllRole().subscribe({
      next: (response) => {
        this.roles = response.content; // Data ada di 'content'
        console.log('Total rows:', this.roles);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  getAllDivision() {
    this.userService.getAllDivision().subscribe({
      next: (response) => {
        this.divisions = response.content; // Data ada di 'content'
        console.log('Total rows:', this.divisions);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  newUser = {
    username: '',
    full_name: '',
    position: '',
    email_address: '',
    employee_status: null,
    app_role : [],
    join_date: null,
    enabled: 1,
    division_id: '',
    division_name: ''
  };

  

  employeeStatusOptions = [
    { label: 'Kontrak', value: 1 },
    { label: 'Permanen', value: 2 }
  ];

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 }
  ];

 

  closeDialog() {
    this.visibleChange.emit(false)
  }

 
}
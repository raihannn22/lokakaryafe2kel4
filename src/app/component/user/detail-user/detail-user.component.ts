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
import { jwtDecode } from 'jwt-decode';
import { SummaryComponent } from '../../summary/summary.component';

@Component({
  selector: 'app-detail-user',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    CalendarModule,
    FormsModule,
    DropdownModule,
    CheckboxModule,
    TagModule,
    ChipsModule,
    SummaryComponent
  ],
  templateUrl: './detail-user.component.html',
  styleUrl: './detail-user.component.css',
})
export class DetailUserComponent {
  @Input() visible: boolean = false; // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>(); // Emit perubahan visibility
  @Input() user: any = {};
  @Input() year: number = 0;

  divisions: any[] = [];
  roles: any[] = [];
  token: string | null = '';
  userRoles: string = '';

  displaySummaryDialog = false;

  constructor(private userService: UserService) {}

  ngOnChanges() {
    if (this.user) {
      this.newUser = { ...this.user };
    }
    if (this.user && this.user.app_role) {
      // Ambil hanya ID dari setiap role di array app_role
      this.newUser.app_role = this.user.app_role.map(
        (role: any) => role.roleName
      );
    }

    this.token = localStorage.getItem('token');
    this.getRolesFromToken();
  }

  ngOnInit() {
    this.getAllDivision();
    this.getAllRole();
    // this.newUser = { ...this.user };
    this.newUser = { ...this.user };
  }

  getRolesFromToken(): void {
    if (this.token) {
      try {
        const decoded: any = jwtDecode(this.token);
        let roles = decoded.role;
        roles = roles
          .slice(1, -1) // Hilangkan karakter "[" dan "]"
          .split(',') // Pecah berdasarkan koma
          .map((role: string) => role.trim()); // Hapus spasi di sekitar elemen

        this.userRoles = roles.join(', ');
      } catch (error) {
        console.error('Error decoding roles from token:', error);
      }
    } else {
      console.warn('Token not found');
    }
  }

  getAllRole() {
    this.userService.getAllRole().subscribe({
      next: (response) => {
        this.roles = response.content; 
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  getAllDivision() {
    this.userService.getAllDivision().subscribe({
      next: (response) => {
        this.divisions = response.content;
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
    app_role: [],
    join_date: null,
    enabled: 1,
    division_id: '',
    division_name: '',
  };

  employeeStatusOptions = [
    { label: 'Kontrak', value: 1 },
    { label: 'Permanen', value: 2 },
  ];

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 },
  ];

  closeDialog() {
    this.visibleChange.emit(false);
  }

  openSummaryDialog(user: any) {
    this.user = user;
    this.visibleChange.emit(false);
    this.displaySummaryDialog = true;
  }

  
}

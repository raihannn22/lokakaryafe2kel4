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
import { TooltipModule } from 'primeng/tooltip';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-user',
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
    TooltipModule,
  ],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css',
})
export class UpdateUserComponent {
  isValidForm(): boolean {
    return (
      !!this.newUser.username &&
      !!this.newUser.full_name &&
      !!this.newUser.position &&
      !!this.newUser.email_address &&
      !!this.newUser.employee_status &&
      !!this.newUser.join_date &&
      !!this.newUser.division_id &&
      !!this.newUser.app_role
    );
  }

  isUniqueUsername(): boolean {
    if (!this.newUser.username) return false;
    return (
      Array.isArray(this.oldUsers) &&
      !this.oldUsers.some(
        (user) =>
          user.username.toLowerCase().trim() ===
            this.newUser.username.toLowerCase().trim() &&
          user.username.toLowerCase().trim() !==
            this.user.username.toLowerCase().trim()
      )
    );
  }

  isUniqueEmail(): boolean {
    if (!this.newUser.email_address) return false;
    return (
      Array.isArray(this.oldUsers) &&
      !this.oldUsers.some(
        (user) =>
          user.email_address.toLowerCase().trim() ===
            this.newUser.email_address.toLowerCase().trim() &&
          user.email_address.toLowerCase().trim() !==
            this.user.email_address.toLowerCase().trim()
      )
    );
  }

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() user: any = {};
  @Output() userCreated = new EventEmitter<any>();

  divisions: any[] = [];
  roles: any[] = [];
  oldUsers: any[] = [];

  constructor(private userService: UserService) {}

  ngOnChanges() {
    if (this.user) {
      this.newUser = { ...this.user };
    }
    if (this.user && this.user.app_role) {
      this.newUser.app_role = this.user.app_role.map((role: any) => role.id);
    }
    this.getAllDivision();
  }

  ngOnInit() {
    this.getAllRole();
    this.getAllUsers();
    this.newUser = { ...this.user };
  }

  getAllRole() {
    this.userService.getAllRole().subscribe({
      next: (response) => {
        this.roles = response.content;
      },
      error: (error) => {},
    });
  }

  getAllDivision() {
    this.userService.getAllDivision().subscribe({
      next: (response) => {
        this.divisions = response.content;
      },
      error: (error) => {},
    });
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.oldUsers = response.content;
      },
      error: (error) => {},
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

  onSubmit() {
    const updatedData: any = { ...this.newUser };

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === this.user[key]) {
        updatedData[key] = null;
      }
    });

    this.userService.updateUser(this.user.id, updatedData).subscribe({
      next: (response) => {
        this.userCreated.emit(response);
        this.closeDialog();
      },

      error: (error) => {},
    });
  }

  onResetPassword() {
    Swal.fire({
      title: 'Are you sure?',
      text:
        'Apakah Anda yakin ingin reset password akun dengan username ' +
        this.user.username +
        ' ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reset!',
      customClass: {
        popup: 'custom-swal-popup',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.resertPassword(this.user.id).subscribe({
          next: (data) => {
            const newPassword = data.content;
            Swal.fire({
              title: 'Reset Password!',
              text:
                'Password akun dengan username ' +
                this.user.username +
                ' di reset menjadi ' +
                newPassword,
              icon: 'success',
            });
          },
          error: (error) => {},
        });
      }
    });
  }
}

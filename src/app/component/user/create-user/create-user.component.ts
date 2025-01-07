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

@Component({
  selector: 'app-create-user',
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
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent {
  isValidForm(): boolean {
    return (
      !!this.newUser.username &&
      !!this.newUser.full_name &&
      !!this.newUser.position &&
      !!this.newUser.email_address &&
      !!this.newUser.employee_status &&
      !!this.newUser.join_date &&
      !!this.newUser.enabled &&
      !!this.newUser.division_id
    );
  }

  isUniqueUsername(): boolean {
    return (
      Array.isArray(this.oldUsers) &&
      !this.oldUsers.some(
        (user) =>
          user.username.toLowerCase().trim() ===
          this.newUser.username.toLowerCase().trim()
      )
    );
  }

  isUniqueEmail(): boolean {
    return (
      Array.isArray(this.oldUsers) &&
      !this.oldUsers.some(
        (user) =>
          user.email_address.toLowerCase().trim() ===
          this.newUser.email_address.toLowerCase().trim()
      )
    );
  }

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Output() userCreated = new EventEmitter<any>();

  divisions: any[] = [];
  roles: any[] = [];
  oldUsers: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getAllDivision();
    this.getAllRole();
    this.getAllUsers();
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
    this.userService.saveUser(this.newUser).subscribe({
      next: (response) => {
        this.userCreated.emit(response);
        this.closeDialog();
      },
      error: (error) => {},
    });
  }
}

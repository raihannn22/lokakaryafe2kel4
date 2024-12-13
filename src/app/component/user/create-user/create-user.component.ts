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
  imports: [DialogModule, InputTextModule, ButtonModule, CommonModule, CalendarModule, FormsModule, DropdownModule, CheckboxModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

  isValidForm(): boolean {
    // const isUniqueUsername = Array.isArray(this.oldUsers) && !this.oldUsers.some(
    //   (user) => user.username.toLowerCase().trim() === this.newUser.username.toLowerCase().trim()
    // );

    return !!this.newUser.username &&
           !!this.newUser.full_name &&
           !!this.newUser.position &&
           !!this.newUser.email_address &&
           !!this.newUser.employee_status &&
           !!this.newUser.join_date &&
           !!this.newUser.enabled &&
           !!this.newUser.division_id
  }

  isUniqueUsername(): boolean {
    return Array.isArray(this.oldUsers) && !this.oldUsers.some(
      (user) => user.username.toLowerCase().trim() === this.newUser.username.toLowerCase().trim()
    );
  }

  isUniqueEmail(): boolean {
    return Array.isArray(this.oldUsers) && !this.oldUsers.some(
      (user) => user.email_address.toLowerCase().trim() === this.newUser.email_address.toLowerCase().trim()
    );
  }


  @Input() visible: boolean = false;  // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>();  // Emit perubahan visibility

  @Output() userCreated = new EventEmitter<any>();

  divisions: any[] = [];
  roles: any[] = [];
  oldUsers: any[] = [];

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getAllDivision();
    this.getAllRole();
    this.getAllUsers();
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

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.oldUsers = response.content; // Data ada di 'content'
        // console.log('Total rows:', this.oldUsers);
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
    division_id: ''
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

  onSubmit() {
    this.userService.saveUser(this.newUser).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.userCreated.emit(response);// Emit event ke komponen induk
        this.closeDialog();               // Tutup dialog setelah berhasil
      },
      error: (error) => {
        console.error('Error creating user:', error);
        // Tambahkan penanganan error di sini
      }
    });
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [DialogModule, InputTextModule, ButtonModule, NgIf, CommonModule, FormsModule, DropdownModule],
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent {
  @Input() visible: boolean = false;  // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>();  // Emit perubahan visibility

  @Output() userCreated = new EventEmitter<any>();  

  newUser = {
    username: '',
    full_name: '',
    position: '',
    email_address: '',
    employee_status: null,
    join_date: null,
    enabled: 1,
    password: '',
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

  openCreateDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  onSubmit() {
    console.log('New User:', this.newUser);
    // Tambahkan logika untuk menyimpan user baru di sini (misalnya: panggil service API)
    this.closeDialog();
  }
}

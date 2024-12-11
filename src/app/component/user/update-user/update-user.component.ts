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
  imports: [DialogModule, InputTextModule, ButtonModule, CommonModule, CalendarModule, FormsModule, DropdownModule, CheckboxModule, TooltipModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {

  isValidForm(): boolean {
    return !!this.newUser.username &&
           !!this.newUser.full_name &&
           !!this.newUser.position &&
           !!this.newUser.email_address &&
           !!this.newUser.employee_status &&
           !!this.newUser.join_date &&
           !!this.newUser.division_id;
  }


  @Input() visible: boolean = false;  // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>();  // Emit perubahan visibility
  @Input() user: any = {};
  @Output() userCreated = new EventEmitter<any>();

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
      this.newUser.app_role = this.user.app_role.map((role: any) => role.id);
      console.log('Updated newUser app_role:', this.newUser.app_role); // Debug log
    }
    this.getAllDivision();
  }

  ngOnInit() {
    this.getAllRole();
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
    // Buat salinan objek untuk menghindari perubahan langsung pada newUser
    const updatedData: any = { ...this.newUser };

    // Bandingkan setiap field dan set menjadi null jika nilainya sama dengan data existing
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] === this.user[key]) {
        updatedData[key] = null;  // Set field menjadi null jika sama
      }
    });

    // Kirim data yang sudah divalidasi ke server
    this.userService.updateUser(this.user.id, updatedData).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        this.userCreated.emit(response);  // Emit event ke komponen induk
        this.closeDialog();               // Tutup dialog setelah berhasil
      },

      error: (error) => {
        console.error('Error updating user:', error);
        // Tambahkan penanganan error di sini
      }
    });
  }

  onResetPassword() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Apakah Anda yakin ingin reset password akun dengan username ' + this.user.username + ' ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reset!',
      customClass: {
        popup: 'custom-swal-popup'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.resertPassword(this.user.id).subscribe({
          next: () => {
            Swal.fire({
              title: "Reset Password!",
              text: 'Password akun dengan username ' + this.user.username + ' di reset menjadi ogya123',
              icon: "success"
            });               // Tutup dialog setelah berhasil
          },
          error: (error) => {
            console.error('Error updating user:', error);
            // Tambahkan penanganan error di sini
          }
        })
      }
    });
  }
}

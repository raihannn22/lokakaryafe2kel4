import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
// import { UserService } from '../service/user.service';
// import { CreateUserComponent } from '/component/create-user/create-user.component';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CreateUserComponent } from '../create-user/create-user.component';
import { UserService } from '../../../service/user/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ButtonModule, CalendarModule, FormsModule, TableModule, CreateUserComponent, DialogModule, TagModule, ToastModule, 
      UpdateUserComponent, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent implements OnInit {

  
  users: any[] = [];
  loading: boolean = true;
  displayCreateDialog = false;
  displayUpdateDialog = false;
  selectedUser: any;
  searchValue: string | undefined;
  

  constructor(
    private userService: UserService,
    
  ) {}


  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.content; // Data ada di 'content'
        console.log('Total rows:', response.totalRows);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      },
    });
  }


  openCreateDialog() {
    this.displayCreateDialog = true;
  }

  openUpdateDialog(user: any) {
    this.selectedUser = user;
    console.log(this.selectedUser);
    this.displayUpdateDialog = true;
  }

  
  // Fungsi menangani event user yang dibuat
  onUserCreated(newUser: any) {
    console.log('User baru:', newUser);
    // Logika untuk menyimpan user ke database (via API)
    this.getAllUsers();
    this.displayCreateDialog = false;
    // Tambahkan user baru ke daftar users atau update data sesuai kebutuhan
  }

  confirmDelete(user: any) {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Anda akan menghapus pengguna ${user.username}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            Swal.fire('Terhapus!', 'Pengguna berhasil dihapus.', 'success');
            this.getAllUsers(); // Panggil metode untuk memperbarui tabel
          },
          error: (error) => {
            Swal.fire('Error', 'Terjadi kesalahan saat menghapus pengguna.', 'error');
            console.error('Error deleting user:', error);
          }
        });
      }
    });
  }
  
}
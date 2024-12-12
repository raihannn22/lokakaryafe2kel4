import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { Table, TableModule } from 'primeng/table';
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
import { MessageService } from 'primeng/api';
import { DetailUserComponent } from '../detail-user/detail-user.component';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ButtonModule, CalendarModule, FormsModule, TableModule, CreateUserComponent, DialogModule, TagModule, ToastModule,
      UpdateUserComponent, IconFieldModule, InputIconModule, InputTextModule, DetailUserComponent, DropdownModule, MultiSelectModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent implements OnInit {


  users: any[] = [];
  loading: boolean = true;
  displayCreateDialog = false;
  displayUpdateDialog = false;
  displayDetailDialog = false;
  selectedUser: any;
  searchValue: string | undefined;
  token: string | null = '';
  userRoles: string = '';
  statuses!: any[];
  divisi!: any[];
  divisionName: string[] = [];


  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
}

  isViewUserRoute(): boolean {
    return this.router.url === '/view-user'; // Memeriksa jika URL adalah /login
  }

  ngOnInit() {
    this.getAllUsers();
    this.token = localStorage.getItem('token');
    this.getRolesFromToken();
    this.getAllDivision();

    this.statuses = [
      { label: 'Permanen', value: '2' },
      { label: 'Kontrak', value: '1' },
    ];
    // console.log(this.statuses);
  }

  getSeverity(status: string) {
    switch (status) {
        case 'Kontrak':
            return 'warning';

        case 'Permanen':
            return 'info';

        default:
            return 'danger';
    }
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

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      },
    });
  }

  getAllDivision() {
    this.userService.getAllDivision().subscribe({
      next: (response) => {
        this.divisi = response.content; // Data ada di 'content'
        console.log('Total divisi:', this.divisi);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        this.divisionName = this.divisi.map(item => item.DIVISION_NAME);
        // console.log(this.divisionName, 'ini division name');
      }


    });

  }

  openCreateDialog() {
    this.displayCreateDialog = true;
  }

  openUpdateDialog(user: any) {
    this.selectedUser = user;
    this.displayUpdateDialog = true;
  }

  openDetailDialog(user: any) {
    this.selectedUser = user;
    console.log(this.selectedUser, 'ini detail user!!!');
    this.displayDetailDialog = true;
  }



  // Fungsi menangani event user yang dibuat
  onUserCreated(newUser: any) {
    console.log('User baru:', newUser);
    // Logika untuk menyimpan user ke database (via API)
    this.getAllUsers();
    this.displayCreateDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
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

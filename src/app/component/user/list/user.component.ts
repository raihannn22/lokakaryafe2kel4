// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ButtonModule } from 'primeng/button';
// import { CalendarModule } from 'primeng/calendar';
// import { Table, TableModule } from 'primeng/table';
// // import { UserService } from '../service/user.service';
// // import { CreateUserComponent } from '/component/create-user/create-user.component';
// import { DialogModule } from 'primeng/dialog';
// import { TagModule } from 'primeng/tag';
// import { ToastModule } from 'primeng/toast';
// import Swal from 'sweetalert2';
// import { UpdateUserComponent } from '../update-user/update-user.component';
// import { IconFieldModule } from 'primeng/iconfield';
// import { InputIconModule } from 'primeng/inputicon';
// import { InputTextModule } from 'primeng/inputtext';
// import { CreateUserComponent } from '../create-user/create-user.component';
// import { UserService } from '../../../service/user/user.service';
// import { MessageService } from 'primeng/api';
// import { DetailUserComponent } from '../detail-user/detail-user.component';
// import { jwtDecode } from 'jwt-decode';
// import { Router } from '@angular/router';
// import { DropdownModule } from 'primeng/dropdown';
// import { MultiSelectModule } from 'primeng/multiselect';
// import { forkJoin } from 'rxjs';
// import { SummaryService } from '../../../service/summary/summary.service';

// @Component({
//   selector: 'app-user',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ButtonModule,
//     CalendarModule,
//     FormsModule,
//     TableModule,
//     CreateUserComponent,
//     DialogModule,
//     TagModule,
//     ToastModule,
//     UpdateUserComponent,
//     IconFieldModule,
//     InputIconModule,
//     InputTextModule,
//     DetailUserComponent,
//     DropdownModule,
//     MultiSelectModule,
//   ],
//   templateUrl: './user.component.html',
//   styleUrl: './user.component.css',
// })
// export class UserComponent implements OnInit {
//   users: any[] = [];
//   title: string = 'Management Users';
//   usersWithScore: any[] = [];
//   loading: boolean = true;
//   displayCreateDialog = false;
//   displayUpdateDialog = false;
//   displayDetailDialog = false;
//   selectedUser: any;
//   searchValue: string | undefined;
//   token: string | null = '';
//   userRoles: string = '';
//   statuses!: any[];
//   divisi!: any[];
//   divisionName: string[] = [];
//   selectedYear: number = 2024;
//   scoreUsers: any[] = [];
//   years: number[] = [
//     2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
//     2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046,
//     2047, 2048, 2049, 2050,
//   ];

//   selectedDivisionId: string = '';

//   userName: string = '';

//   divisionId: string = '';
//   // userId: string | undefined;

//   onYearChange(event: any) {
//     this.getAllUsers();
//   }

//   constructor(
//     private userService: UserService,
//     private messageService: MessageService,
//     private summaryService: SummaryService,
//     private router: Router
//   ) {}

//   clear(table: Table) {
//     table.clear();
//     this.searchValue = '';
//   }

//   isViewUserRoute(): boolean {
//     return this.router.url === '/view-user'; // Memeriksa jika URL adalah /login
//   }

//   ngOnInit() {
//     this.getAllUsers();
//     this.token = localStorage.getItem('token');
//     this.getRolesFromToken();
//     this.getUsernameFromToken();
//     this.getAllDivision();
//     // this.getUserIdFromLocalStorage();
//     this.getDivisionIdFromUserId();

//     this.statuses = [
//       { label: 'Permanen', value: '2' },
//       { label: 'Kontrak', value: '1' },
//     ];
//     // console.log(this.getUsernameFromToken());
//   }

//   getSeverity(status: string) {
//     switch (status) {
//       case 'Kontrak':
//         return 'warning';

//       case 'Permanen':
//         return 'info';

//       default:
//         return 'danger';
//     }
//   }

//   getRolesFromToken(): void {
//     if (this.token) {
//       try {
//         const decoded: any = jwtDecode(this.token);
//         let roles = decoded.role;
//         roles = roles
//           .slice(1, -1) // Hilangkan karakter "[" dan "]"
//           .split(',') // Pecah berdasarkan koma
//           .map((role: string) => role.trim()); // Hapus spasi di sekitar elemen

//         this.userRoles = roles.join(', ');
//       } catch (error) {
//         console.error('Error decoding roles from token:', error);
//       }
//     } else {
//       console.warn('Token not found');
//     }
//   }

//   getUsernameFromToken(): void {
//     if (this.token) {
//       try {
//         const decoded: any = jwtDecode(this.token); // Decode JWT token
//         this.userName = decoded.sub || 'Unknown'; // Ambil nilai dari field "sub"
//         console.log('Decoded username:', this.userName);
//       } catch (error) {
//         console.error('Error decoding username from token:', error);
//       }
//     } else {
//       console.warn('Token not found');
//     }
//   }

//   // getUserIdFromLocalStorage(): number | null {
//   //   const userId = localStorage.getItem('id');
//   //   console.log('User ID:', userId);
//   //   return userId ? parseInt(userId, 10) : null;
//   // }

//   getDivisionIdFromUserId(): void {
//     const userId = localStorage.getItem('id');
//     if (userId) {
//       this.userService.getUserById(userId).subscribe(
//         (response) => {
//           if (response && response.content) {
//             // Akses division_id dari objek content
//             const divisionId = response.content.division_id;
//             console.log('Division ID:', divisionId);
//             this.divisionId = divisionId; // Simpan divisionId untuk digunakan di tempat lain
//           } else {
//             console.warn('Response is missing content or division_id');
//           }
//         },
//         (error) => {
//           console.error('Error fetching user data:', error);
//         }
//       );
//     } else {
//       console.warn('User ID not found in local storage');
//     }
//   }

//   getAllUsers() {
//     forkJoin({
//       user: this.userService.getAllUsers(),
//       total: this.summaryService.getTotalScore(this.selectedYear),
//     }).subscribe(({ user, total }) => {
//       this.loading = false;
//       this.scoreUsers = total;
//       this.users = user.content;

//       this.usersWithScore = this.users.map((user) => {
//         // Temukan skor berdasarkan ID pengguna
//         const score = this.scoreUsers.find((s) => s.userId === user.id);
//         return {
//           ...user, // Data pengguna asli
//           totalScore: score ? score.totalScore : 0, // Tambahkan totalScore
//         };
//       });
//     });
//   }

//   getAllDivision() {
//     this.userService.getAllDivision().subscribe({
//       next: (response) => {
//         this.divisi = response.content; // Data ada di 'content'
//         // console.log('Total divisi:', this.divisi);
//       },
//       error: (error) => {
//         console.error('Error fetching users:', error);
//       },
//       complete: () => {
//         this.divisionName = this.divisi.map((item) => item.DIVISION_NAME);
//       },
//     });
//   }

//   openCreateDialog() {
//     this.displayCreateDialog = true;
//   }

//   openUpdateDialog(user: any) {
//     this.selectedUser = user;
//     this.displayUpdateDialog = true;
//   }

//   openDetailDialog(user: any) {
//     this.selectedUser = user;
//     this.displayDetailDialog = true;
//   }

//   // Fungsi menangani event user yang dibuat
//   onUserCreated(newUser: any) {
//     // Logika untuk menyimpan user ke database (via API)
//     this.getAllUsers();
//     this.displayCreateDialog = false;
//     this.messageService.add({
//       severity: 'success',
//       summary: 'Success',
//       detail: 'Message Content',
//     });
//     // Tambahkan user baru ke daftar users atau update data sesuai kebutuhan
//   }

//   confirmDelete(user: any) {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: `You will delete user with username ${user.username}!`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete!',
//       cancelButtonText: 'Cancel',
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.userService.deleteUser(user.id).subscribe({
//           next: () => {
//             Swal.fire('Deleted!', 'User Already Deleted.', 'success');
//             this.getAllUsers(); // Panggil metode untuk memperbarui tabel
//           },
//           error: (error) => {
//             Swal.fire(
//               'Error',
//               'Terjadi kesalahan saat menghapus pengguna.',
//               'error'
//             );
//             console.error('Error deleting user:', error);
//           },
//         });
//       }
//     });
//   }
// }

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
import { forkJoin } from 'rxjs';
import { SummaryService } from '../../../service/summary/summary.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    TableModule,
    CreateUserComponent,
    DialogModule,
    TagModule,
    ToastModule,
    UpdateUserComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DetailUserComponent,
    DropdownModule,
    MultiSelectModule,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  users: any[] = [];
  title: string = 'Management Users';
  usersWithScore: any[] = [];
  loading: boolean = true;
  displayCreateDialog = false;
  displayUpdateDialog = false;
  displayDetailDialog = false;
  selectedUser: any;
  searchValue: string | undefined;
  token: string | null = '';
  // userRoles: string = '';
  userRoles: string[] = []; // Ubah menjadi array
  statuses!: any[];
  divisi!: any[];
  divisionName: string[] = [];
  selectedYear: number = 2024;
  scoreUsers: any[] = [];
  years: number[] = [
    2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
    2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046,
    2047, 2048, 2049, 2050,
  ];

  selectedDivisionId: string = '';
  userName: string = '';
  divisionId: string = '';

  onYearChange(event: any) {
    this.getAllUsers();
  }

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private summaryService: SummaryService,
    private router: Router
  ) {}

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  isViewUserRoute(): boolean {
    return this.router.url === '/view-user';
  }

  ngOnInit() {
    this.token = localStorage.getItem('token'); // Ambil token terlebih dahulu
    this.getRolesFromToken(); // Panggil ini terlebih dahulu untuk mengisi userRoles
    this.getUsernameFromToken(); // Ambil username setelah roles
    this.getAllDivision(); // Ambil semua divisi
    this.getDivisionIdFromUserId(); // Ambil divisionId dari userId

    // Panggil getAllUsers() setelah semua data diambil
    // this.getAllUsers();

    this.statuses = [
      { label: 'Permanen', value: '2' },
      { label: 'Kontrak', value: '1' },
    ];
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
      console.log('Mencoba mengambil token');
      try {
        const decoded: any = jwtDecode(this.token);
        console.log('Decoded Token:', decoded); // Tambahkan log untuk melihat isi token

        // Ambil role dari decoded token
        const roles = decoded.role; // Ambil role langsung
        if (typeof roles === 'string') {
          // Jika roles adalah string, pisahkan berdasarkan koma
          this.userRoles = roles
            .replace(/[\[\]']+/g, '')
            .split(',')
            .map((role) => role.trim());
        } else if (Array.isArray(roles)) {
          // Jika roles adalah array, hapus tanda kurung siku
          this.userRoles = roles.map((role) =>
            role.replace(/[\[\]']+/g, '').trim()
          );
        }

        console.log('User  Roles:', this.userRoles); // Log userRoles
      } catch (error) {
        console.error('Error decoding roles from token:', error);
      }
    } else {
      console.warn('Token not found');
    }
  }

  getUsernameFromToken(): void {
    if (this.token) {
      try {
        const decoded: any = jwtDecode(this.token);
        this.userName = decoded.sub || 'Unknown';
        console.log('Decoded username:', this.userName);
      } catch (error) {
        console.error('Error decoding username from token:', error);
      }
    } else {
      console.warn('Token not found');
    }
  }

  getDivisionIdFromUserId(): void {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (response) => {
          if (response && response.content) {
            const divisionId = response.content.division_id;
            console.log('Division ID adalah:', divisionId); // Log divisionId
            this.divisionId = divisionId; // Simpan divisionId untuk digunakan di tempat lain
            this.getAllUsers();
          } else {
            console.warn('Response is missing content or division_id');
          }
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    } else {
      console.warn('User  ID not found in local storage');
    }
  }

  getAllUsers() {
    console.log('test');
    this.loading = true;
    console.log('User  Roles:', this.userRoles); // Log userRoles
    console.log('Division ID:', this.divisionId); // Log divisionId sebelum memanggil API

    if (this.userRoles.includes('HR')) {
      this.userService.getAllUsers().subscribe(
        (response) => {
          console.log('All Users Response:', response); // Log respons
          this.loading = false;
          this.users = response.content;
          console.log('Users:', this.users); // Log users
          this.mapUsersWithScore();
        },
        (error) => {
          console.error('Error fetching all users:', error);
          this.loading = false;
        }
      );
    } else if (
      this.userRoles.includes('SVP') ||
      this.userRoles.includes('MGR')
    ) {
      this.userService.getUsersByDivisionId(this.divisionId).subscribe(
        (response) => {
          console.log('Users by Division Response:', response); // Log respons
          this.loading = false;
          this.users = response.content;
          console.log('Users:', this.users); // Log users
          this.mapUsersWithScore();
        },
        (error) => {
          console.error('Error fetching users by division:', error);
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
      this.users = [];
      console.log('kosong');
    }
  }

  mapUsersWithScore() {
    this.usersWithScore = this.users.map((user) => {
      const score = this.scoreUsers.find((s) => s.userId === user.id);
      return {
        ...user,
        totalScore: score ? score.totalScore : 0,
      };
    });
    console.log('Users with Score:', this.usersWithScore); // Tambahkan log ini
  }

  getAllDivision() {
    this.userService.getAllDivision().subscribe({
      next: (response) => {
        this.divisi = response.content;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        this.divisionName = this.divisi.map((item) => item.DIVISION_NAME);
      },
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
    this.displayDetailDialog = true;
  }

  onUserCreated(newUser: any) {
    this.getAllUsers();
    this.displayCreateDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User  created successfully',
    });
  }

  confirmDelete(user: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You will delete user with username ${user.username}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'User  has been deleted.', 'success');
            this.getAllUsers();
          },
          error: (error) => {
            Swal.fire(
              'Error',
              'An error occurred while deleting the user.',
              'error'
            );
            console.error('Error deleting user:', error);
          },
        });
      }
    });
  }
}

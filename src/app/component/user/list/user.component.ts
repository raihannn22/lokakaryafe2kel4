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
import { ConfirmedComponent } from '../../confirmed/confirmed.component';

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
    ConfirmedComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  users: any[] = [];
  title: string = 'Management Users';
  usersWithScore: any[] = [];
  loading: boolean = true;
  displayCreateDialog = false;
  displayUpdateDialog = false;
  displayDetailDialog = false;
  displayConfirmedDialog = false;
  selectedUser: any;
  searchValue: string | undefined;
  token: string | null = '';
  userRoles: string = '';
  statuses!: any[];
  divisi!: any[];
  divisionName: string[] = [];
  selectedYear: number = new Date().getFullYear();
  scoreUsers: any[] = [];
  years: number[] = [
    2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
    2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046,
    2047, 2048, 2049, 2050,
  ];

  selectedDivisionId: string = '';
  UsersSummary: any[] = [];

  userName: string = '';

  divisionId: string = '';
  confirmed!: any[];

  first: number = 0;
  totalRecords: number = 0;

  pageSizeOptions: number[] = [5, 10, 20];
  selectedPageSize: number = 5;
  currentPage: number = 0;

  sortingDirection: string = 'asc';
  currentSortBy: string = 'username';

  sortOptions = [
    { label: 'Username', value: 'username' },
    { label: 'Full Name', value: 'fullname' },
    { label: 'Position', value: 'position' },
    { label: 'Email Address', value: 'email' },
    { label: 'Join Date', value: 'joinDate' },
  ];

  searchKeyword: string = '';

  // userId: string | undefined;

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
    return this.router.url === '/view-user'; // Memeriksa jika URL adalah /login
  }
  isSummaryApproveRoute(): boolean {
    return this.router.url === '/summary-approve'; // Memeriksa jika URL adalah /login
  }

  ngOnInit() {
    this.getAllUsers();
    this.token = localStorage.getItem('token');
    this.getRolesFromToken();
    this.getUsernameFromToken();
    this.getAllDivision();
    // this.getUserIdFromLocalStorage();
    this.getDivisionIdFromUserId();

    this.statuses = [
      { label: 'Permanen', value: '2' },
      { label: 'Kontrak', value: '1' },
    ];

    this.confirmed = [
      { label: 'Confirmed', value: '1' },
      { label: 'Unconfirmed', value: '0' },
    ];
    // console.log(this.getUsernameFromToken());
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

  getSeveritySummary(status: string) {
    switch (status) {
      case 'Confirmed':
        return 'success';

      case 'Unconfirmed':
        return 'danger';

      default:
        return 'info';
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

  getUsernameFromToken(): void {
    if (this.token) {
      try {
        const decoded: any = jwtDecode(this.token); // Decode JWT token
        this.userName = decoded.sub || 'Unknown'; // Ambil nilai dari field "sub"
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
            // Akses division_id dari objek content
            const divisionId = response.content.division_id;
            console.log('Division ID:', divisionId);
            this.divisionId = divisionId; // Simpan divisionId untuk digunakan di tempat lain
          } else {
            console.warn('Response is missing content or division_id');
          }
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    } else {
      console.warn('User ID not found in local storage');
    }
  }

  getAllUsers(
    sort: string = this.currentSortBy,
    direction: string = this.sortingDirection,
    searchKeyword: string = this.searchKeyword
  ) {
    forkJoin({
      user: this.userService.getAllUsers(
        this.currentPage,
        this.selectedPageSize,
        this.currentSortBy,
        this.sortingDirection,
        this.searchKeyword
      ),
      total: this.summaryService.getTotalScore(this.selectedYear),
      userSummary: this.summaryService.getUserAndSummary(this.selectedYear),
    }).subscribe(({ user, total, userSummary }) => {
      this.loading = false;
      this.scoreUsers = total;
      this.users = user.content;
      this.totalRecords = user.total_data;
      this.UsersSummary = userSummary.content;

      // Cek apakah data pengguna kosong
      if (this.users.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Data Found',
          text: 'No matching data found for your search criteria.',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            // Reset search keyword only
            this.searchKeyword = '';
            this.getAllUsers(
              this.currentSortBy,
              this.sortingDirection,
              this.searchKeyword
            );
          }
        });
      } else {
        // Filter users based on role
        if (this.userRoles.includes('HR')) {
          // HR can see all users
          this.usersWithScore = this.users.map((user) => {
            const score = this.scoreUsers.find((s) => s.userId === user.id);
            return {
              ...user,
              totalScore: score ? score.totalScore : 0,
            };
          });
        } else {
          // Other roles can only see users in their division
          this.usersWithScore = this.users
            .filter((user) => user.division_id === this.divisionId) // Filter by division
            .map((user) => {
              const score = this.scoreUsers.find((s) => s.userId === user.id);
              return {
                ...user,
                totalScore: score ? score.totalScore : 0,
              };
            });
        }

        console.log('Users with Score:', this.usersWithScore);

        if (this.router.url === '/summary-approve') {
          this.usersWithScore = this.UsersSummary;
        }
      }
    });
  }

  resetFilters() {
    this.searchKeyword = '';
    this.currentSortBy = 'username';
    this.sortingDirection = 'asc';
    this.currentPage = 0;
    this.selectedPageSize = 5;

    this.getAllUsers(
      this.currentSortBy,
      this.sortingDirection,
      this.searchKeyword
    );
  }

  loadPage(event: any) {
    this.currentPage = event.first / event.rows; // Menghitung halaman berdasarkan offset
    this.selectedPageSize = event.rows; // Ambil jumlah baris per halaman
    console.log('Page Size Change Triggered');
    console.log('Selected Page Size:', this.selectedPageSize);
    this.getAllUsers(this.currentSortBy, this.sortingDirection); // Muat ulang data dengan ukuran halaman baru
  }

  onSortChange(event: any) {
    this.currentSortBy = event.value; // Update current sort by
    console.log('Sorting by:', this.currentSortBy); // Log for debugging

    this.currentPage = 0; // Reset to the first page
    console.log('Sorting direction:', this.sortingDirection); // Log for debugging

    this.getAllUsers(this.currentSortBy, this.sortingDirection); // Call to load data with new sorting
  }

  toggleSortingDirection() {
    // Toggle between 'asc' and 'desc'
    this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';
    console.log('Sorting direction changed to:', this.sortingDirection); // Log the new direction
    // Reload achievements with the current sort criteria and new sorting direction
    this.getAllUsers(this.currentSortBy, this.sortingDirection);
  }
  // getAllUsers() {
  //   forkJoin({
  //     user: this.userService.getAllUsers(),
  //     total: this.summaryService.getTotalScore(this.selectedYear),
  //     userSummary: this.summaryService.getUserAndSummary(this.selectedYear),
  //   }).subscribe(({ user, total , userSummary }) => {
  //     this.loading = false;
  //     this.scoreUsers = total;
  //     this.users = user.content;

  //     this.UsersSummary = userSummary.content;

  //     this.usersWithScore = this.users.map((user) => {
  //       // Temukan skor berdasarkan ID pengguna
  //       const score = this.scoreUsers.find((s) => s.userId === user.id);
  //       return {
  //         ...user, // Data pengguna asli
  //         totalScore: score ? score.totalScore : 0, // Tambahkan totalScore
  //       };
  //     });
  //     console.log('Users with Score:', this.usersWithScore);

  //     if (this.router.url === '/summary-approve') {
  //       this.usersWithScore = this.UsersSummary
  //     }
  //   });

  // }

  getAllDivision() {
    this.userService.getAllDivision().subscribe({
      next: (response) => {
        this.divisi = response.content; // Data ada di 'content'
        // console.log('Total divisi:', this.divisi);
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

  openConfirmedDialog(user: any) {
    this.selectedUser = user;
    this.displayConfirmedDialog = true;
  }

  // Fungsi menangani event user yang dibuat
  onUserCreated(newUser: any) {
    // Logika untuk menyimpan user ke database (via API)
    this.getAllUsers();
    this.displayCreateDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
    // Tambahkan user baru ke daftar users atau update data sesuai kebutuhan
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
            Swal.fire('Deleted!', 'User Already Deleted.', 'success');
            this.getAllUsers(); // Panggil metode untuk memperbarui tabel
          },
          error: (error) => {
            Swal.fire(
              'Error',
              'Terjadi kesalahan saat menghapus pengguna.',
              'error'
            );
            console.error('Error deleting user:', error);
          },
        });
      }
    });
  }
}

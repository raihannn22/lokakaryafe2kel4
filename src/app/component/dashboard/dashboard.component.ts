import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../service/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  nama: string | null = '';
  currentUser: any; // Sesuaikan dengan interface User Anda
  totalUsers: number = 0;
  totalRoles: number = 0;
  activeProjects: number = 0;
  completedTasks: number = 0;
  token: string | null = '';
  userRoles: string = '';
  hasChangedPassword: boolean = false;
  userId: string = '';

  constructor(private userService: UserService, private router: Router) {}

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 15) return 'Good Afternoon';
    if (hour < 19) return 'Good Evening';
    return 'Good Night';
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-EN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.getRolesFromToken();
    this.nama = localStorage.getItem('full_name');
    this.getUserCount();
    this.userId = localStorage.getItem('id') || '';
    this.getPassword();
  }

  getPassword(){
    this.userService.getUserById(this.userId).subscribe((response) => {
      this.hasChangedPassword = response.content.has_change_password;
      console.log(this.hasChangedPassword);  
    })
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

  getUserCount(): void {
    this.userService.getAllUsers().subscribe((response) => {
      this.totalUsers = response.total_rows;
    },
    (error) => {
      console.error('Error fetching user count:', error);
    }
    );
  }

  onChangePassword() {
    this.router.navigate(['/profile']); 
  }



}

import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule],
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

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 19) return 'Selamat Sore';
    return 'Selamat Malam';
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('id-ID', {
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


}

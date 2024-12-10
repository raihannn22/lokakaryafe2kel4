import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

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
    this.nama = localStorage.getItem('full_name');
  }

  recentUsers = [
    { name: 'John Doe', role: 'Admin', status: 'active' },
    // ... more users
  ];

  recentActivities = [
    { description: 'Created new project', user: 'John Doe', time: '2 hours ago' },
    // ... more activities
  ];

}

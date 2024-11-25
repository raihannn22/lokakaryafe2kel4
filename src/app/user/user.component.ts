import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { UserService } from './service/user.service'; 
import { Router } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ButtonModule, CalendarModule, FormsModule, TableModule, CreateUserComponent, DialogModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true;
  displayCreateDialog = false;
  

  constructor(
    private userService: UserService,
    private router: Router
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

  // Fungsi menangani event user yang dibuat
  onUserCreated(newUser: any) {
    console.log('User baru:', newUser);
    // Logika untuk menyimpan user ke database (via API)
    this.displayCreateDialog = false;
    // Tambahkan user baru ke daftar users atau update data sesuai kebutuhan
  }
}
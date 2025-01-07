import { Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';

import Swal from 'sweetalert2';
import { UserService } from '../../service/user/user.service';
import { AuthService } from '../../service/login/auth.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    SplitterModule,
    CardModule,
    ButtonModule,
    PanelMenuModule,
    CommonModule,
    FormsModule,
    PasswordModule,
    TableModule,
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css',
})
export class ProfilComponent {
  constructor(
    private userService: UserService,
    private authservice: AuthService
  ) {}
  selectedContent: string = 'profileDetail';

  userDetails: any = {};
  userId: any = '';
  status: string = '';

  ngOnInit() {
    this.userId = localStorage.getItem('id');

    this.userService.getUserById(this.userId).subscribe(
      (userDetails: any) => {
        this.userDetails = userDetails.content;
      },
      (error: any) => {}
    );

    if ((this.userDetails.employee_status = '1')) {
      this.status = 'Kontrak';
    } else {
      this.status = 'Permanen';
    }
  }

  menuItems = [
    {
      label: 'Detail Profile',
      icon: 'pi pi-user',
      command: () => this.loadContent('profileDetail'),
    },
    {
      label: 'Change Password',
      icon: 'pi pi-key',
      command: () => this.loadContent('changePassword'),
    },
  ];

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  loadContent(content: string) {
    this.selectedContent = content;
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match!',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change your password?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authservice
          .changePassword(
            this.currentPassword,
            this.newPassword,
            this.confirmPassword
          )
          .subscribe(
            (response: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Password changed successfully!',
              });
            },
            (error: any) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to change password. Please try again.',
              });
            }
          );
      }
    });
  }
}

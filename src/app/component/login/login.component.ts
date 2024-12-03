import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule , } from '@angular/forms';
import { FloatLabelModule } from "primeng/floatlabel"
import { PasswordModule } from 'primeng/password';
// import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FloatLabelModule, CommonModule, FormsModule, PasswordModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService:AuthService , private router: Router) {}

  // Fungsi login
  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/user']);
      },
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Password atau Username salah!",
        });
      }
    });
  }

  
  // onLogin() {
  //   if (this.email && this.password) {
  //     this.authService.login(this.email, this.password).subscribe(
  //       (response) => {
  //         localStorage.setItem('token', response.content.token);
  //         console.log('Login successful:', response);
  //         this.router.navigate(['/user']);
  //         // Handle successful login, e.g., navigate to another page
  //       },
  //       (error) => {
  //         this.onLoginError();
  //         console.error('Login failed:', error);
  //         // Handle login failure
  //       }
  //     );
  //   }

  // }
  // onLoginError() {
  //   this.errorMessage = 'Login gagal. Periksa username dan password.';
  // }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/login/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  items: MenuItem[] | undefined;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  confirmDelete() {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to logout?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
    const nama: string | null = localStorage.getItem('full_name');
    this.items = [
      {
        label: 'Menu',
        styleClass: 'p-mr-2',
        icon: 'pi pi-bars',
        command: () => this.toggleSidebar.emit(),
      },
      {
        label: `${nama}`,
        icon: 'pi pi-user',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-id-card',
            command: () => this.router.navigate(['/profile']),
          },
          {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command: () => {
              this.confirmDelete();
            },
          },
        ],
      },
    ];
  }
}

import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './component/sidebar/sidebar.component';

import { NavbarComponent } from './component/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private router: Router) {}
  title = 'lokakaryafe2';

  sidebarVisible: boolean = false;

  onToggleSidebar(): void {
    this.sidebarVisible = true;
  }

  onSidebarHide() {
    this.sidebarVisible = false;
  }
  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }

  isProfileRoute(): boolean {
    return this.router.url === '/profile';
  }
}

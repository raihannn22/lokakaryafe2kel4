import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './component/sidebar/sidebar.component';
// import { LoginComponent } from './component/login/login.component';
import { NavbarComponent } from './component/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lokakaryafe2';

  sidebarVisible: boolean = false;

  onToggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;  // Toggle nilai sidebarVisible
  }

  
}

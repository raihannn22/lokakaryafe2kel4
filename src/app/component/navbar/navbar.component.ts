import { Component, EventEmitter, Output } from '@angular/core';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  items: MenuItem[] | undefined;
  @Output() toggleSidebar = new EventEmitter<void>();  // Event to toggle sidebar



  ngOnInit() {
      this.items = [
            {
                label: 'Menu',
                styleClass: 'p-mr-2',
                icon: 'pi pi-bars',
                command: () => this.toggleSidebar.emit()
                
            },
            {
                label: 'Logout',
                styleClass: 'p-mr-auto',
                icon: 'pi pi-fw pi-sign-out'
            }
        ];

      
  }
}

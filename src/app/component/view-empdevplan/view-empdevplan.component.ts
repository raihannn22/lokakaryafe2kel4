import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { UserService } from '../../service/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpDevplanService } from '../../service/emp-devplan/emp-devplan.service';
import { get } from 'http';
import { ButtonModule } from 'primeng/button';

interface users {
  id: string;
  name: string;
  email: string;
  role: string;
  division: string;
  department: string;
  section: string;
  app_role: any[];
}

@Component({
  selector: 'app-view-empdevplan',
  standalone: true,
  imports: [
    TableModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './view-empdevplan.component.html',
  styleUrl: './view-empdevplan.component.css',
})
export class ViewEmpdevplanComponent implements OnInit {
  constructor(
    private userService: UserService,
    private empDevplanService: EmpDevplanService
  ) {}

  users: any[] = [];
  selectedUser: any = {};

  years: number[] = [
    2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
    2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046,
    2047, 2048, 2049, 2050,
  ];
  selectedYear: number = 0;

  empdevplans: any[] = [];

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.content;
      },
      error: (error) => {},
    });
  }

  getEmpdevplan() {
    this.empDevplanService
      .getAllEmpDevPlan(this.selectedUser.id, this.selectedYear)
      .subscribe({
        next: (response) => {
          this.empdevplans = response.content;
        },
        error: (error) => {},
      });
  }

  submit() {
    this.getEmpdevplan();
  }
}

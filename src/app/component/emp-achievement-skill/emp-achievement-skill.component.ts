import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { trigger, transition, style, animate } from '@angular/animations';
import { GroupAchievementService } from '../../service/group-achievement/group-achievement.service';
import { DropdownModule } from 'primeng/dropdown';
import { AchievementService } from '../../service/achievement/achievement.service';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { FilterMetadata, MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { EmpAchievementSkillService } from '../../service/emp-achievement-skill/emp-achievement-skill.service';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-achievement',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    TableModule,
    DialogModule,
    CheckboxModule,
    DropdownModule,
    TagModule,
    InputIconModule,
    InputTextModule,
    InputNumberModule,
    IconFieldModule,
  ],
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './emp-achievement-skill.component.html',
  styleUrls: ['./emp-achievement-skill.component.css'],
})
export class EmpAchievementSkillComponent implements OnInit {
  achievements: any[] = [];
  groupAchievements: any[] = [];
  users: any[] = [];
  empAchievementSkills: any[] = [];
  filteredEmpAchievementSkills: any[] = [];
  loading: boolean = true;
  empAchievementSkillDialog: boolean = false;
  empAchievementSkill: any = {
    user_id: null,
    notes: '',
    achievement_id: null,
    score: '',
    assesment_year: '',
  };

  searchKeyword: string = '';
  filters: { [s: string]: FilterMetadata } = {};

  isEmpA: boolean = false;

  scoreWarning: boolean = false;

  first: number = 0;
  totalRecords: number = 0;

  constructor(
    private empAchievementSkillService: EmpAchievementSkillService,
    private achievementService: AchievementService,
    private groupAchievementService: GroupAchievementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllAchievements();
    this.getAllGroupAchievements();
    this.getAllEmpAchievementSkills();
    this.getAllUsers();
  }

  getAllEmpAchievementSkills() {
    this.loading = true;
    this.empAchievementSkillService.getAllEmpAchievementSkills().subscribe({
      next: (response) => {
        this.empAchievementSkills = response.content;
        this.totalRecords = response.totalRecords;
        this.filteredEmpAchievementSkills = this.empAchievementSkills;
        this.loading = false;
      },
      error: (error) => {
        // ;
        this.loading = false;
      },
    });
  }

  getAllAchievements() {
    this.loading = true;
    this.empAchievementSkillService.getAllAchievementsEnabled().subscribe({
      next: (response) => {
        this.achievements = response.content;
        this.loading = false;
      },
      error: (error) => {
        // ;
        this.loading = false;
      },
    });
  }

  getAllUsers() {
    this.loading = true;
    this.empAchievementSkillService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.content;
        this.loading = false;
      },
      error: (error) => {
        // ;
        this.loading = false;
      },
    });
  }

  loadPage(event: any) {
    this.first = event.first;
    this.getAllAchievements();
  }

  getAllGroupAchievements() {
    this.empAchievementSkillService.getAllGroupAchievements().subscribe({
      next: (response) => {
        this.groupAchievements = response.content;
        this.loading = false;
      },
      error: (error) => {
        // ;
        this.loading = false;
      },
    });
  }

  searchData() {
    if (this.searchKeyword.trim() === '') {
      this.filteredEmpAchievementSkills = this.empAchievementSkills;
    } else {
      this.filteredEmpAchievementSkills = this.empAchievementSkills.filter(
        (empAchievementSkill) => {
          return Object.keys(empAchievementSkill).some((key) => {
            const value = empAchievementSkill[key];
            if (typeof value === 'number') {
              return value.toString().includes(this.searchKeyword);
            } else if (typeof value === 'string') {
              return value
                .toLowerCase()
                .includes(this.searchKeyword.toLowerCase());
            }
            return false;
          });
        }
      );
    }
  }
  validateScore() {
    if (this.empAchievementSkill.score > 100) {
      this.scoreWarning = true;
      this.empAchievementSkill.score = 100;
    } else {
      this.scoreWarning = false;
    }
  }

  showAddDialog() {
    // ;
    this.empAchievementSkill = {
      achievement_id: null,
      user_id: null,
      notes: null,
      score: null,
      assessment_year: '',
    };
    this.empAchievementSkillDialog = true;
  }

  editEmpAchievementSkill(empAchievementSkill: any) {
    // ;
    this.empAchievementSkill = { ...empAchievementSkill };
    this.empAchievementSkillDialog = true;
  }

  saveEmpAchievementSkill() {
    if (this.empAchievementSkill.id) {
      this.empAchievementSkillService
        .updateEmpAchievementSkill(
          this.empAchievementSkill.id,
          this.empAchievementSkill
        )
        .subscribe({
          next: () => {
            this.getAllEmpAchievementSkills();
            this.empAchievementSkillDialog = false;
            this.resetEmpAchievementSkill();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully updated employee achievement skill!',
              timer: 1500,
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: 'Failed to update employee achievement skill!',
              timer: 1500,
            });
          },
        });
    } else {
      const currentYear = new Date().getFullYear();
      this.empAchievementSkill.assessment_year = currentYear;

      // ;
      this.empAchievementSkillService
        .saveEmpAchievementSkill(this.empAchievementSkill)
        .subscribe({
          next: () => {
            this.getAllEmpAchievementSkills();
            this.empAchievementSkillDialog = false;
            this.resetEmpAchievementSkill();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully added employee achievement skill!',
              timer: 1500,
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: 'Failed to add employee achievement skill!.',
              timer: 1500,
            });
          },
        });
    }
  }

  resetEmpAchievementSkill() {
    this.empAchievementSkill = {
      achievement_id: null,
      user_id: null,
      notes: null,
      score: null,
      assessment_year: '',
    };
  }

  calculateAchievementTotal(userName: string): number {
    return this.filteredEmpAchievementSkills.filter(
      (skill) => skill.full_name === userName
    ).length;
  }

  deleteEmpAchievementSkill(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Data will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.empAchievementSkillService
          .deleteEmpAchievementSkill(id)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Successfully deleted employee achievement skill!',
                showConfirmButton: false,
                timer: 1500,
              });
              this.getAllEmpAchievementSkills();
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete employee achievement skill!.',
                timer: 1500,
                confirmButtonText: 'Coba Lagi',
              });
            },
          });
      }
    });
  }
}

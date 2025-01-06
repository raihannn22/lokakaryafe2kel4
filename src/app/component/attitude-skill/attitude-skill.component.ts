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
import { FilterMetadata } from 'primeng/api';
import Swal from 'sweetalert2';
import { AttitudeSkillService } from '../../service/attitude-skill/attitude-skill.service';

@Component({
  selector: 'app-attitude-skill',
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
  templateUrl: './attitude-skill.component.html',
  styleUrls: ['./attitude-skill.component.css'],
})
export class AttitudeSkillComponent implements OnInit {
  attitudeSkills: any[] = [];
  groupAttitudeSkills: any[] = [];
  filteredAttitudeSkill: any[] = [];
  loading: boolean = true;
  attitudeSkillDialog: boolean = false;
  attitudeSkill: any = { attitude_skill: '', group_id: null, enabled: false };

  searchKeyword: string = '';
  filters: { [s: string]: FilterMetadata } = {};

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 },
  ];

  isAttitudeSKillDuplicate: boolean = false;

  first: number = 0;
  totalRecords: number = 0;

  pageSizeOptions: number[] = [5, 10, 20];
  selectedPageSize: number = 5;
  currentPage: number = 0;

  sortingDirection: string = 'asc';
  currentSortBy: string = 'groupAttitudeSkill.id';

  sortOptions = [
    { label: 'Group Name', value: 'groupAttitudeSkill.id' },
    { label: 'Attitude Skill', value: 'attitudeSkill' },
  ];

  constructor(
    private attitudeSkillService: AttitudeSkillService,
    private groupAchievementService: GroupAchievementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllAttitudeSkills();
    this.getAllGroupAttitudeSkills();
  }

  getAllAttitudeSkills(
    sort: string = this.currentSortBy,
    direction: string = this.sortingDirection,
    searchKeyword: string = this.searchKeyword
  ) {
    this.loading = true;
    console.log(
      'Loading achievement skill with sorting:',
      sort,
      'and direction:',
      direction
    );
    this.attitudeSkillService
      .getAllAttitudeSkills(
        this.currentPage,
        this.selectedPageSize,
        sort,
        direction,
        searchKeyword
      )
      .subscribe({
        next: (response) => {
          this.attitudeSkills = response.content;
          this.totalRecords = response.total_data;
          this.filteredAttitudeSkill = this.attitudeSkills;
          this.loading = false;

          if (this.filteredAttitudeSkill.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No Data Found',
              text: 'No matching data found for your search criteria.',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                // Reset search keyword only
                this.searchKeyword = '';
                this.getAllAttitudeSkills(
                  this.currentSortBy,
                  this.sortingDirection,
                  this.searchKeyword
                );
              }
            });
          }
        },
        error: (error) => {
          // console.error('Error fetching attitudeSkills:', error);
          this.loading = false;
        },
      });
  }

  resetFilters() {
    this.searchKeyword = '';
    this.currentSortBy = 'groupAttitudeSkill.id';
    this.sortingDirection = 'asc';
    this.currentPage = 0;
    this.selectedPageSize = 5;

    this.getAllAttitudeSkills(
      this.currentSortBy,
      this.sortingDirection,
      this.searchKeyword
    );
  }

  loadPage(event: any) {
    this.currentPage = event.first / event.rows; // Menghitung halaman berdasarkan offset
    this.selectedPageSize = event.rows; // Ambil jumlah baris per halaman
    console.log('Page Size Change Triggered');
    console.log('Selected Page Size:', this.selectedPageSize);
    this.getAllAttitudeSkills(this.currentSortBy, this.sortingDirection);
  }

  onSortChange(event: any) {
    this.currentSortBy = event.value; // Update current sort by
    console.log('Sorting by:', this.currentSortBy); // Log for debugging

    this.currentPage = 0; // Reset to the first page
    console.log('Sorting direction:', this.sortingDirection); // Log for debugging

    this.getAllAttitudeSkills(this.currentSortBy, this.sortingDirection); // Call to load data with new sorting
  }

  toggleSortingDirection() {
    // Toggle between 'asc' and 'desc'
    this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';
    console.log('Sorting direction changed to:', this.sortingDirection); // Log the new direction
    // Reload achievements with the current sort criteria and new sorting direction
    this.getAllAttitudeSkills(this.currentSortBy, this.sortingDirection);
  }

  getAllGroupAttitudeSkills() {
    this.attitudeSkillService.getAllAttitudeSkillsEnabled().subscribe({
      next: (response) => {
        this.groupAttitudeSkills = response.content;
        this.loading = false;
      },
      error: (error) => {
        // console.error('Error fetching group attitudeSkills:', error);
        this.loading = false;
      },
    });
  }

  searchData() {
    if (this.searchKeyword.trim() === '') {
      this.filteredAttitudeSkill = this.attitudeSkills;
    } else {
      this.filteredAttitudeSkill = this.attitudeSkills.filter(
        (attitudeSkill) => {
          return Object.keys(attitudeSkill).some((key) => {
            const value = attitudeSkill[key];
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

  showAddDialog() {
    // console.log('Menampilkan dialog tambah');
    this.resetAttitudeSkill();
    this.attitudeSkillDialog = true;
  }

  editAttitudeSkill(attitudeSkill: any) {
    console.log('Mengedit attitudeSkill', this.groupAttitudeSkills);
    this.attitudeSkill = { ...attitudeSkill };
    this.attitudeSkillDialog = true;
  }

  validateAttitudeSkill() {
    if (!this.attitudeSkill.id) {
      const existingAttitudeSkill = this.attitudeSkills.find(
        (attskl) =>
          attskl.attitude_skill.toLowerCase() ===
          this.attitudeSkill.attitude_skill.toLowerCase()
      );
      if (existingAttitudeSkill) {
        this.isAttitudeSKillDuplicate = true;
        return false;
      }
    } else {
      const existingAttitudeSkill = this.attitudeSkills.find(
        (attskl) =>
          attskl.attitude_skill.toLowerCase() ===
            this.attitudeSkill.attitude_skill.toLowerCase() &&
          attskl.id !== this.attitudeSkill.id
      );
      if (existingAttitudeSkill) {
        this.isAttitudeSKillDuplicate = true;
        return false;
      }
    }

    this.isAttitudeSKillDuplicate = false;

    return true;
  }

  saveAttitudeSkill() {
    if (!this.validateAttitudeSkill()) {
      return;
    }

    if (this.attitudeSkill.id) {
      this.attitudeSkillService
        .updateAttitudeSkill(this.attitudeSkill.id, this.attitudeSkill)
        .subscribe({
          next: () => {
            this.getAllAttitudeSkills();
            this.attitudeSkillDialog = false;
            this.resetAttitudeSkill();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully updated Attitude Skill!',
              timer: 1500,
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to update Attitude Skill!',
              timer: 1500,
            });
          },
        });
    } else {
      this.attitudeSkillService
        .saveAttitudeSkill(this.attitudeSkill)
        .subscribe({
          next: () => {
            this.getAllAttitudeSkills();
            this.attitudeSkillDialog = false;
            this.resetAttitudeSkill();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully added Attitude Skill!',
              timer: 1500,
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to add Attitude Skill!.',
              timer: 1500,
            });
          },
        });
    }
  }

  resetAttitudeSkill() {
    this.attitudeSkill = { attitude_skill: '', group_id: null, enabled: 1 };
    this.isAttitudeSKillDuplicate = false;
  }

  deleteAttitudeSkill(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Data will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.attitudeSkillService.deleteAttitudeSkill(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Successfullt deleted Attitude Skill!',
              showConfirmButton: false,
              timer: 1500,
            });
            this.getAllAttitudeSkills();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete Attitude Skill!.',
              timer: 1500,
              confirmButtonText: 'Try Again',
            });
          },
        });
      }
    });
  }
}

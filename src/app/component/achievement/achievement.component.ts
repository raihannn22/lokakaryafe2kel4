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
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css'],
})
export class AchievementComponent implements OnInit {
  achievements: any[] = [];
  groupAchievements: any[] = [];
  filteredAchievements: any[] = [];
  loading: boolean = true;
  achievementDialog: boolean = false;
  achievement: any = { achievement: '', group_id: null, enabled: false };

  searchKeyword: string = '';
  filters: { [s: string]: FilterMetadata } = {};

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 },
  ];

  isAchievementDuplicate: boolean = false;

  first: number = 0;
  totalRecords: number = 0;

  pageSizeOptions: number[] = [5, 10, 20];
  selectedPageSize: number = 5;
  currentPage: number = 0;

  sortingDirection: string = 'asc';
  currentSortBy: string = 'groupAchievement.id';

  sortOptions = [
    { label: 'Group Name', value: 'groupAchievement.id' },
    { label: 'Achievement', value: 'achievement' },
  ];

  constructor(private achievementService: AchievementService) {}

  ngOnInit() {
    this.getAllAchievements();
    this.getAllGroupAchievements();
  }

  getAllAchievements(
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
    this.achievementService
      .getAllAchievements(
        this.currentPage,
        this.selectedPageSize,
        sort,
        direction,
        searchKeyword
      )
      .subscribe({
        next: (response) => {
          this.achievements = response.content;
          this.totalRecords = response.total_data;
          this.filteredAchievements = this.achievements;
          this.loading = false;

          if (this.filteredAchievements.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No Data Found',
              text: 'No matching data found for your search criteria.',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                // Reset search keyword only
                this.searchKeyword = '';
                this.getAllAchievements(
                  this.currentSortBy,
                  this.sortingDirection,
                  this.searchKeyword
                );
              }
            });
          }
        },
        error: (error) => {
          // console.error('Error fetching achievements:', error);
          this.loading = false;
        },
      });
  }

  resetFilters() {
    this.searchKeyword = '';
    this.currentSortBy = 'groupAchievement.id';
    this.sortingDirection = 'asc';
    this.currentPage = 0;
    this.selectedPageSize = 5;

    this.getAllAchievements(
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
    this.getAllAchievements(this.currentSortBy, this.sortingDirection);
  }

  onSortChange(event: any) {
    this.currentSortBy = event.value; // Update current sort by
    console.log('Sorting by:', this.currentSortBy); // Log for debugging

    this.currentPage = 0; // Reset to the first page
    console.log('Sorting direction:', this.sortingDirection); // Log for debugging

    this.getAllAchievements(this.currentSortBy, this.sortingDirection); // Call to load data with new sorting
  }

  toggleSortingDirection() {
    // Toggle between 'asc' and 'desc'
    this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';
    console.log('Sorting direction changed to:', this.sortingDirection); // Log the new direction
    // Reload achievements with the current sort criteria and new sorting direction
    this.getAllAchievements(this.currentSortBy, this.sortingDirection);
  }

  getAllGroupAchievements() {
    this.achievementService.getAllGroupAchievementsEnabled().subscribe({
      next: (response) => {
        this.groupAchievements = response.content;
        this.loading = false;
      },
      error: (error) => {
        // console.error('Error fetching group achievements:', error);
        this.loading = false;
      },
    });
  }

  searchData() {
    if (this.searchKeyword.trim() === '') {
      this.filteredAchievements = this.achievements;
    } else {
      this.filteredAchievements = this.achievements.filter((achievement) => {
        return Object.keys(achievement).some((key) => {
          const value = achievement[key];
          if (typeof value === 'number') {
            return value.toString().includes(this.searchKeyword);
          } else if (typeof value === 'string') {
            return value
              .toLowerCase()
              .includes(this.searchKeyword.toLowerCase());
          }
          return false;
        });
      });
    }
  }

  showAddDialog() {
    // console.log('Menampilkan dialog tambah');
    this.resetAchievement();
    this.achievementDialog = true;
    this.isAchievementDuplicate = false;
  }

  editAchievement(achievement: any) {
    // console.log('Mengedit achievement', achievement);
    this.achievement = { ...achievement };
    this.achievementDialog = true;
  }

  validateAchievement(): boolean {
    // Trim input untuk menghindari spasi berlebih
    const trimmedAchievement = this.achievement.achievement
      .trim()
      .toLowerCase();

    // Jika sedang update dan nilai tidak berubah, anggap valid
    const originalAchievement = this.achievements.find(
      (achiev) => achiev.id === this.achievement.id
    );
    if (
      originalAchievement &&
      originalAchievement.achievement.toLowerCase() === trimmedAchievement
    ) {
      this.isAchievementDuplicate = false; // Tidak ada duplikasi
      return true; // Data valid karena tidak berubah
    }

    // Cek duplikasi dengan pencapaian lain (kecuali data yang sedang diperbarui)
    const duplicateAchievement = this.achievements.find(
      (achiev) =>
        achiev.achievement.toLowerCase() === trimmedAchievement &&
        achiev.id !== this.achievement.id
    );

    if (duplicateAchievement) {
      this.isAchievementDuplicate = true; // Duplikasi ditemukan
      return false; // Tidak valid
    }

    // Reset flag jika tidak ada duplikasi
    this.isAchievementDuplicate = false;
    return true; // Data valid
  }

  saveAchievement() {
    if (!this.validateAchievement()) {
      return;
    }

    if (this.achievement.id) {
      this.achievementService
        .updateAchievement(this.achievement.id, this.achievement)
        .subscribe({
          next: () => {
            this.getAllAchievements();
            this.achievementDialog = false;
            this.resetAchievement();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully updated Achievement!',
              timer: 1500,
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to update Achievement!',
              timer: 1500,
            });
          },
        });
    } else {
      this.achievementService.saveAchievement(this.achievement).subscribe({
        next: () => {
          this.getAllAchievements();
          this.achievementDialog = false;
          this.resetAchievement();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Successfully added Achievement!',
            timer: 1500,
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Failed to add Achievement!.',
            timer: 1500,
          });
        },
      });
    }
  }

  resetAchievement() {
    this.achievement = { achievement: '', group_id: null, enabled: 1 };
    this.isAchievementDuplicate = false;
  }

  deleteAchievement(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Data will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.achievementService.deleteAchievement(id).subscribe({
          next: () => {
            this.getAllAchievements();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully deleted Achievement!',
              timer: 1500,
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to delete Achievement!',
              timer: 1500,
            });
          },
        });
      }
    });
  }
}

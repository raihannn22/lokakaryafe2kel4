import { Component, OnInit } from '@angular/core';
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
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import Swal from 'sweetalert2';
import { GroupAttitudeSkillService } from '../../service/group-attitude-skill/group-attitude-skill.service';
import { forkJoin } from 'rxjs';
import { MessageModule } from 'primeng/message';
import { FilterMetadata, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-group-achievement',
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
    MessageModule,
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
  templateUrl: './group-achievement.component.html',
  styleUrls: ['./group-achievement.component.css'],
})
export class GroupAchievementComponent implements OnInit {
  groupAchievements: any[] = [];
  filteredGroupAchievements: any[] = [];
  loading: boolean = true;
  groupAchievementDialog: boolean = false;
  groupAchievement: any = { group_name: '', percentage: null, enabled: false };

  searchKeyword: string = '';
  filters: { [s: string]: FilterMetadata } = {};

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 },
  ];

  isGroupNameDuplicate: boolean = false;
  percentageWarning: boolean = false;

  first: number = 0;
  totalRecords: number = 0;
  percent: number = 100;
  atitudeSkills: any[] = [];
  percentageAchieved: any[] = [];
  percentageAttitude: any[] = [];
  totalPercentageAttitude: number = 0;
  totalPercentageAchieved: number = 0;
  totalPercentage: number = 0;
  userPercentage: number = 0;
  groupAchievementEnabled: any[] = [];
  enabled: number = 0;

  pageSizeOptions: number[] = [5, 10, 20];
  selectedPageSize: number = 5;
  currentPage: number = 0;

  sortingDirection: string = 'asc';
  currentSortBy: string = 'groupName';

  sortOptions = [
    { label: 'Group Name', value: 'groupName' },
    { label: 'Percentage', value: 'percentage' },
  ];

  constructor(
    private groupAchievementService: GroupAchievementService,
    private atitudeSkillService: GroupAttitudeSkillService
  ) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    forkJoin({
      groupAchievement: this.groupAchievementService.getAllGroupAchievements(
        this.currentPage,
        this.selectedPageSize,
        this.currentSortBy,
        this.sortingDirection,
        this.searchKeyword
      ),
      attitudeSkill:
        this.atitudeSkillService.getGroupAttitudeSkillsWithDetails(),
      gAchievementEnabled:
        this.groupAchievementService.getAllGroupAchievementsEnabled(),
    }).subscribe({
      next: ({ groupAchievement, attitudeSkill, gAchievementEnabled }) => {
        // Assign data for group achievements
        this.groupAchievements = groupAchievement.content;
        this.totalRecords = groupAchievement.total_data; // Ensure this matches the response from the backend
        this.filteredGroupAchievements = this.groupAchievements;

        // Assign data for group achievement enabled
        this.groupAchievementEnabled = gAchievementEnabled.content;
        this.percentageAchieved = this.groupAchievementEnabled.map(
          (item) => item.percentage
        );
        this.totalPercentageAchieved = this.percentageAchieved.reduce(
          (acc, item) => acc + item,
          0
        );

        // Assign data for attitude skills
        this.atitudeSkills = attitudeSkill.content;
        this.percentageAttitude = this.atitudeSkills.map(
          (item) => item.percentage
        );
        this.totalPercentageAttitude = this.percentageAttitude.reduce(
          (acc, item) => acc + item,
          0
        );

        this.sumPercentage();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading data:', error);
      },
    });
  }

  getAllGroupAchievements(
    sort: string = this.currentSortBy,
    direction: string = this.sortingDirection,
    searchKeyword: string = this.searchKeyword
  ) {
    this.loading = true;
    console.log(
      'Loading group achievements with sorting:',
      sort,
      'and direction:',
      direction
    );

    this.groupAchievementService
      .getAllGroupAchievements(
        this.currentPage,
        this.selectedPageSize,
        sort,
        direction,
        searchKeyword
      )
      .subscribe({
        next: (response) => {
          this.groupAchievements = response.content;
          this.totalRecords = response.total_data; // Ensure this matches the response from the backend
          this.filteredGroupAchievements = this.groupAchievements;
          this.loading = false;

          console.log('Data Group Achievements:', this.groupAchievements);
          console.log('Total Records:', this.totalRecords);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error fetching group achievements:', error);
        },
      });
  }

  sumPercentage() {
    this.totalPercentage =
      this.totalPercentageAttitude + this.totalPercentageAchieved;
    // console.log('ttal', this.totalPercentage);
  }

  // loadPage(event: any) {
  //   this.first = event.first;
  //   this.getAllGroupAchievements();
  // }

  loadPage(event: any) {
    this.currentPage = event.first / event.rows; // Menghitung halaman berdasarkan offset
    this.selectedPageSize = event.rows; // Ambil jumlah baris per halaman
    console.log('Page Size Change Triggered');
    console.log('Selected Page Size:', this.selectedPageSize);
    this.getAllGroupAchievements(this.currentSortBy, this.sortingDirection); // Muat ulang data dengan ukuran halaman baru
  }

  onSortChange(event: any) {
    this.currentSortBy = event.value; // Update current sort by
    console.log('Sorting by:', this.currentSortBy); // Log for debugging

    this.currentPage = 0; // Reset to the first page
    console.log('Sorting direction:', this.sortingDirection); // Log for debugging

    this.getAllGroupAchievements(this.currentSortBy, this.sortingDirection); // Call to load data with new sorting
  }

  toggleSortingDirection() {
    // Toggle between 'asc' and 'desc'
    this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';
    console.log('Sorting direction changed to:', this.sortingDirection); // Log the new direction
    // Reload achievements with the current sort criteria and new sorting direction
    this.getAllGroupAchievements(this.currentSortBy, this.sortingDirection);
  }

  validatePercentage() {
    if (this.groupAchievement.percentage > 100) {
      this.percentageWarning = true;
      this.groupAchievement.percentage = 100;
    } else {
      this.percentageWarning = false;
    }
  }

  validateMaxValue(event: any): void {
    const maxValue = this.totalPercentage;
    // console.log(maxValue);
    const inputValue = Number(event.target.value);

    if (inputValue > maxValue) {
      window.alert(
        `Nilai tidak boleh lebih dari ${maxValue}. Mohon dapat disesuaikan.`
      );
    }
  }

  showAddDialog() {
    // console.log('Menampilkan dialog tambah');
    this.resetGroupAchievement();
    this.enabled = 0;
    this.groupAchievementDialog = true;
    this.isGroupNameDuplicate = false;
  }

  editGroupAchievement(groupAchievement: any) {
    // console.log('Mengedit group achievement', groupAchievement);
    this.groupAchievement = { ...groupAchievement };
    this.userPercentage = this.groupAchievement.percentage;
    this.enabled = this.groupAchievement.enabled;
    // console.log(this.userPercentage, 'ini user percentagenya');
    // console.log(this.totalPercentage, 'total persentase');
    this.groupAchievementDialog = true;
    this.isGroupNameDuplicate = false;
  }

  validateGroupAchievement() {
    if (!this.groupAchievement.id) {
      const existingGroup = this.groupAchievements.find(
        (group) =>
          group.group_name.toLowerCase() ===
          this.groupAchievement.group_name.toLowerCase()
      );
      if (existingGroup) {
        this.isGroupNameDuplicate = true;
        return false;
      }
    } else {
      const existingGroup = this.groupAchievements.find(
        (group) =>
          group.group_name.toLowerCase() ===
            this.groupAchievement.group_name.toLowerCase() &&
          group.id !== this.groupAchievement.id
      );
      if (existingGroup) {
        this.isGroupNameDuplicate = true;
        return false;
      }
    }

    this.isGroupNameDuplicate = false;

    return true;
  }

  saveGroupAchievement() {
    console.log(this.groupAchievement.enabled);
    if (!this.validateGroupAchievement()) {
      return;
    }
    if (this.groupAchievement.id && this.enabled != 0) {
      console.log('atas');
      const maxValue = 100 - this.totalPercentage + this.userPercentage;
      if (this.groupAchievement.percentage > maxValue) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to save!',
          text: `The Percentage value cannot be more than ${maxValue}.`,
          confirmButtonText: 'Back',
          customClass: {
            popup: 'custom-swal-popup',
          },
        });
        return;
      }
    } else {
      console.log('bawah');
      const maxValue = 100 - this.totalPercentage;
      if (this.groupAchievement.percentage > maxValue) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to save!',
          text: `The Percentage value cannot be more than ${maxValue}.`,
          confirmButtonText: 'Back',
          customClass: {
            popup: 'custom-swal-popup',
          },
        });
        return;
      }
    }

    // console.log('Data yang dikirim:', this.groupAchievement);
    if (this.groupAchievement.id) {
      this.groupAchievementService
        .updateGroupAchievement(this.groupAchievement.id, this.groupAchievement)
        .subscribe({
          next: () => {
            this.getAllGroupAchievements();
            this.groupAchievementDialog = false;
            this.resetGroupAchievement();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully updated group achievement!',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to update group achievement!',
            });
          },
        });
    } else {
      this.groupAchievementService
        .saveGroupAchievement(this.groupAchievement)
        .subscribe({
          next: () => {
            this.getAllGroupAchievements();
            this.groupAchievementDialog = false;
            this.resetGroupAchievement();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully added group achievement!',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to add group achievement!.',
            });
          },
        });
    }
  }

  resetGroupAchievement() {
    this.groupAchievement = { group_name: '', percentage: null, enabled: 1 };
    this.isGroupNameDuplicate = false;
    this.percentageWarning = false;
  }

  deleteGroupAchievement(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Data will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.groupAchievementService.deleteGroupAchievement(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Successfully deleted group achievement!',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to delete group achievement!.',
              timer: 1500,
              confirmButtonText: 'Try again',
            });
          },
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { trigger, transition, style, animate } from '@angular/animations';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { FilterMetadata } from 'primeng/api';
import Swal from 'sweetalert2';
import { GroupAttitudeSkillService } from '../../service/group-attitude-skill/group-attitude-skill.service';
import { forkJoin } from 'rxjs';
import { GroupAchievementService } from '../../service/group-achievement/group-achievement.service';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-group-attitude-skill',
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
  templateUrl: './group-attitude-skill.component.html',
  styleUrls: ['./group-attitude-skill.component.css'],
})
export class GroupAttitudeSkillComponent implements OnInit {
  groupAttitudeSkills: any[] = [];
  filteredGroupAttitudeSkills: any[] = [];
  loading: boolean = true;
  groupAttitudeSkillDialog: boolean = false;
  groupAttitudeSkill: any = {
    group_name: '',
    percentage: null,
    enabled: false,
  };
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

  groupAchievements: any[] = [];
  percentageAchieved: any[] = [];
  percentageAttitude: any[] = [];
  totalPercentageAttitude: number = 0;
  totalPercentageAchieved: number = 0;
  totalPercentage: number = 0;
  userPercentage: number = 0;
  enabled: number = 0;
  groupAttitudeEnabled: any[] = [];

  pageSizeOptions: number[] = [5, 10, 20];
  selectedPageSize: number = 5;
  currentPage: number = 0;

  sortingDirection: string = 'asc';
  currentSortBy: string = 'groupName';

  sortOptions = [
    { label: 'Group Name', value: 'groupName' },
    { label: 'Percentage', value: 'percentage' },
  ];
  atitudeSkills: any;
  groupAchievementEnabled: any;

  constructor(
    private groupAttitudeSkillService: GroupAttitudeSkillService,
    private groupAchievementService: GroupAchievementService
  ) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loading = true; // Set loading to true while fetching data

    forkJoin({

      attitudeSkill: this.groupAttitudeSkillService.getAllGroupAttitudeSkills(
        this.currentPage,
        this.selectedPageSize,
        this.currentSortBy,
        this.sortingDirection,
        this.searchKeyword
      ),
      gattitudeSkill:
        this.groupAttitudeSkillService.getGroupAttitudeSkillsEnabled(),
      gAchievementEnabled:
        this.groupAchievementService.getAllGroupAchievementsEnabled(),
    }).subscribe({
      next: ({ attitudeSkill, gattitudeSkill, gAchievementEnabled }) => {
      
        // Anda bisa menyimpan totalRecords untuk group achievements jika diperlukan
        // this.totalRecordsGroupAchievement = groupAchievement.totalRecords;

        // Assign data for attitude skills
        this.groupAttitudeSkills = attitudeSkill.content;
        this.totalRecords = attitudeSkill.total_data; // Update total records for attitude skills
        this.filteredGroupAttitudeSkills = this.groupAttitudeSkills;

        console.log(
          'Total Records for Group Attitude Skills:',
          this.totalRecords
        );

        // Jika total data untuk group attitude skills adalah 0, Anda mungkin ingin menangani ini
        if (this.totalRecords === 0) {
          console.warn('No records found for group attitude skills.');
        }

        this.totalPercentageAchieved = gAchievementEnabled.content.percentage;
       
        this.totalPercentageAchieved = this.percentageAchieved.reduce(
          (acc, item) => acc + item,
          0
        );

        // Assign data for attitude skills
        this.groupAchievementEnabled = gAchievementEnabled.content;
        this.percentageAchieved = this.groupAchievementEnabled.map(
          (item: { percentage: any; }) => item.percentage
        );
        this.totalPercentageAchieved = this.percentageAchieved.reduce(
          (acc, item) => acc + item,
          0
        );

        // Assign data for attitude skills
        this.atitudeSkills = gattitudeSkill.content;
        this.percentageAttitude = this.atitudeSkills.map(
          (item: { percentage: any; }) => item.percentage
        );
        this.totalPercentageAttitude = this.percentageAttitude.reduce(
          (acc, item) => acc + item,
          0
        );

        this.sumPercentage();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false; // Set loading to false on error
        console.error('Error loading data:', error);
      },
    });
  }

  getAllGroupAttitudeSkills(
    sort: string = this.currentSortBy,
    direction: string = this.sortingDirection,
    searchKeyword: string = this.searchKeyword
  ) {
    this.loading = true;
    this.groupAttitudeSkillService
      .getAllGroupAttitudeSkills(
        this.currentPage,
        this.selectedPageSize,
        sort,
        direction,
        searchKeyword
      )
      .subscribe({
        next: (response) => {
          // console.log('API Response for Group Attitude Skills:', response); // Log respons API

          this.groupAttitudeSkills = response.content;
          this.totalRecords = response.total_data; // Ensure this matches the response from the backend
          this.filteredGroupAttitudeSkills = this.groupAttitudeSkills;
          this.loading = false;
          if (this.filteredGroupAttitudeSkills.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No Data Found',
              text: 'No matching data found for your search criteria.',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                // Reset search keyword only
                this.searchKeyword = '';
                this.getAllGroupAttitudeSkills(
                  this.currentSortBy,
                  this.sortingDirection,
                  this.searchKeyword
                );
              }
            });
          }

          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          console.error('Error fetching AttitudeSkills:', error);
        },
      });
  }

  resetFilters() {
    this.searchKeyword = '';
    this.currentSortBy = 'groupName';
    this.sortingDirection = 'asc';
    this.currentPage = 0;
    this.selectedPageSize = 5;

    this.getAllGroupAttitudeSkills(
      this.currentSortBy,
      this.sortingDirection,
      this.searchKeyword
    );
  }

  sumPercentage() {
    this.totalPercentage =
      this.totalPercentageAttitude + this.totalPercentageAchieved;
  }

  loadPage(event: any) {
    this.currentPage = event.first / event.rows; // Menghitung halaman berdasarkan offset
    this.selectedPageSize = event.rows; // Ambil jumlah baris per halaman
    console.log('Page Size Change Triggered');
    console.log('Selected Page Size:', this.selectedPageSize);
    this.getAllGroupAttitudeSkills(this.currentSortBy, this.sortingDirection); // Muat ulang data dengan ukuran halaman baru
  }

  onSortChange(event: any) {
    this.currentSortBy = event.value; // Update current sort by
    console.log('Sorting by:', this.currentSortBy); // Log for debugging

    this.currentPage = 0; // Reset to the first page
    console.log('Sorting direction:', this.sortingDirection); // Log for debugging

    this.getAllGroupAttitudeSkills(this.currentSortBy, this.sortingDirection); // Call to load data with new sorting
  }

  toggleSortingDirection() {
    // Toggle between 'asc' and 'desc'
    this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';
    console.log('Sorting direction changed to:', this.sortingDirection); // Log the new direction
    // Reload achievements with the current sort criteria and new sorting direction
    this.getAllGroupAttitudeSkills(this.currentSortBy, this.sortingDirection);
  }

  validatePercentage() {
    if (this.groupAttitudeSkill.percentage > 100) {
      this.percentageWarning = true;
      this.groupAttitudeSkill.percentage = 100;
    } else {
      this.percentageWarning = false;
    }
  }
  showAddDialog() {
    // console.log('Menampilkan dialog tambah');
    this.groupAttitudeSkill = { group_name: '', percentage: null, enabled: 1 };
    this.groupAttitudeSkillDialog = true;
    this.isGroupNameDuplicate = false;
    this.enabled = 0;
  }

  editGroupAttitudeSkill(groupAttitudeSkill: any) {
    // console.log('Mengedit group AttitudeSkill', groupAttitudeSkill);
    this.groupAttitudeSkill = { ...groupAttitudeSkill };
    this.userPercentage = this.groupAttitudeSkill.percentage;
    this.enabled = this.groupAttitudeSkill.enabled;
    this.groupAttitudeSkillDialog = true;
    this.isGroupNameDuplicate = false;
  }

  validateGroupAttitudeSkill() {
    if (!this.groupAttitudeSkill.id) {
      const existingGroup = this.groupAttitudeSkills.find(
        (group) =>
          group.group_name.toLowerCase() ===
          this.groupAttitudeSkill.group_name.toLowerCase()
      );
      if (existingGroup) {
        this.isGroupNameDuplicate = true;
        return false;
      }
    } else {
      const existingGroup = this.groupAttitudeSkills.find(
        (group) =>
          group.group_name.toLowerCase() ===
            this.groupAttitudeSkill.group_name.toLowerCase() &&
          group.id !== this.groupAttitudeSkill.id
      );
      if (existingGroup) {
        this.isGroupNameDuplicate = true;
        return false;
      }
    }

    this.isGroupNameDuplicate = false;
    if (this.groupAttitudeSkill.percentage > 100) {
      this.percentageWarning = true;
      this.groupAttitudeSkill.percentage = 100;
      return false;
    } else {
      this.percentageWarning = false;
    }

    return true;
  }

  saveGroupAttitudeSkill() {
    if (this.groupAttitudeSkill.id && this.enabled != 0) {
      const maxValue = 100 - this.totalPercentage + this.userPercentage;
      if (this.groupAttitudeSkill.percentage > maxValue) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to save',
          text: `The percentage cannot be greater than ${maxValue}.`,
          confirmButtonText: 'Back',
          customClass: {
            popup: 'custom-swal-popup',
          },
        });
        return;
      }
    } else {
      const maxValue = 100 - this.totalPercentage;
      if (this.groupAttitudeSkill.percentage > maxValue) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to save',
          text: `The percentage cannot be greater than ${maxValue}.`,
          confirmButtonText: 'Back',
          customClass: {
            popup: 'custom-swal-popup',
          },
        });
        return;
      }
    }
    if (!this.validateGroupAttitudeSkill()) {
      return;
    }
    if (this.groupAttitudeSkill.id) {
      this.groupAttitudeSkillService
        .updateGroupAttitudeSkill(
          this.groupAttitudeSkill.id,
          this.groupAttitudeSkill
        )
        .subscribe({
          next: () => {
            this.getAllGroupAttitudeSkills();
            this.groupAttitudeSkillDialog = false;
            this.resetGroupAttitudeSkill();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully updated Group Attitude Skill!',
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
              text: 'Failed to update Group Attitude Skill!',
            });
          },
        });
    } else {
      this.groupAttitudeSkillService
        .saveGroupAttitudeSkill(this.groupAttitudeSkill)
        .subscribe({
          next: () => {
            this.getAllGroupAttitudeSkills();
            this.groupAttitudeSkillDialog = false;
            this.resetGroupAttitudeSkill();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully added Group Attitude Skill!',
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
              text: 'Failed to add Group Attitude Skill!.',
            });
          },
        });
    }
  }

  resetGroupAttitudeSkill() {
    this.groupAttitudeSkill = { group_name: '', percentage: null, enabled: 1 };
    this.isGroupNameDuplicate = false;
    this.percentageWarning = false;
  }

  deleteGroupAttitudeSkill(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Data will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.groupAttitudeSkillService.deleteGroupAttitudeSkill(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Successfully deleted group attitude skill!',
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
              text: 'Failed to delete group attitude skill!.',
              timer: 1500,
              confirmButtonText: 'Try again',
            });
          },
        });
      }
    });
  }
}

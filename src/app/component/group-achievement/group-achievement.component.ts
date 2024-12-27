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
import { FilterMetadata } from 'primeng/api';

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

  constructor(
    private groupAchievementService: GroupAchievementService,
    private atitudeSkillService: GroupAttitudeSkillService
  ) {}

  ngOnInit() {
    forkJoin({
      groupAchievement: this.groupAchievementService.getAllGroupAchievements(),
      attitudeSkill: this.atitudeSkillService.getGroupAttitudeSkillsWithDetails(),
      gAchievementEnabled: this.groupAchievementService.getAllGroupAchievementsEnabled(),
    }).subscribe(({ groupAchievement, attitudeSkill , gAchievementEnabled}) => {
      this.groupAchievements = groupAchievement.content;
      // console.log('Group Achievement:', this.groupAchievements);
      this.totalRecords = groupAchievement.totalRecords;
      this.groupAchievementEnabled = gAchievementEnabled.content;
      this.filteredGroupAchievements = this.groupAchievements;
      this.loading = false;
      this.percentageAchieved = this.groupAchievementEnabled.map(
        (item) => item.percentage
      );
      this.totalPercentageAchieved = this.percentageAchieved.reduce(
        (acc, item) => acc + item,
        0
      );

      this.atitudeSkills = attitudeSkill.content;
      this.percentageAttitude = this.atitudeSkills.map(
        (item) => item.percentage
      );
      this.totalPercentageAttitude = this.percentageAttitude.reduce(
        (acc, item) => acc + item,
        0
      );

      this.sumPercentage();
    });
  }
  getAllGroupAchievements() {
    this.loading = true;
    this.groupAchievementService.getAllGroupAchievements().subscribe({
      next: (response) => {
        this.groupAchievements = response.content;
        // console.log('Group Achievement:', this.groupAchievements);
        this.totalRecords = response.totalRecords;
        this.filteredGroupAchievements = this.groupAchievements;
        this.loading = false;
        this.percentageAchieved = this.groupAchievements.map(
          (item) => item.percentage
        );
        this.totalPercentageAchieved = this.percentageAchieved.reduce(
          (acc, item) => acc + item,
          0
        );
        // console.log(this.totalPercentageAchieved);
      },
      error: (error) => {
        // console.error('Error fetching achievements:', error);
        this.loading = false;
      },
    });
  }

  // getAllGroupAchievements(page: number = 0, size: number = 5) {
  //   this.loading = true;
  //   this.groupAchievementService.getAllGroupAchievements(page, size).subscribe({
  //     next: (response) => {
  //       this.groupAchievements = response.content;
  //       this.totalRecords = response.totalRecords;
  //       this.filteredGroupAchievements = this.groupAchievements;
  //       this.loading = false;
  //       this.percentageAchieved = this.groupAchievements.map(
  //         (item) => item.percentage
  //       );
  //       this.totalPercentageAchieved = this.percentageAchieved.reduce(
  //         (acc, item) => acc + item,
  //         0
  //       );
  //     },
  //     error: (error) => {
  //       this.loading = false;
  //     },
  //   });
  // }

  sumPercentage() {
    this.totalPercentage =
      this.totalPercentageAttitude + this.totalPercentageAchieved;
    // console.log('ttal', this.totalPercentage);
  }

  loadPage(event: any) {
    this.first = event.first;
    this.getAllGroupAchievements();
  }

  searchData() {
    if (this.searchKeyword.trim() === '') {
      this.filteredGroupAchievements = this.groupAchievements;
    } else {
      this.filteredGroupAchievements = this.groupAchievements.filter(
        (groupAchievement) => {
          return Object.keys(groupAchievement).some((key) => {
            const value = groupAchievement[key];
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
      console.log("atas");
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
      console.log("bawah"); 
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

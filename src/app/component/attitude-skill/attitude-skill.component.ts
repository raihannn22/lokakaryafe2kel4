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

  constructor(
    private attitudeSkillService: AttitudeSkillService,
    private groupAchievementService: GroupAchievementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllAttitudeSkills();
    this.getAllGroupAttitudeSkills();
  }

  getAllAttitudeSkills() {
    this.loading = true;
    this.attitudeSkillService.getAllAttitudeSkills().subscribe({
      next: (response) => {
        this.attitudeSkills = response.content;
        this.totalRecords = response.totalRecords;
        this.filteredAttitudeSkill = this.attitudeSkills;
        this.loading = false;
      },
      error: (error) => {
        // console.error('Error fetching attitudeSkills:', error);
        this.loading = false;
      },
    });
  }

  loadPage(event: any) {
    this.first = event.first;
    this.getAllAttitudeSkills();
  }

  getAllGroupAttitudeSkills() {
    this.attitudeSkillService.getAllGroupAttitudeSkills().subscribe({
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
    // console.log('Mengedit attitudeSkill', attitudeSkill);
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

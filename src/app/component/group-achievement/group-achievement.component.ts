import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { GroupAchievementService } from '../../service/group-achievement/group-achievement.service';
import { CommonModule } from '@angular/common';  // Import CommonModule for directives like ngIf, ngFor
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { trigger, transition, style, animate } from '@angular/animations';
import { GroupAchievementService } from '../../service/group-achievement/group-achievement.service';

@Component({
  selector: 'app-group-achievement',
  standalone: true,
  imports: [
    CommonModule, // Use CommonModule instead of BrowserModule
    ButtonModule,
    CalendarModule,
    FormsModule,
    TableModule,
    DialogModule,
    CheckboxModule
  ],
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ],
  templateUrl: './group-achievement.component.html',
  styleUrls: ['./group-achievement.component.css']
})
export class GroupAchievementComponent implements OnInit {
  groupAchievements: any[] = [];
  loading: boolean = true;
  groupAchievementDialog: boolean = false;
  groupAchievement: any = { group_name: '', percentage: null, enabled: false };

  constructor(
    private groupAchievementService: GroupAchievementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllGroupAchievements();
  }

  getAllGroupAchievements() {
    this.groupAchievementService.getAllGroupAchievements().subscribe({
      next: (response) => {
        this.groupAchievements = response.content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching achievements:', error);
        this.loading = false;
      }
    });
  }

  showAddDialog() {
    console.log('Menampilkan dialog tambah');
    this.groupAchievement = { group_name: '', percentage: null, enabled: 1 };
    this.groupAchievementDialog = true;
  }

  editGroupAchievement(groupAchievement: any) {
    console.log('Mengedit group achievement', groupAchievement);
    this.groupAchievement = { ...groupAchievement };
    this.groupAchievementDialog = true;
  }

  saveGroupAchievement() {
    console.log('Data yang dikirim:', this.groupAchievement);
    if (this.groupAchievement.id) {
      this.groupAchievementService.updateGroupAchievement(this.groupAchievement.id, this.groupAchievement).subscribe({
        next: () => {
          alert('Group Achievement updated successfully');
          this.getAllGroupAchievements();
          this.groupAchievementDialog = false;
        },
        error: (error) => {
          console.error('Error updating group achievement:', error);
        }
      });
    } else {
      this.groupAchievementService.saveGroupAchievement(this.groupAchievement).subscribe({
        next: () => {
          alert('Group Achievement added successfully');
          this.getAllGroupAchievements();
          this.groupAchievementDialog = false;
        },
        error: (error) => {
          console.error('Error saving group achievement:', error);
        }
      });
    }
  }

  deleteGroupAchievement(id: string) {
    if (confirm('Are you sure you want to delete this group achievement?')) {
      this.groupAchievementService.deleteGroupAchievement(id).subscribe({
        next: () => {
          alert('Group Achievement deleted successfully');
          this.getAllGroupAchievements();
        },
        error: (error) => {
          console.error('Error deleting group achievement:', error);
        }
      });
    }
  }
}

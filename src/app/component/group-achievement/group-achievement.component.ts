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
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';

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
    IconFieldModule
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
  filteredGroupAchievements: any[] = []; 
  loading: boolean = true;
  groupAchievementDialog: boolean = false;
  groupAchievement: any = { group_name: '', percentage: null, enabled: false };
  searchKeyword: string = ''; 
  selectedCategory: string = ''; // Kategori yang dipilih dari dropdown
  searchCategories: any[] = [
    { label: 'Group Name', value: 'group_name' },
    { label: 'Percentage', value: 'percentage' },
  ];

  first: number = 0;
  totalRecords: number = 0;

  constructor(
    private groupAchievementService: GroupAchievementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllGroupAchievements();
  }

  getAllGroupAchievements() {
    this.loading = true;
    this.groupAchievementService.getAllGroupAchievements(this.first, 5).subscribe({
      next: (response) => {
        this.groupAchievements = response.content;
        this.totalRecords = response.totalRecords;
        this.filteredGroupAchievements = this.groupAchievements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching achievements:', error);
        this.loading = false;
      }
    });
  }

  loadPage(event: any) {
    this.first = event.first; // Dapatkan halaman yang dipilih
    this.getAllGroupAchievements(); // Muat ulang data berdasarkan halaman baru
  }

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 }
  ];

  searchData() {
    if (!this.selectedCategory || this.searchKeyword.trim() === '') {
      // Jika kategori atau keyword kosong, tampilkan semua data
      this.filteredGroupAchievements = this.groupAchievements;
    } else {
      this.filteredGroupAchievements = this.groupAchievements.filter(groupAchievement => {
        const value = groupAchievement[this.selectedCategory];
        if (this.selectedCategory === 'percentage') {
          // Bandingkan sebagai numerik
          return value != null && value.toString().includes(this.searchKeyword);
        }
        // Bandingkan sebagai string
        return value?.toLowerCase().includes(this.searchKeyword.toLowerCase());
      });
    }
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

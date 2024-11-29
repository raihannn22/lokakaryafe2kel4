import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // Import CommonModule for directives like ngIf, ngFor
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { trigger, transition, style, animate } from '@angular/animations';
// import { AchievementService } from '../../service/achievement/achievement.service';
import { GroupAchievementService } from '../../service/group-achievement/group-achievement.service';
import { DropdownModule } from 'primeng/dropdown';
import { AchievementService } from '../../service/achievement/achievement.service';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';

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
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css']
})
export class AchievementComponent implements OnInit {
  achievements: any[] = [];
  groupAchievements: any[] = [];
  filteredAchievements: any[] = []; 
  loading: boolean = true;
  achievementDialog: boolean = false;
  achievement: any = { achievement: '', group_id: null, enabled: false };
  searchKeyword: string = ''; 
  selectedCategory: string = ''; // Kategori yang dipilih dari dropdown
  searchCategories: any[] = [
    { label: 'Group Name', value: 'group_name' },
    { label: 'Achievement', value: 'achievement' },
  ];

  first: number = 0; // Untuk pagination
  totalRecords: number = 0; // Total jumlah data yang ada

  constructor(
    private achievementService: AchievementService ,
    private groupAchievementService: GroupAchievementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllAchievements();
    this.getAllGroupAchievements();
  }

  getAllAchievements() {
    this.loading = true;
    this.achievementService.getAllAchievements(this.first, 5).subscribe({
      next: (response) => {
        this.achievements = response.content;
        this.totalRecords = response.totalRecords;
        this.filteredAchievements = this.achievements;
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
    this.getAllAchievements(); // Muat ulang data berdasarkan halaman baru
  }

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 }
  ];

  getAllGroupAchievements() {
    this.achievementService.getAllGroupAchievements().subscribe({
      next: (response) => {
        // console.log('Data GroupAchievements:', response.content);  // Log data untuk memastikan isi array
        this.groupAchievements = response.content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching group achievements:', error);
        this.loading = false;
      }
    });
  }

  searchData() {
    if (!this.selectedCategory || this.searchKeyword.trim() === '') {
      this.filteredAchievements = this.achievements; // Jika kategori kosong atau keyword kosong, tampilkan semua data
    } else {
      this.filteredAchievements = this.achievements.filter(achievement => {
        return achievement[this.selectedCategory]?.toLowerCase().includes(this.searchKeyword.toLowerCase());
      });
    }
  }
  

  showAddDialog() {
    console.log('Menampilkan dialog tambah');
    this.achievement = { achievement: '', group_id: '', enabled: 1 };
    this.achievementDialog = true;
  }

  editAchievement(achievement: any) {
    console.log('Mengedit achievement', achievement);
    this.achievement = { ...achievement };
    this.achievementDialog = true;
  }



saveAchievement() {
  const dataToSend = {
    achievement: this.achievement.achievement, // Nama achievement
    group_id: this.achievement.group_id,       // ID dari dropdown (langsung)
    enabled: this.achievement.enabled
  };

  console.log('Data yang dikirim:', dataToSend);

  if (this.achievement.id) {
    // Update achievement
    this.achievementService.updateAchievement(this.achievement.id, dataToSend).subscribe({
      next: () => {
        alert('Achievement updated successfully');
        this.getAllAchievements();
        this.achievementDialog = false;
      },
      error: (error) => {
        console.error('Error updating achievement:', error);
      }
    });
  } else {
    // Save new achievement
    this.achievementService.saveAchievement(dataToSend).subscribe({
      next: () => {
        alert('Achievement added successfully');
        this.getAllAchievements();
        this.achievementDialog = false;
      },
      error: (error) => {
        console.error('Error saving achievement:', error);
      }
    });
  }
}



  deleteAchievement(id: string) {
    if (confirm('Are you sure you want to delete this achievement?')) {
      this.achievementService.deleteAchievement(id).subscribe({
        next: () => {
          alert('Achievement deleted successfully');
          this.getAllAchievements();
        },
        error: (error) => {
          console.error('Error deleting achievement:', error);
        }
      });
    }
  }
}

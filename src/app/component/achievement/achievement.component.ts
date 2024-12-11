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
import { FilterMetadata } from 'primeng/api';
import Swal from 'sweetalert2';
import { group } from 'console';

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
  filters: { [s: string]: FilterMetadata } = {};

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 }
  ];

  isAchievementDuplicate: boolean = false;

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
    this.achievementService.getAllAchievements().subscribe({
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
    if (this.searchKeyword.trim() === '') {
        // Jika kata kunci kosong, tampilkan semua data
        this.filteredAchievements = this.achievements;
    } else {
        this.filteredAchievements = this.achievements.filter(achievement => {
            // Cek setiap kolom dan sesuaikan pencarian berdasarkan kolom
            return Object.keys(achievement).some(key => {
                const value = achievement[key];
                if (typeof value === 'number') {
                    // Jika nilai kolom adalah angka (percentage), bandingkan sebagai numerik
                    return value.toString().includes(this.searchKeyword);
                } else if (typeof value === 'string') {
                    // Jika nilai kolom adalah string, bandingkan sebagai string
                    return value.toLowerCase().includes(this.searchKeyword.toLowerCase());
                }
                return false;
            });
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

validateAchievement() {
    // Validasi group_name untuk data baru (add)
    if (!this.achievement.id) {
      const existingAchievement = this.achievements.find(achiev => 
        achiev.achievement.toLowerCase() === this.achievement.achievement.toLowerCase()
      );
      if (existingAchievement) {
        this.isAchievementDuplicate = true;
        return false; // Invalid, group name is duplicated
      }
    } else {
      // Validasi group_name untuk edit data (tidak boleh sama dengan grup lain, kecuali yang sedang diedit)
      const existingAchievement = this.achievements.find(achiev => 
        achiev.achievement.toLowerCase() === this.achievement.achievement.toLowerCase() && achiev.id !== this.achievement.id
      );
      if (existingAchievement) {
        this.isAchievementDuplicate = true;
        return false; // Invalid, group name is duplicated
      }
    }

    this.isAchievementDuplicate = false; // Reset flag


    return true; // All validations passed
  }

saveAchievement() {
    // Panggil fungsi validasi
    if (!this.validateAchievement()) {
      return; // Jika validasi gagal, hentikan proses penyimpanan
    }

    // Jika validasi berhasil, lanjutkan dengan save/update
    if (this.achievement.id) {
      this.achievementService.updateAchievement(this.achievement.id, this.achievement).subscribe({
        next: () => {
          this.getAllAchievements();
          this.achievementDialog = false;
          this.resetAchievement();
          Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'Berhasil memperbarui Pencapaian!'
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Gagal memperbarui Pencapaian!'
          });
        }
      });
    } else {
      this.achievementService.saveAchievement(this.achievement).subscribe({
        next: () => {
          this.getAllAchievements();
          this.achievementDialog = false;
          this.resetAchievement();
          Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'Berhasil menambahkan Pencapaian!'
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Gagal menambahkan Pencapaian!.'
          });
        }
      });
    }
  }

  resetAchievement() {
    this.achievement = { achievement: '', group_id: null, enabled: 1 }; 
    this.isAchievementDuplicate = false; // Clear duplicate group name warning
  }



  deleteAchievement(id: string) {
  Swal.fire({
    title: 'Apakah anda yakin?',
    text: "Data tidak dapat kembali jika dihapus!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      this.achievementService.deleteAchievement(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil Menghapus Pencapaian!',
            showConfirmButton: false,
            timer: 1500
          });
          this.getAllAchievements();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal Menghapus Pencapaian!.',
            confirmButtonText: 'Coba Lagi'
          });
        }
      });
    }
  });
}
}

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
import { FilterMetadata } from 'primeng/api';
import Swal from 'sweetalert2';

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
  // Data properties
groupAchievements: any[] = [];
filteredGroupAchievements: any[] = [];
loading: boolean = true;
groupAchievementDialog: boolean = false;
groupAchievement: any = { group_name: '', percentage: null, enabled: false };

// Search and Filter properties
searchKeyword: string = '';
filters: { [s: string]: FilterMetadata } = {};

// Dropdown and options
enabledOptions = [
  { label: 'Enabled', value: 1 },
  { label: 'Disabled', value: 0 }
];

// Validation flags
isGroupNameDuplicate: boolean = false;
percentageWarning: boolean = false;

// Pagination properties
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

  

  searchData() {
    if (this.searchKeyword.trim() === '') {
        // Jika kata kunci kosong, tampilkan semua data
        this.filteredGroupAchievements = this.groupAchievements;
    } else {
        this.filteredGroupAchievements = this.groupAchievements.filter(groupAchievement => {
            // Cek setiap kolom dan sesuaikan pencarian berdasarkan kolom
            return Object.keys(groupAchievement).some(key => {
                const value = groupAchievement[key];
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

  validatePercentage() {
    if (this.groupAchievement.percentage > 100) {
      this.percentageWarning = true;
      this.groupAchievement.percentage = 100; // Set value to 100 if it's greater than 100
    } else {
      this.percentageWarning = false;
    }
  }
  showAddDialog() {
    console.log('Menampilkan dialog tambah');
    this.groupAchievement = { group_name: '', percentage: null, enabled: 1 };
    this.groupAchievementDialog = true;
    this.isGroupNameDuplicate = false;
    
  }

  editGroupAchievement(groupAchievement: any) {
    console.log('Mengedit group achievement', groupAchievement);
    this.groupAchievement = { ...groupAchievement };
    this.groupAchievementDialog = true;
    this.isGroupNameDuplicate = false;
  }

  validateGroupAchievement() {
    // Validasi group_name untuk data baru (add)
    if (!this.groupAchievement.id) {
      const existingGroup = this.groupAchievements.find(group => 
        group.group_name.toLowerCase() === this.groupAchievement.group_name.toLowerCase()
      );
      if (existingGroup) {
        this.isGroupNameDuplicate = true;
        return false; // Invalid, group name is duplicated
      }
    } else {
      // Validasi group_name untuk edit data (tidak boleh sama dengan grup lain, kecuali yang sedang diedit)
      const existingGroup = this.groupAchievements.find(group => 
        group.group_name.toLowerCase() === this.groupAchievement.group_name.toLowerCase() && group.id !== this.groupAchievement.id
      );
      if (existingGroup) {
        this.isGroupNameDuplicate = true;
        return false; // Invalid, group name is duplicated
      }
    }

    this.isGroupNameDuplicate = false; // Reset flag

    // Validasi percentage tidak boleh lebih dari 100
    if (this.groupAchievement.percentage > 100) {
      this.percentageWarning = true;
      this.groupAchievement.percentage = 100; // Set value to 100 if it's greater than 100
      return false; // Invalid, percentage exceeds 100
    } else {
      this.percentageWarning = false; // Reset flag if valid
    }

    return true; // All validations passed
  }


   saveGroupAchievement() {
    // Panggil fungsi validasi
    if (!this.validateGroupAchievement()) {
      return; // Jika validasi gagal, hentikan proses penyimpanan
    }

    // Jika validasi berhasil, lanjutkan dengan save/update
    if (this.groupAchievement.id) {
      this.groupAchievementService.updateGroupAchievement(this.groupAchievement.id, this.groupAchievement).subscribe({
        next: () => {
          this.getAllGroupAchievements();
          this.groupAchievementDialog = false;
          this.resetGroupAchievement();
          Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'Berhasil memperbarui Group Pencapaian!'
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Gagal memperbarui Grup Pencapaian!'
          });
        }
      });
    } else {
      this.groupAchievementService.saveGroupAchievement(this.groupAchievement).subscribe({
        next: () => {
          this.getAllGroupAchievements();
          this.groupAchievementDialog = false;
          this.resetGroupAchievement();
          Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'Berhasil menambahkan Grup Pencapaian!'
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Gagal menambahkan Grup Pencapaian!.'
          });
        }
      });
    }
  }


  resetGroupAchievement() {
    this.groupAchievement = { group_name: '', percentage: null, enabled: 1 }; 
    this.isGroupNameDuplicate = false; // Clear duplicate group name warning
    this.percentageWarning = false; // Clear percentage warning
  }



  deleteGroupAchievement(id: string) {
  Swal.fire({
    title: 'Apakah anda yakin?',
    text: "Data tidak dapat kembali jika dihapus!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      this.groupAchievementService.deleteGroupAchievement(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil Menghapus Grup Pencapaian!',
            showConfirmButton: false,
            timer: 1500
          });
          this.getAllGroupAchievements();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal Menghapus Grup Pencapaian!.',
            confirmButtonText: 'Coba Lagi'
          });
        }
      });
    }
  });
}

}

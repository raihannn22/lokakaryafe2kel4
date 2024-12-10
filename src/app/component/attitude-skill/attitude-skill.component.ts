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
  templateUrl: './attitude-skill.component.html',
  styleUrls: ['./attitude-skill.component.css']
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
    { label: 'Disabled', value: 0 }
  ];

  isAttitudeSKillDuplicate: boolean = false;

  first: number = 0; // Untuk pagination
  totalRecords: number = 0; // Total jumlah data yang ada

  constructor(
    private attitudeSkillService: AttitudeSkillService ,
    private groupAchievementService: GroupAchievementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllAttitudeSkills();
    this.getAllGroupAttitudeSkills();
  }

  getAllAttitudeSkills() {
    this.loading = true;
    this.attitudeSkillService.getAllAttitudeSkills(this.first, 5).subscribe({
      next: (response) => {
        this.attitudeSkills = response.content;
        this.totalRecords = response.totalRecords;
        this.filteredAttitudeSkill = this.attitudeSkills;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching attitudeSkills:', error);
        this.loading = false;
      }
    });
  }

  loadPage(event: any) {
    this.first = event.first; // Dapatkan halaman yang dipilih
    this.getAllAttitudeSkills(); // Muat ulang data berdasarkan halaman baru
  }



  getAllGroupAttitudeSkills() {
    this.attitudeSkillService.getAllGroupAttitudeSkills().subscribe({
      next: (response) => {
        // console.log('Data GroupAchievements:', response.content);  // Log data untuk memastikan isi array
        this.groupAttitudeSkills = response.content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching group attitudeSkills:', error);
        this.loading = false;
      }
    });
  }

  searchData() {
    if (this.searchKeyword.trim() === '') {
        // Jika kata kunci kosong, tampilkan semua data
        this.filteredAttitudeSkill = this.attitudeSkills;
    } else {
        this.filteredAttitudeSkill = this.attitudeSkills.filter(attitudeSkill => {
            // Cek setiap kolom dan sesuaikan pencarian berdasarkan kolom
            return Object.keys(attitudeSkill).some(key => {
                const value = attitudeSkill[key];
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
    this.attitudeSkill = { attitude_skill: '', group_id: '', enabled: 1 };
    this.attitudeSkillDialog = true;
  }

  editAttitudeSkill(attitudeSkill: any) {
    console.log('Mengedit attitudeSkill', attitudeSkill);
    this.attitudeSkill = { ...attitudeSkill };
    this.attitudeSkillDialog = true;
  }

validateAttitudeSkill() {
    // Validasi group_name untuk data baru (add)
    if (!this.attitudeSkill.id) {
      const existingAttitudeSkill = this.attitudeSkills.find(attskl => 
        attskl.attitude_skill.toLowerCase() === this.attitudeSkill.attitude_skill.toLowerCase()
      );
      if (existingAttitudeSkill) {
        this.isAttitudeSKillDuplicate = true;
        return false; // Invalid, group name is duplicated
      }
    } else {
      // Validasi group_name untuk edit data (tidak boleh sama dengan grup lain, kecuali yang sedang diedit)
      const existingAttitudeSkill = this.attitudeSkills.find(attskl => 
        attskl.attitude_skill.toLowerCase() === this.attitudeSkill.attitude_skill.toLowerCase() && attskl.id !== this.attitudeSkill.id
      );
      if (existingAttitudeSkill) {
        this.isAttitudeSKillDuplicate = true;
        return false; // Invalid, group name is duplicated
      }
    }

    this.isAttitudeSKillDuplicate = false; // Reset flag


    return true; // All validations passed
  }

saveAttitudeSkill() {
    // Panggil fungsi validasi
    if (!this.validateAttitudeSkill()) {
      return; // Jika validasi gagal, hentikan proses penyimpanan
    }

    // Jika validasi berhasil, lanjutkan dengan save/update
    if (this.attitudeSkill.id) {
      this.attitudeSkillService.updateAttitudeSkill(this.attitudeSkill.id, this.attitudeSkill).subscribe({
        next: () => {
          this.getAllAttitudeSkills();
          this.attitudeSkillDialog = false;
          this.resetAttitudeSkill();
          Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'Berhasil memperbarui Sikap dan Keahlian!'
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Gagal memperbarui Sikap dan Keahlian!'
          });
        }
      });
    } else {
      this.attitudeSkillService.saveAttitudeSkill(this.attitudeSkill).subscribe({
        next: () => {
          this.getAllAttitudeSkills();
          this.attitudeSkillDialog = false;
          this.resetAttitudeSkill();
          Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'Berhasil menambahkan Sikap dan Keahlian!'
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Gagal menambahkan Sikap dan Keahlian!.'
          });
        }
      });
    }
  }

  resetAttitudeSkill() {
    this.attitudeSkill = { attitude_skill: '', group_id: null, enabled: 1 }; 
    this.isAttitudeSKillDuplicate = false; // Clear duplicate group name warning
  }



  deleteAttitudeSkill(id: string) {
  Swal.fire({
    title: 'Apakah anda yakin?',
    text: "Data tidak dapat kembali jika dihapus!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      this.attitudeSkillService.deleteAttitudeSkill(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil Menghapus Sikap dan Keahlian!',
            showConfirmButton: false,
            timer: 1500
          });
          this.getAllAttitudeSkills();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal Menghapus Sikap dan Keahlian!.',
            confirmButtonText: 'Coba Lagi'
          });
        }
      });
    }
  });
}
}

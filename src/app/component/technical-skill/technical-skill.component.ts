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
import { TechnicalSkillService } from '../../service/technical-skill/technical-skill.service';

@Component({
  selector: 'app-technical-skill',
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
  templateUrl: './technical-skill.component.html',
  styleUrls: ['./technical-skill.component.css']
})
export class TechnicalSkillComponent implements OnInit {
  // Data properties
technicalSkills: any[] = [];
filteredTechnicalSkills: any[] = [];
loading: boolean = true;
technicalSkillDialog: boolean = false;
technicalSkill: any = { technical_skill: '', percentage: null, enabled: false };

// Search and Filter properties
searchKeyword: string = '';
filters: { [s: string]: FilterMetadata } = {};

// Dropdown and options
enabledOptions = [
  { label: 'Enabled', value: 1 },
  { label: 'Disabled', value: 0 }
];

// Validation flags
isTechnicalSkillDuplicate: boolean = false;

// Pagination properties
first: number = 0;
totalRecords: number = 0;


  constructor(
    private technicalSkillService: TechnicalSkillService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllTechnicalSkills();
  }

  getAllTechnicalSkills() {
    this.loading = true;
    this.technicalSkillService.getAllTechnicalSkills(this.first, 5).subscribe({
      next: (response) => {
        this.technicalSkills = response.content;
        this.totalRecords = response.totalRecords;
        this.filteredTechnicalSkills = this.technicalSkills;
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
    this.getAllTechnicalSkills(); // Muat ulang data berdasarkan halaman baru
  }

  

  searchData() {
    if (this.searchKeyword.trim() === '') {
        // Jika kata kunci kosong, tampilkan semua data
        this.filteredTechnicalSkills = this.technicalSkills;
    } else {
        this.filteredTechnicalSkills = this.technicalSkills.filter(technicalSkills => {
            // Cek setiap kolom dan sesuaikan pencarian berdasarkan kolom
            return Object.keys(technicalSkills).some(key => {
                const value = technicalSkills[key];
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
    this.technicalSkill = { technical_skill: '', enabled: 1 };
    this.technicalSkillDialog = true;
    this.isTechnicalSkillDuplicate = false;
    
  }

  editTechnicalSkill(technicalSkill: any) {
    console.log('Mengedit technical skill', technicalSkill);
    this.technicalSkill = { ...technicalSkill };
    this.technicalSkillDialog = true;
    this.isTechnicalSkillDuplicate = false;
  }

  validateTechnicalSkill() {
    // Validasi group_name untuk data baru (add)
    if (!this.technicalSkill.id) {
      const existingTechnicalSkill = this.technicalSkills.find(technical => 
        technical.technical_skill.toLowerCase() === this.technicalSkill.technical_skill.toLowerCase()
      );
      if (existingTechnicalSkill) {
        this.isTechnicalSkillDuplicate = true;
        return false; // Invalid, group name is duplicated
      }
    } else {
      // Validasi group_name untuk edit data (tidak boleh sama dengan grup lain, kecuali yang sedang diedit)
      const existingTechnicalSkill = this.technicalSkills.find(technical => 
        technical.technical_skill.toLowerCase() === this.technicalSkill.technical_skill.toLowerCase() && technical.id !== this.technicalSkill.id
      );
      if (existingTechnicalSkill) {
        this.isTechnicalSkillDuplicate = true;
        return false; // Invalid, group name is duplicated
      }
    }

    this.isTechnicalSkillDuplicate = false; // Reset flag

    // Validasi percentage tidak boleh lebih dari 100

    return true; // All validations passed
  }


   saveTechnicalSkill() {
    // Panggil fungsi validasi
    if (!this.validateTechnicalSkill()) {
      return; // Jika validasi gagal, hentikan proses penyimpanan
    }

    // Jika validasi berhasil, lanjutkan dengan save/update
    if (this.technicalSkill.id) {
      this.technicalSkillService.updateTechnicalSkill(this.technicalSkill.id, this.technicalSkill).subscribe({
        next: () => {
          this.getAllTechnicalSkills();
          this.technicalSkillDialog = false;
          this.resetTecnicalSkill();
          Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'Berhasil memperbarui Keahlian Teknis!'
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Gagal memperbarui Keahlian Teknis!'
          });
        }
      });
    } else {
      this.technicalSkillService.saveTechnicalSkill(this.technicalSkill).subscribe({
        next: () => {
          this.getAllTechnicalSkills();
          this.technicalSkillDialog = false;
          this.resetTecnicalSkill();
          Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'Berhasil menambahkan Keahlian Teknis!'
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Gagal menambahkan Keahlian Teknis!.'
          });
        }
      });
    }
  }


  resetTecnicalSkill() {
    this.technicalSkill = { technical_skill: '', enabled: 1 }; 
    this.isTechnicalSkillDuplicate = false; // Clear duplicate group name warning
  }



  deleteTechnicalSkill(id: string) {
  Swal.fire({
    title: 'Apakah anda yakin?',
    text: "Data tidak dapat kembali jika dihapus!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      this.technicalSkillService.deleteTechnicalSkill(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil Menghapus Keahlian Teknis!',
            showConfirmButton: false,
            timer: 1500
          });
          this.getAllTechnicalSkills();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal Menghapus Keahlian Teknis!.',
            confirmButtonText: 'Coba Lagi'
          });
        }
      });
    }
  });
}

}

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
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { FilterMetadata } from 'primeng/api';
import Swal from 'sweetalert2';
import { GroupAttitudeSkillService } from '../../service/group-attitude-skill/group-attitude-skill.service';

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
  // Data properties
  groupAttitudeSkills: any[] = [];
  filteredGroupAttitudeSkills: any[] = [];
  loading: boolean = true;
  groupAttitudeSkillDialog: boolean = false;
  groupAttitudeSkill: any = {
    group_name: '',
    percentage: null,
    enabled: false,
  };

  // Search and Filter properties
  searchKeyword: string = '';
  filters: { [s: string]: FilterMetadata } = {};

  // Dropdown and options
  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 },
  ];

  // Validation flags
  isGroupNameDuplicate: boolean = false;
  percentageWarning: boolean = false;

  // Pagination properties
  first: number = 0;
  totalRecords: number = 0;

  constructor(
    private groupAttitudeSkillService: GroupAttitudeSkillService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllGroupAttitudeSkills();
  }

  getAllGroupAttitudeSkills() {
    this.loading = true;
    this.groupAttitudeSkillService.getAllGroupAttitudeSkills().subscribe({
      next: (response) => {
        this.groupAttitudeSkills = response.content;
        this.totalRecords = response.totalRecords;
        this.filteredGroupAttitudeSkills = this.groupAttitudeSkills;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching AttitudeSkills:', error);
        this.loading = false;
      },
    });
  }

  loadPage(event: any) {
    this.first = event.first; // Dapatkan halaman yang dipilih
    this.getAllGroupAttitudeSkills(); // Muat ulang data berdasarkan halaman baru
  }

  searchData() {
    if (this.searchKeyword.trim() === '') {
      // Jika kata kunci kosong, tampilkan semua data
      this.filteredGroupAttitudeSkills = this.groupAttitudeSkills;
    } else {
      this.filteredGroupAttitudeSkills = this.groupAttitudeSkills.filter(
        (groupAttitudeSkill) => {
          // Cek setiap kolom dan sesuaikan pencarian berdasarkan kolom
          return Object.keys(groupAttitudeSkill).some((key) => {
            const value = groupAttitudeSkill[key];
            if (typeof value === 'number') {
              // Jika nilai kolom adalah angka (percentage), bandingkan sebagai numerik
              return value.toString().includes(this.searchKeyword);
            } else if (typeof value === 'string') {
              // Jika nilai kolom adalah string, bandingkan sebagai string
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
    if (this.groupAttitudeSkill.percentage > 100) {
      this.percentageWarning = true;
      this.groupAttitudeSkill.percentage = 100; // Set value to 100 if it's greater than 100
    } else {
      this.percentageWarning = false;
    }
  }
  showAddDialog() {
    console.log('Menampilkan dialog tambah');
    this.groupAttitudeSkill = { group_name: '', percentage: null, enabled: 1 };
    this.groupAttitudeSkillDialog = true;
    this.isGroupNameDuplicate = false;
  }

  editGroupAttitudeSkill(groupAttitudeSkill: any) {
    console.log('Mengedit group AttitudeSkill', groupAttitudeSkill);
    this.groupAttitudeSkill = { ...groupAttitudeSkill };
    this.groupAttitudeSkillDialog = true;
    this.isGroupNameDuplicate = false;
  }

  validateGroupAttitudeSkill() {
    // Validasi group_name untuk data baru (add)
    if (!this.groupAttitudeSkill.id) {
      const existingGroup = this.groupAttitudeSkills.find(
        (group) =>
          group.group_name.toLowerCase() ===
          this.groupAttitudeSkill.group_name.toLowerCase()
      );
      if (existingGroup) {
        this.isGroupNameDuplicate = true;
        return false; // Invalid, group name is duplicated
      }
    } else {
      // Validasi group_name untuk edit data (tidak boleh sama dengan grup lain, kecuali yang sedang diedit)
      const existingGroup = this.groupAttitudeSkills.find(
        (group) =>
          group.group_name.toLowerCase() ===
            this.groupAttitudeSkill.group_name.toLowerCase() &&
          group.id !== this.groupAttitudeSkill.id
      );
      if (existingGroup) {
        this.isGroupNameDuplicate = true;
        return false; // Invalid, group name is duplicated
      }
    }

    this.isGroupNameDuplicate = false; // Reset flag

    // Validasi percentage tidak boleh lebih dari 100
    if (this.groupAttitudeSkill.percentage > 100) {
      this.percentageWarning = true;
      this.groupAttitudeSkill.percentage = 100; // Set value to 100 if it's greater than 100
      return false; // Invalid, percentage exceeds 100
    } else {
      this.percentageWarning = false; // Reset flag if valid
    }

    return true; // All validations passed
  }

  saveGroupAttitudeSkill() {
    // Panggil fungsi validasi
    if (!this.validateGroupAttitudeSkill()) {
      return; // Jika validasi gagal, hentikan proses penyimpanan
    }

    // Jika validasi berhasil, lanjutkan dengan save/update
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
              title: 'Sukses!',
              text: 'Berhasil memperbarui Grup Sikap dan Keahlian!',
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: 'Gagal memperbarui Grup Sikap dan Keahlian!',
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
              title: 'Sukses!',
              text: 'Berhasil menambahkan Grup Sikap dan Keahlian!',
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: 'Gagal menambahkan Grup Sikap dan Keahlian!.',
            });
          },
        });
    }
  }

  resetGroupAttitudeSkill() {
    this.groupAttitudeSkill = { group_name: '', percentage: null, enabled: 1 };
    this.isGroupNameDuplicate = false; // Clear duplicate group name warning
    this.percentageWarning = false; // Clear percentage warning
  }

  deleteGroupAttitudeSkill(id: string) {
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Data tidak dapat kembali jika dihapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.groupAttitudeSkillService.deleteGroupAttitudeSkill(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil Menghapus Grup Sikap dan Keahlian!',
              showConfirmButton: false,
              timer: 1500,
            });
            this.getAllGroupAttitudeSkills();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal Menghapus Grup Sikap dan Keahlian!.',
              confirmButtonText: 'Coba Lagi',
            });
          },
        });
      }
    });
  }
}

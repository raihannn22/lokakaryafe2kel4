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
import { EmpAchievementSkillService } from '../../service/emp-achievement-skill/emp-achievement-skill.service';
import { InputNumberModule } from 'primeng/inputnumber';

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
    InputNumberModule,
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
  templateUrl: './emp-achievement-skill.component.html',
  styleUrls: ['./emp-achievement-skill.component.css']
})
export class EmpAchievementSkillComponent implements OnInit {
  achievements: any[] = [];
  groupAchievements: any[] = [];
  users: any[] = [];
  empAchievementSkills: any[] = [];
  filteredEmpAchievementSkills: any[] = []; 
  loading: boolean = true;
  empAchievementSkillDialog: boolean = false;
  // empAchievementSkill: any = { achievement_id: null, user_id: null, notes: null, score: null, assessment_year: '' };
  empAchievementSkill: any = { user_id: null, notes: '', achievement_id: null, score: '', assesment_year: '' };

  searchKeyword: string = ''; 
  filters: { [s: string]: FilterMetadata } = {};


  isEmpA: boolean = false;

  
scoreWarning: boolean = false;

  first: number = 0; // Untuk pagination
  totalRecords: number = 0; // Total jumlah data yang ada

  constructor(
    private empAchievementSkillService: EmpAchievementSkillService ,
    private achievementService: AchievementService ,
    private groupAchievementService: GroupAchievementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllAchievements();
    this.getAllGroupAchievements();
    this.getAllEmpAchievementSkills();
    this.getAllUsers();
    // this.getAchievementsByGroup();
  }

  getAllEmpAchievementSkills() {
    this.loading = true;
    this.empAchievementSkillService.getAllEmpAchievementSkills().subscribe({
      next: (response) => {
        this.empAchievementSkills = response.content;
        this.totalRecords = response.totalRecords;
        this.filteredEmpAchievementSkills = this.empAchievementSkills;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching empAchievementSkills:', error);
        this.loading = false;
      }
    });
  }

  getAllAchievements() {
    this.loading = true;
    this.empAchievementSkillService.getAllAchievements().subscribe({
      next: (response) => {
        this.achievements = response.content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching achievements:', error);
        this.loading = false;
      }
    });
  }

  getAllUsers() {
    this.loading = true;
    this.empAchievementSkillService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      }
    });
  }

  loadPage(event: any) {
    this.first = event.first; // Dapatkan halaman yang dipilih
    this.getAllAchievements(); // Muat ulang data berdasarkan halaman baru
  }



  getAllGroupAchievements() {
    this.empAchievementSkillService.getAllGroupAchievements().subscribe({
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


// nanti dihapus aja ya
// }

  searchData() {
    if (this.searchKeyword.trim() === '') {
        // Jika kata kunci kosong, tampilkan semua data
        this.filteredEmpAchievementSkills = this.empAchievementSkills;
    } else {
        this.filteredEmpAchievementSkills = this.empAchievementSkills.filter(empAchievementSkill => {
            // Cek setiap kolom dan sesuaikan pencarian berdasarkan kolom
            return Object.keys(empAchievementSkill).some(key => {
                const value = empAchievementSkill[key];
                if (typeof value === 'number') {
                    return value.toString().includes(this.searchKeyword);
                } else if (typeof value === 'string') {
                    return value.toLowerCase().includes(this.searchKeyword.toLowerCase());
                }
                return false;
            });
        });
    }
}
  validateScore() {
    if (this.empAchievementSkill.score > 100) {
      this.scoreWarning = true;
      this.empAchievementSkill.score = 100; // Set value to 100 if it's greater than 100
    } else {
      this.scoreWarning = false;
    }
  }
  

  showAddDialog() {
    console.log('Menampilkan dialog tambah');
    this.empAchievementSkill = { achievement_id: null, user_id: null, notes: null, score: null, assessment_year: '' };
    this.empAchievementSkillDialog = true;
  }

  editEmpAchievementSkill(empAchievementSkill: any) {
    console.log('Mengedit EmpAchievementSKill', empAchievementSkill);
    this.empAchievementSkill = { ...empAchievementSkill };
    this.empAchievementSkillDialog = true;
  }


saveEmpAchievementSkill() {
    // Panggil fungsi validasi
    // if (!this.validateAchievement()) {
    //   return; // Jika validasi gagal, hentikan proses penyimpanan
    // }

    // Jika validasi berhasil, lanjutkan dengan save/update
  //   if (this.empAchievementSkill.id) {
  //     this.empAchievementSkillService.updateEmpAchievementSkill(this.empAchievementSkill.id, this.empAchievementSkill).subscribe({
  //       next: () => {
  //         this.getAllEmpAchievementSkills();
  //         this.empAchievementSkillDialog = false;
  //         this.resetEmpAchievementSkill();
  //         Swal.fire({
  //           icon: 'success',
  //           title: 'Sukses!',
  //           text: 'Berhasil memperbarui Pencapaian Personal!'
  //         });
  //       },
  //       error: (error) => {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Gagal!',
  //           text: 'Gagal memperbarui Pencapaian Personal!'
  //         });
  //       }
  //     });
  //   } else {
  //     console.log('Proses save, data yang dikirim:', this.empAchievementSkill);
  //     this.empAchievementSkillService.saveEmpAchievementSkill(this.empAchievementSkill).subscribe({
  //       next: () => {
  //         this.getAllEmpAchievementSkills();
  //         this.empAchievementSkillDialog = false;
  //         this.resetEmpAchievementSkill();
  //         Swal.fire({
  //           icon: 'success',
  //           title: 'Sukses!',
  //           text: 'Berhasil menambahkan Pencapaian Personal!'
  //         });
  //       },
  //       error: (error) => {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Gagal!',
  //           text: 'Gagal menambahkan Pencapaian Personal!.'
  //         });
  //       }
  //     });
  //   }
  // }

  if (this.empAchievementSkill.id) {
  this.empAchievementSkillService.updateEmpAchievementSkill(this.empAchievementSkill.id, this.empAchievementSkill).subscribe({
    next: () => {
      this.getAllEmpAchievementSkills();
      this.empAchievementSkillDialog = false;
      this.resetEmpAchievementSkill();
      Swal.fire({
        icon: 'success',
        title: 'Sukses!',
        text: 'Berhasil memperbarui Pencapaian Personal!'
      });
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal memperbarui Pencapaian Personal!'
      });
    }
  });
} else {
  // Mendapatkan tahun saat ini untuk assessment_year
  const currentYear = new Date().getFullYear();
  
  // Set nilai assessment_year pada objek empAchievementSkill
  this.empAchievementSkill.assessment_year = currentYear;

  console.log('Proses save, data yang dikirim:', this.empAchievementSkill);
  this.empAchievementSkillService.saveEmpAchievementSkill(this.empAchievementSkill).subscribe({
    next: () => {
      this.getAllEmpAchievementSkills();
      this.empAchievementSkillDialog = false;
      this.resetEmpAchievementSkill();
      Swal.fire({
        icon: 'success',
        title: 'Sukses!',
        text: 'Berhasil menambahkan Pencapaian Personal!'
      });
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menambahkan Pencapaian Personal!.'
      });
    }
  });
}
}

  resetEmpAchievementSkill() {
    this.empAchievementSkill = { achievement_id: null, user_id: null, notes: null, score: null, assessment_year: '' }; 
    // this.isAchievementDuplicate = false; 
  }


  deleteEmpAchievementSkill(id: string) {
  Swal.fire({
    title: 'Apakah anda yakin?',
    text: "Data tidak dapat kembali jika dihapus!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      this.empAchievementSkillService.deleteEmpAchievementSkill(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil Menghapus Pencapaian Personal!',
            showConfirmButton: false,
            timer: 1500
          });
          this.getAllEmpAchievementSkills();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal Menghapus Pencapaian Personal!.',
            confirmButtonText: 'Coba Lagi'
          });
        }
      });
    }
  });
}
}


// ======================================================================= //


// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';  //   CommonModule for directives like ngIf, ngFor
// import { ButtonModule } from 'primeng/button';
// import { CalendarModule } from 'primeng/calendar';
// import { FormsModule } from '@angular/forms';
// import { TableModule } from 'primeng/table';
// import { DialogModule } from 'primeng/dialog';
// import { CheckboxModule } from 'primeng/checkbox';
// import { trigger, transition, style, animate } from '@angular/animations';
// // import { AchievementService } from '../../service/achievement/achievement.service';
// import { GroupAchievementService } from '../../service/group-achievement/group-achievement.service';
// import { DropdownModule } from 'primeng/dropdown';
// import { AchievementService } from '../../service/achievement/achievement.service';
// import { TagModule } from 'primeng/tag';
// import { InputIconModule } from 'primeng/inputicon';
// import { InputTextModule } from 'primeng/inputtext';
// import { IconFieldModule } from 'primeng/iconfield';
// import { EmpAchievementSkillService } from '../../service/emp-achievement-skill/emp-achievement-skill.service';
// import { InputNumberModule } from 'primeng/inputnumber';

// @Component({
//   selector: 'app-emp-achievement-skill',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     ButtonModule,
//     CalendarModule,
//     FormsModule,
//     TableModule,
//     DialogModule,
//     CheckboxModule,
//     DropdownModule,
//     TagModule,
//     InputIconModule,
//     InputTextModule,
//     InputNumberModule,
//     IconFieldModule
//   ],
//   animations: [
//     trigger('dialogAnimation', [
//       transition(':enter', [
//         style({ opacity: 0 }),
//         animate('300ms', style({ opacity: 1 }))
//       ]),
//       transition(':leave', [
//         animate('300ms', style({ opacity: 0 }))
//       ])
//     ])
//   ],
//   templateUrl: './emp-achievement-skill.component.html',
//   styleUrls: ['./emp-achievement-skill.component.css']
// })
// export class EmpAchievementSkillComponent implements OnInit {
//   empAchievementSkills: any[] = [];
//   achievements: any[] = [];
//   users: any[] = [];
//   filteredEmpAchievementSkills: any[] = []; 
//   selectedGroupAchievement: any = null; // Grup yang dipilih
//   groupAchievements: any[] = []; // Untuk menyimpan daftar grup
//   filteredAchievements: any[] = [];
//   empAchievementSkillsMultiple: any[] = [];
//   loading: boolean = true;
//   assessmentYearError: boolean = false;
//   scoreError: boolean = false;
//   empAchievementSkillDialog: boolean = false;
//   empAchievementSkillMultipleDialog: boolean = false;
//   empAchievementSkill: any = { user_id: null, notes: '', achievement_id: null, score: '', assesment_year: '' };
//   searchKeyword: string = ''; 
//   selectedCategory: string = ''; // Kategori yang dipilih dari dropdown
//   searchCategories: any[] = [
//     { label: 'User Full Name', value: 'full_name' },
//     { label: 'Assesment Year', value: 'assessment_year' },
//   ];

//   first: number = 0; // Untuk pagination
//   totalRecords: number = 0; // Total jumlah data yang ada

//   constructor(
//     private  empAchievementSkillService: EmpAchievementSkillService ,
//     private achievementService: AchievementService,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.getAllEmpAchievementSkills();
//     this.getAllAchievements();
//     this.getAllUsers();
//     this.getAllGroupAchievements();
//   }

//   getAllEmpAchievementSkills() {
//     this.loading = true;
//     this.empAchievementSkillService.getAllEmpAchievementSkills(this.first, 5).subscribe({
//       next: (response) => {
//         this.empAchievementSkills = response.content;
//         this.totalRecords = response.totalRecords;
//         this.filteredEmpAchievementSkills = this.empAchievementSkills;
//         this.loading = false;
//         console.log(this.empAchievementSkill);
//       },
//       error: (error) => {
//         console.error('Error fetching achievements:', error);
//         this.loading = false;
//       }
//     });
//   }

//   loadPage(event: any) {
//     this.first = event.first; // Dapatkan halaman yang dipilih
//     this.getAllEmpAchievementSkills(); // Muat ulang data berdasarkan halaman baru
//   }

//   getAllAchievements() {
//     this.empAchievementSkillService.getAllAchievements().subscribe({
//       next: (response) => {
//         console.log('Data Achievements:', response.content);  // Log data untuk memastikan isi array
//         this.achievements = response.content;
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Error fetching achievements:', error);
//         this.loading = false;
//       }
//     });
//   }

//   getAllUsers() {
//     this.empAchievementSkillService.getAllUsers().subscribe({
//       next: (response) => {
//         console.log('Data Users:', response.content);  // Log data untuk memastikan isi array
//         this.users = response.content;
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Error fetching users:', error);
//         this.loading = false;
//       }
//     });
//   }

//   getAllGroupAchievements() {
//     this.empAchievementSkillService.getAllGroupAchievements().subscribe({
//         next: (response) => {
//             console.log('Data Group Achievements:', response);
//             this.groupAchievements = response.content;
//         },
//         error: (error) => {
//             console.error('Error fetching group achievements:', error);
//         }
//     });
// }

//   filterAchievementsByGroup() {
//     if (this.selectedGroupAchievement) {
//       // Filter achievements berdasarkan group yang dipilih
//       this.filteredAchievements = this.achievements.filter(achievement => achievement.group_id === this.selectedGroupAchievement);
//     } else {
//       // Menampilkan semua achievement jika tidak ada group yang dipilih
//       this.filteredAchievements = this.achievements;
//     }
//   }

//   searchData() {
//     if (!this.selectedCategory || this.searchKeyword.trim() === '') {
//       this.filteredEmpAchievementSkills = this.empAchievementSkills; // Jika kategori kosong atau keyword kosong, tampilkan semua data
//     } else {
//       this.filteredEmpAchievementSkills = this.empAchievementSkills.filter(empAchievementSkill => {
//         const value = empAchievementSkill[this.selectedCategory];
//         if (value !== null && value !== undefined) {
//           return value.toString().toLowerCase().includes(this.searchKeyword.toLowerCase());
//         }
//         return false;
//       });
//     }
//   }

//   validateFields() {
//     const { score, assessment_year } = this.empAchievementSkill;
//     this.scoreError = !(score >= 0 && score <= 100);
//     this.assessmentYearError = !(assessment_year >= 2024 && assessment_year <= 2025);
//   }

//   showAddDialog() {
//     console.log('Menampilkan dialog tambah');
//     this.empAchievementSkill =  { user_id: '', notes: '', achievement_id: '', score: '', assesment_year: '' };
//     this.empAchievementSkillDialog = true;
//   }

//   showAddMultipleDialog() {
//     console.log('Menampilkan dialog tambah');
//     this.empAchievementSkill =  { user_id: '', notes: '', achievement_id: '', score: '', assesment_year: '' };
//     this.empAchievementSkillMultipleDialog = true;
//   }

//   editEmpAchievementSkill(empAchievementSkill: any) {
//     console.log('Mengedit empAchievementSkill', empAchievementSkill);
//     this.empAchievementSkill = { ...empAchievementSkill };
//     this.empAchievementSkillDialog = true;
//   }



// saveEmpAchievementSkill() {
//   const dataToSend = {
//     user_id: this.empAchievementSkill.user_id,
//     notes: this.empAchievementSkill.notes,
//     achievement_id: this.empAchievementSkill.achievement_id,
//     score: this.empAchievementSkill.score,
//     assessment_year: this.empAchievementSkill.assessment_year, 
//   };

//   console.log('Data yang dikirim:', dataToSend);

//   if (this.empAchievementSkill.id) {
//     // Pembaruan achievement
//     this.empAchievementSkillService.updateEmpAchievementSkill(this.empAchievementSkill.id, dataToSend).subscribe({
//       next: () => {
//         alert('Emp Achievement Skill updated successfully');
//         this.getAllEmpAchievementSkills();
//         this.empAchievementSkillDialog = false;
//       },
//       error: (error) => {
//         console.error('Error updating Emp Achievement Skill:', error);
//       }
//     });
//   } else {
//     // Menyimpan achievement baru
//     this.empAchievementSkillService.saveEmpAchievementSkill(dataToSend).subscribe({
//       next: () => {
//         alert('Emp Achievement Skill added successfully');
//         this.getAllEmpAchievementSkills();
//         this.empAchievementSkillDialog = false;
//       },
//       error: (error) => {
//         console.error('Error saving Emp Achievement Skill:', error);
//       }
//     });
//   }
// }

// // Save multiple achievement skills
//   saveAllEmpAchievementSkills() {
//     if (this.filteredAchievements && this.filteredAchievements.length > 0) {
//       // Buat array data yang akan dikirim berdasarkan filteredAchievements
//       const dataToSend = this.filteredAchievements.map(achievement => ({
//         user_id: this.empAchievementSkill.user_id,
//         notes: achievement.notes || '', // Pastikan notes tidak kosong
//         achievement_id: achievement.id, // Pastikan ini sesuai dengan struktur achievement
//         score: achievement.score || 0, // Berikan default nilai jika kosong
//         assessment_year: this.empAchievementSkill.assessment_year,
//       }));

//       console.log('Data yang akan dikirim:', dataToSend);

//       this.empAchievementSkillService.saveAllEmpAchievementSkills(dataToSend).subscribe({
//         next: (response) => {
//           alert('Multiple Emp Achievement Skills added successfully');
//           this.getAllEmpAchievementSkills();
//           this.empAchievementSkillMultipleDialog = false;
//           this.filteredAchievements = []; // Reset tabel setelah sukses
//         },
//         error: (error) => {
//           console.error('Error saving multiple achievement skills:', error);
//           alert('Failed to save multiple achievements. Please check console for details.');
//         }
//       });
//     } else {
//       alert('No achievements to save. Please add data to the table.');
//       console.log('No achievements to save:', this.filteredAchievements);
//     }
//   }





//   deleteEmpAchievementSkill(id: string) {
//     if (confirm('Are you sure you want to delete this Emp Achievement Skill?')) {
//       this.empAchievementSkillService.deleteEmpAchievementSkill(id).subscribe({
//         next: () => {
//           alert('Emp Emp Achievement Skill Skill deleted successfully');
//           this.getAllEmpAchievementSkills();
//         },
//         error: (error) => {
//           console.error('Error deleting Emp Achievement Skill:', error);
//         }
//       });
//     }
//   }
// }

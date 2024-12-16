import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpTechnicalSkillService } from '../../service/emp-technical-skill/emp-technical-skill.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Console } from 'node:console';
import Swal from 'sweetalert2';

interface TechnicalSkill {
  id: string;
  technical_skill: string;
  criteria?: string;
  score?: number | null;
  isNew?: boolean;
  isDisabled?: boolean;
}

interface GroupedTechnicalSkill {
  technical_skill: string;
  technical_skill_id: string;
  empSkills: TechnicalSkill[];
}

@Component({
  selector: 'app-emp-technical-skill',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './emp-technical-skill.component.html',
  styleUrls: ['./emp-technical-skill.component.css'],
})
export class EmpTechnicalSkillComponent implements OnInit {
  technicalSkills: TechnicalSkill[] = [];
  technicalSkillsList: TechnicalSkill[] = [];
  isSaving: boolean = false;
  isExistingData: boolean = false;
  assessmentYear: number = new Date().getFullYear();

  groupedTechnicalSkills: GroupedTechnicalSkill[] = [];

  yearOptions = [
    { label: '2023', value: 2023 },
    { label: '2024', value: 2024 },
    { label: '2025', value: 2025 },
  ];

  scoreOptions = [
    { label: 'Excellent', value: 5 },
    { label: 'Good', value: 4 },
    { label: 'Average', value: 3 },
    { label: 'Poor', value: 2 },
    { label: 'Bad', value: 1 },
  ];

  constructor(private empTechnicalSkillService: EmpTechnicalSkillService) {}

  ngOnInit(): void {
    this.loadAllTechnicalSkills();
    this.onYearChange();
  }

  loadAllTechnicalSkills(): void {
    this.empTechnicalSkillService.getAllTechnicalSkills().subscribe({
      next: (response: any) => {
        if (Array.isArray(response.content)) {
          this.technicalSkillsList = response.content.map((skill: any) => ({
            id: skill.id,
            technical_skill: skill.technical_skill,
            criteria: '',
            score: null,
            isNew: true,
            isDisabled: false,
          }));
        } else {
          console.error('Technical skills data is not an array:', response);
          this.technicalSkillsList = []; // Ensure empty array on error
        }
      },
      error: (err) => {
        console.error('Error fetching technical skills list:', err);
      },
    });
  }

  addRow(groupedSkill: GroupedTechnicalSkill): void {
    const newEmpSkill: TechnicalSkill = {
      id: groupedSkill.technical_skill_id, // Atur ID sesuai kebutuhan, bisa diisi dengan ID baru jika ada
      technical_skill: groupedSkill.technical_skill,
      criteria: '',
      score: null,
      isNew: true,
      isDisabled: false,
    };
    groupedSkill.empSkills.push(newEmpSkill);
  }

  // Pastikan untuk mendefinisikan tipe untuk empSkill
  removeRow(groupedSkill: GroupedTechnicalSkill, index: number): void {
    if (index > -1) {
      groupedSkill.empSkills.splice(index, 1);
    }
  }
  // Jika Anda ingin mendefinisikan tipe di dalam onYearChange
  onYearChange(): void {
    const userId = localStorage.getItem('id');
    if (userId)
      this.empTechnicalSkillService
        .getEmpTechnicalSkillsByUserIdAndAssesmentYear(
          userId,
          this.assessmentYear
        )
        .subscribe({
          next: (response: any) => {
            const content = Array.isArray(response.content)
              ? response.content
              : [];
            this.groupedTechnicalSkills = this.technicalSkillsList.map(
              (skill) => {
                const empSkills = content.filter(
                  (empSkill: any) => empSkill.technical_skill_id === skill.id
                );
                return {
                  technical_skill: skill.technical_skill,
                  technical_skill_id: skill.id,
                  empSkills: empSkills.map((empSkill: any) => ({
                    id: empSkill.technical_skill_id,
                    technical_skill: skill.technical_skill,
                    criteria: empSkill.criteria || '',
                    score: empSkill.score ?? null,
                    isNew: false,
                    isDisabled: true, // Set to true for existing data
                  })),
                };
              }
            );
          },
          error: (err) => {
            console.error('Error fetching emp technical skills:', err);
          },
        });
  }

  saveAllEmpTechnicalSkills(): void {
    if (this.groupedTechnicalSkills && this.groupedTechnicalSkills.length > 0) {
      const dataToSend = this.groupedTechnicalSkills.flatMap((groupedSkill) =>
        groupedSkill.empSkills
          .filter((skill) => skill.isNew && skill.criteria)
          .map((skill) => ({
            user_id: localStorage.getItem('id'), // Pastikan nilai ada
            technical_skill_id: skill.id, // Pastikan skill.id tidak kosong
            criteria: skill.criteria, // Pastikan criteria tidak kosong
            score: skill.score,
            assessment_year: this.assessmentYear,
          }))
      );

      if (dataToSend.length > 0) {
        this.isSaving = true;
        this.empTechnicalSkillService
          .saveAllEmpTechnicalSkills(dataToSend)
          .subscribe({
            next: () => {
              this.isSaving = false;
              this.isExistingData = true;
              this.groupedTechnicalSkills.forEach((groupedSkill) => {
                groupedSkill.empSkills.forEach((skill) => {
                  if (skill.isNew) {
                    skill.isDisabled = true;
                    skill.isNew = false;
                  }
                });
              });
              Swal.fire({
                icon: 'success',
                title: 'Sukses!',
                text: 'Berhasil menyimpan Keahlian Teknis Personal!',
              });
            },
            error: (err) => {
              console.error('Error saving technical skills:', err);
              console.log(dataToSend);
              this.isSaving = false;
              Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: 'Gagal menyimpan Keahlian Teknis Personal!',
              });
            },
          });
      } else {
        console.log('No new skills to save.');
      }
    }
  }

  isFormComplete(): boolean {
    return this.groupedTechnicalSkills.every((groupedSkill) =>
      groupedSkill.empSkills.every(
        (skill) => skill.isDisabled || (skill.criteria && skill.score !== null)
      )
    );
  }

  hasDisabledSkills(groupedSkill: GroupedTechnicalSkill): boolean {
    return groupedSkill.empSkills.some((skill) => skill.isDisabled);
  }
}

// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { EmpTechnicalSkillService } from '../../service/emp-technical-skill/emp-technical-skill.service';
// import { CommonModule } from '@angular/common';
// import { TableModule } from 'primeng/table';
// import { DropdownModule } from 'primeng/dropdown';
// import { ButtonModule } from 'primeng/button';
// import { InputTextModule } from 'primeng/inputtext';

// interface TechnicalSkill {
//   id: string;
//   technical_skill: string;
// }

// interface EmpTechnicalSkill {
//   technical_skill_id: string;
//   criteria: string;
//   score: number | null;
//   isExisting?: boolean; // Tambahkan properti ini
// }

// @Component({
//   selector: 'app-emp-technical-skill',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     TableModule,
//     DropdownModule,
//     ButtonModule,
//     InputTextModule,
//   ],
//   templateUrl: './emp-technical-skill.component.html',
//   styleUrls: ['./emp-technical-skill.component.css'],
// })
// export class EmpTechnicalSkillComponent implements OnInit {
//   technicalSkills: TechnicalSkill[] = [];
//   technicalSkillData: {
//     skill: TechnicalSkill;
//     empSkills: EmpTechnicalSkill[];
//   }[] = [];
//   scoreOptions = [
//     { label: 'Ahli (Mampu memberikan solusi dan konsultasi)', value: 100 },
//     { label: 'Advance (Mampu sharing knowledge)', value: 80 },
//     { label: 'Praktisi (Pernah handle project)', value: 60 },
//     { label: 'Advance (Mampu sharing knowledge)', value: 40 },
//     { label: 'Ahli (Mampu memberikan solusi dan konsultasi)', value: 20 },
//   ];
//   isSaving = false;
//   isExistingData: boolean = false;

//   isFormComplete(): boolean {
//     // Pastikan setiap `empSkill` dalam `technicalSkillData` memiliki `criteria` dan `score` yang valid
//     return this.technicalSkillData.every((techSkillData) =>
//       techSkillData.empSkills.every(
//         (empSkill) =>
//           empSkill.criteria &&
//           empSkill.criteria.trim() !== '' &&
//           empSkill.score !== null &&
//           empSkill.score !== undefined
//       )
//     );
//   }

//   constructor(private empTechnicalSkillService: EmpTechnicalSkillService) {}

//   ngOnInit(): void {
//     this.fetchTechnicalSkillOptions();
//   }

//   fetchTechnicalSkillOptions(): void {
//     const userId = localStorage.getItem('id');
//     if (!userId) {
//       alert('Please log in to access your data.');
//       return;
//     }

//     // Fetch all technical skills
//     this.empTechnicalSkillService.getAllTechnicalSkills().subscribe({
//       next: (response) => {
//         if (response.content && Array.isArray(response.content)) {
//           this.technicalSkills = response.content;

//           // Fetch existing EmpTechnicalSkills for the user
//           this.empTechnicalSkillService
//             .getEmpTechnicalSkillByUserId(userId)
//             .subscribe({
//               next: (empSkillsResponse) => {
//                 this.populateFormWithExistingData(empSkillsResponse.content);
//               },
//               error: (error) => {
//                 console.error(
//                   'Error fetching employee technical skills:',
//                   error
//                 );
//                 alert(
//                   'Failed to fetch existing data. You can still add new entries.'
//                 );
//               },
//             });
//         } else {
//           console.error('No technical skills found.');
//         }
//       },
//       error: (error) => {
//         console.error('Error fetching technical skills:', error);
//       },
//     });
//   }

//   populateFormWithExistingData(empSkills: any[]): void {
//     this.technicalSkillData = this.technicalSkills.map((skill) => {
//       const skillEmpSkills = empSkills
//         .filter((empSkill) => empSkill.technical_skill_id === skill.id)
//         .map((empSkill) => ({
//           ...empSkill,
//           isExisting: true, // Tandai sebagai data yang sudah ada di database
//         }));

//       return {
//         skill,
//         empSkills:
//           skillEmpSkills.length > 0
//             ? skillEmpSkills
//             : [
//                 {
//                   technical_skill_id: skill.id,
//                   criteria: '',
//                   score: null,
//                   isExisting: false,
//                 },
//               ],
//       };
//     });
//   }

//   addRow(skillId: string): void {
//     const techSkillData = this.technicalSkillData.find(
//       (data) => data.skill.id === skillId
//     );
//     if (techSkillData) {
//       techSkillData.empSkills.push({
//         technical_skill_id: skillId,
//         criteria: '',
//         score: null,
//         isExisting: false, // Tandai sebagai data baru
//       });
//     }
//   }

//   removeRow(skillId: string, index: number): void {
//     const techSkillData = this.technicalSkillData.find(
//       (data) => data.skill.id === skillId
//     );
//     if (techSkillData) {
//       const empSkill = techSkillData.empSkills[index];
//       if (!empSkill.isExisting) {
//         // Hanya hapus data baru
//         techSkillData.empSkills.splice(index, 1);
//       }
//     }
//   }

//   saveAllEmpTechnicalSkills(): void {
//     const userId = localStorage.getItem('id');
//     const currentYear = new Date().getFullYear();

//     const dataToSave = this.technicalSkillData.flatMap((skillData) =>
//       skillData.empSkills
//         .filter(
//           (empSkill) =>
//             empSkill.criteria.trim() !== '' && empSkill.score !== null
//         ) // Filter out empty rows
//         .map((empSkill) => ({
//           user_id: userId,
//           technical_skill_id: empSkill.technical_skill_id,
//           criteria: empSkill.criteria,
//           score: empSkill.score || 0,
//           assessment_year: currentYear,
//         }))
//     );

//     if (dataToSave.length === 0) {
//       alert(
//         'No valid data to save. Please fill out at least one skill before saving.'
//       );
//       return;
//     }

//     this.isSaving = true;
//     this.empTechnicalSkillService
//       .saveAllEmpTechnicalSkills(dataToSave)
//       .subscribe({
//         next: () => {
//           alert('Technical skills saved successfully!');
//           this.isSaving = false;
//         },
//         error: (error) => {
//           console.error('Error saving technical skills:', error);
//           alert(
//             'Failed to save technical skills. Check the console for details.'
//           );
//           this.isSaving = false;
//         },
//       });
//   }
// }

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
  userName: string | null = '';

  groupedTechnicalSkills: GroupedTechnicalSkill[] = [];

  isAddRowDisabled: boolean = false; // Menyimpan status disabled untuk tombol tambah row

  isFormComplete: boolean = false; // Menyimpan status apakah form lengkap

  yearOptions = [
    { label: '2023', value: 2023 },
    { label: '2024', value: 2024 },
    { label: '2025', value: 2025 },
  ];

  scoreOptions = [
    { label: 'Ahli', value: 5 },
    { label: 'Advance ', value: 4 },
    { label: 'Praktisi', value: 3 },
    { label: 'Memahami', value: 2 },
    { label: 'Berpengatahuan', value: 1 },
  ];

  first: number = 0;

  constructor(private empTechnicalSkillService: EmpTechnicalSkillService) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('full_name');
    this.getAllTechnicalSKills();
    this.onYearChange();
  }

  getAllTechnicalSKills(): void {
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
          // console.error('Technical skills data is not an array:', response);
          this.technicalSkillsList = []; // Ensure empty array on error
        }
      },
      error: (err) => {
        // console.error('Error fetching technical skills list:', err);
      },
    });
  }

  loadPage(event: any) {
    this.first = event.first;
    this.getAllTechnicalSKills();
  }

  addRow(groupedSkill: GroupedTechnicalSkill): void {
    const newEmpSkill: TechnicalSkill = {
      id: groupedSkill.technical_skill_id, // Atur ID sesuai kebutuhan
      technical_skill: groupedSkill.technical_skill,
      criteria: '',
      score: null,
      isNew: true,
      isDisabled: false,
    };
    groupedSkill.empSkills.push(newEmpSkill);
    this.checkFormCompleteness(); // Periksa status form setelah menambahkan baris
  }

  checkFormCompleteness(): void {
    this.isFormComplete = this.groupedTechnicalSkills.some((groupedSkill) =>
      groupedSkill.empSkills.some(
        (skill) => skill.isNew && (!skill.criteria || skill.score === null)
      )
    );
  }

  removeRow(groupedSkill: GroupedTechnicalSkill, index: number): void {
    if (index > -1) {
      groupedSkill.empSkills.splice(index, 1);
    }
  }
  onYearChange(): void {
    const userId = localStorage.getItem('id');
    const currentYear = new Date().getFullYear(); // Ambil tahun saat ini

    // Disable tombol tambah row jika tahun yang dipilih bukan tahun saat ini
    this.isAddRowDisabled = this.assessmentYear !== currentYear;

    if (userId) {
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
                    isDisabled: true,
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
  }

  saveAllEmpTechnicalSkills(): void {
    const currentYear = new Date().getFullYear();

    if (this.groupedTechnicalSkills && this.groupedTechnicalSkills.length > 0) {
      const dataToSend = this.groupedTechnicalSkills.flatMap((groupedSkill) =>
        groupedSkill.empSkills
          .filter((skill) => skill.isNew && skill.criteria)
          .map((skill) => ({
            user_id: localStorage.getItem('id'),
            technical_skill_id: skill.id,
            criteria: skill.criteria,
            score: skill.score,
            assessment_year: currentYear,
          }))
      );

      if (dataToSend.length > 0) {
        Swal.fire({
          html: 'Are you sure you want to save this Personal Technical Skills? <br> Submitted data cannot be changed',
          title: 'Are you sure?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, save it!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.isSaving = true;
            this.empTechnicalSkillService
              .saveAllEmpTechnicalSkills(dataToSend)
              .subscribe({
                next: () => {
                  this.isSaving = false;
                  this.isExistingData = true;
                  this.onYearChange();
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
                    title: 'Success!',
                    text: 'Successfully saved your technical skill!',
                  });
                  // window.location.reload();
                },
                error: (err) => {
                  this.isSaving = false;
                  Swal.fire({
                    icon: 'error',
                    title: 'Failed!',
                    text: 'Failed to save your technical skill!',
                  });
                },
              });
          }
        });
      }
    }
  }

  // isFormComplete(): boolean {
  //   return this.groupedTechnicalSkills.every((groupedSkill) =>
  //     groupedSkill.empSkills.every(
  //       (skill) => skill.isDisabled || (skill.criteria && skill.score !== null)
  //     )
  //   );
  // }

  hasDisabledSkills(groupedSkill: GroupedTechnicalSkill): boolean {
    return groupedSkill.empSkills.some((skill) => skill.isDisabled);
  }
}

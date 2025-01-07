import { Component, OnInit } from '@angular/core';
import { GroupAttitudeSkillService } from '../../service/group-attitude-skill/group-attitude-skill.service';
import { EmpAttitudeSkillService } from '../../service/emp-attitude-skill/emp-attitude-skill.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import Swal from 'sweetalert2';
import { SummaryService } from '../../service/summary/summary.service';

interface AttitudeSkill {
  id: string;
  attitude_skill: string;
  score: number | null;
  user_id: string;
  isNew?: boolean;
  isDisabled?: boolean;
}

interface EmpAttitudeSkill {
  user_id: string;
  attitude_skill_id: string;
  score: number;
  assessment_year: number;
}

interface EmpAttitudeSkillResponse {
  content: EmpAttitudeSkill[];
  total_rows: number;
  info: any;
}

interface GroupAttitudeSkills {
  group_name: string;
  percentage: number;
  attitude_skills: AttitudeSkill[];
}

@Component({
  selector: 'app-emp-attitude-skill',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputNumberModule,
    DropdownModule,
  ],
  templateUrl: './emp-attitude-skill.component.html',
  styleUrls: ['./emp-attitude-skill.component.css'],
})
export class EmpAttitudeSkillComponent implements OnInit {
  attitudeSkills: GroupAttitudeSkills[] = [];
  isSaving: boolean = false;
  isExistingData: boolean = false;
  assessmentYear: number = new Date().getFullYear();
  userName: string | null = '';
  statusAssessment: number | null = 0;
  isScoreDropdownDisabled: boolean = false;
  scoreOptions = [
    { label: 'Sangat Baik', value: 100 },
    { label: 'Baik', value: 80 },
    { label: 'Cukup', value: 60 },
    { label: 'Kurang', value: 40 },
    { label: 'Sangat Kurang', value: 20 },
  ];
  yearOptions = [
    { label: '2023', value: 2023 },
    { label: '2024', value: 2024 },
    { label: '2025', value: 2025 },
  ];

  constructor(
    private groupAttitudeSkillService: GroupAttitudeSkillService,
    private empAttitudeSkillService: EmpAttitudeSkillService,
    private summaryService: SummaryService
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('full_name');
    this.groupAttitudeSkillService
      .getGroupAttitudeSkillsWithDetails()
      .subscribe((response) => {
        if (Array.isArray(response.content)) {
          this.attitudeSkills = response.content;

          const userId = localStorage.getItem('id');
          if (userId) {
            this.onYearChange();
          } else {
          }
        } else {
        }
      });
  }

  onYearChange(): void {
    const userId = localStorage.getItem('id');
    const currentYear = new Date().getFullYear();

    this.isScoreDropdownDisabled = this.statusAssessment == 1;

    if (userId) {
      this.empAttitudeSkillService
        .getEmpAttitudeSkillsByUserIdAndAssesmentYear(
          userId,
          this.assessmentYear
        )
        .subscribe({
          next: (attitudeSkillResponse: EmpAttitudeSkillResponse) => {
            const yearsSet = new Set<number>();
            attitudeSkillResponse.content.forEach(
              (empSkill: EmpAttitudeSkill) => {
                yearsSet.add(empSkill.assessment_year);
              }
            );

            if (attitudeSkillResponse.content.length > 0) {
              this.isExistingData = true;
              this.attitudeSkills.forEach((group: GroupAttitudeSkills) => {
                group.attitude_skills.forEach((skill) => {
                  skill.score = null;
                  skill.isNew = true;
                  skill.isDisabled = false;
                });
              });

              attitudeSkillResponse.content.forEach(
                (empSkill: EmpAttitudeSkill) => {
                  this.attitudeSkills.forEach((group: GroupAttitudeSkills) => {
                    const skill = group.attitude_skills.find(
                      (s) => s.id === empSkill.attitude_skill_id
                    );
                    if (skill) {
                      skill.score = empSkill.score;
                      skill.isNew = false;
                      skill.isDisabled = true;
                    }
                  });
                }
              );
            } else {
              this.isExistingData = false;
              this.attitudeSkills.forEach((group: GroupAttitudeSkills) => {
                group.attitude_skills.forEach((skill) => {
                  skill.score = null;
                  skill.isNew = true;
                  skill.isDisabled = false;
                });
              });
            }
          },
          error: (err) => {},
        });

      this.summaryService
        .getAssessmentStatus(userId, this.assessmentYear)
        .subscribe({
          next: (response) => {
            this.statusAssessment = response.content.status;
            this.isScoreDropdownDisabled = this.statusAssessment == 1;
          },
          error: (error) => {
            this.statusAssessment = 0;
            this.isScoreDropdownDisabled = this.statusAssessment == 1;
          },
        });
    }
  }
  isFormComplete(): boolean {
    const allComplete = this.attitudeSkills.every((group) =>
      group.attitude_skills.every(
        (skill) => skill.score !== null && skill.score !== undefined
      )
    );
    const allDisabled = this.attitudeSkills.every((group) =>
      group.attitude_skills.every((skill) => skill.isDisabled)
    );

    return allComplete && !allDisabled;
  }

  saveAllEmpAttitudeSkills() {
    if (this.attitudeSkills && this.attitudeSkills.length > 0) {
      const currentYear = new Date().getFullYear();
      const dataToSend = this.attitudeSkills.flatMap((group) =>
        group.attitude_skills
          .filter((skill) => skill.score !== null)
          .map((skill) => ({
            user_id: localStorage.getItem('id'),
            attitude_skill_id: skill.id,
            score: skill.score || 0,
            assessment_year: currentYear,
          }))
      );

      this.empAttitudeSkillService
        .saveAllEmpAttitudeSkills(dataToSend)
        .subscribe({
          next: (response) => {
            this.isSaving = false;
            this.isExistingData = true;
            this.attitudeSkills.forEach((group: GroupAttitudeSkills) => {
              group.attitude_skills.forEach((skill) => {
                skill.isDisabled = true;
              });
            });
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully saved your attitude and skills!',
            });
          },
          error: (error) => {
            this.isSaving = false;
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to save your attitude and skills!',
            });
          },
        });
    } else {
    }
  }
}

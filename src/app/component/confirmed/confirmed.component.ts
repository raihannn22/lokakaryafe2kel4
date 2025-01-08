import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { GroupAttitudeSkillService } from '../../service/group-attitude-skill/group-attitude-skill.service';
import { EmpAttitudeSkillService } from '../../service/emp-attitude-skill/emp-attitude-skill.service';
import Swal from 'sweetalert2';
import { SummaryService } from '../../service/summary/summary.service';
import { EmpAchievementSkillService } from '../../service/emp-achievement-skill/emp-achievement-skill.service';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { concatMap, finalize, forkJoin, tap } from 'rxjs';
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
  selector: 'app-confirmed',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputNumberModule,
    DropdownModule,
    ToggleButtonModule,
  ],
  templateUrl: './confirmed.component.html',
  styleUrl: './confirmed.component.css',
})
export class ConfirmedComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() user: any = {};
  @Input() year: number = 0;
  checked: any;

  closeDialog() {
    this.visibleChange.emit(false);
  }

  attitudeSkills: GroupAttitudeSkills[] = [];
  isSaving: boolean = false;
  isExistingData: boolean = false;
  assessmentYear: number = new Date().getFullYear();
  userName: string | null = '';
  users: any[] = [];
  statusAssessment: number | null = 0;
  isScoreDropdownDisabled: boolean = false;
  empAchiements: any[] = [];

  scoreOptions = [
    { label: 'Sangat Baik', value: 100 },
    { label: 'Baik', value: 80 },
    { label: 'Cukup', value: 60 },
    { label: 'Kurang', value: 40 },
    { label: 'Sangat Kurang', value: 20 },
  ];

  constructor(
    private groupAttitudeSkillService: GroupAttitudeSkillService,
    private empAttitudeSkillService: EmpAttitudeSkillService,
    private empAchievementSkillService: EmpAchievementSkillService,
    private summaryService: SummaryService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.userName = localStorage.getItem('full_name');
    this.groupAttitudeSkillService
      .getGroupAttitudeSkillsWithDetails()
      .subscribe((response) => {
        if (Array.isArray(response.content)) {
          this.attitudeSkills = response.content;

          this.onYearChange();
        } else {
        }
      });
  }

  onYearChange(): void {
    const userId = this.user?.user_id;
    

    if (userId) {
      this.empAttitudeSkillService
        .getEmpAttitudeSkillsByUserIdAndAssesmentYear(
          userId,
          this.year
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
                  skill.isDisabled = true;
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
        .getAssessmentStatus(userId, this.year)
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

      this.empAchievementSkillService
        .getAllEmpAchievementSkillsByYearAndUserId(this.year, userId)
        .subscribe({
          next: (response) => {
            this.empAchiements = response.content;
            this.empAchiements.forEach((achievement) => {
              achievement.enabled = true;
            });
          },
          error: (error) => {},
        });
    }
  }

  saveAllEmpAttitudeSkills() {
    const dataAchToSend = this.empAchiements.map(
      ({ enabled, ...rest }) => rest
    );

    const dataToSend = this.attitudeSkills.flatMap((group) =>
      group.attitude_skills
        .filter((skill) => skill.score !== null)
        .map((skill) => ({
          user_id: this.user.user_id,
          attitude_skill_id: skill.id,
          score: skill.score || 0,
          assessment_year: this.year,
        }))
    );

    this.isSaving = true;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Apakah Anda yakin ingin set status summary menjadi Pending?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      customClass: {
        popup: 'custom-swal-popup',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.empAttitudeSkillService
          .saveAllEmpAttitudeSkills(dataToSend)
          .pipe(
            tap(() => {
              this.attitudeSkills.forEach((group: GroupAttitudeSkills) => {
                group.attitude_skills.forEach((skill) => {
                  skill.isDisabled = true;
                });
              });
            }),
            concatMap(() => {
              const updateAchievements$ = dataAchToSend.map((achievement) =>
                this.empAchievementSkillService.updateEmpAchievementSkill(
                  achievement.id,
                  achievement
                )
              );
              return updateAchievements$;
            }),
            concatMap(() => {
              return this.summaryService.setAssessmentStatus1(
                this.user.user_id,
                this.year
              );
            }),
            finalize(() => {
              this.isSaving = false;
            })
          )
          .subscribe({
            next: () => {
              this.visibleChange.emit(false);
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Successfully saved your attitude and skills!',
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              this.closeDialog();
              Swal.fire({
                icon: 'error',
                title: 'Failed!',
                text: 'Failed to save your attitude and skills!',
              });
            },
          });
      }
    });
  }

  onResetAssessment() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Apakah Anda yakin ingin set status summary menjadi Pending?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      customClass: {
        popup: 'custom-swal-popup',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.summaryService
          .setAssessmentStatus0(this.user.user_id, this.year)
          .subscribe({
            next: (data) => {
              const newPassword = data.content;
              this.visibleChange.emit(false);
              Swal.fire({
                title: 'Status Changed!',
                text: 'Status Summary telah diubah menjadi Pending',
                icon: 'success',
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {},
          });
      }
    });
  }
}

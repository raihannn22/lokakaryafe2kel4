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
import { forkJoin } from 'rxjs';
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
  imports: [DialogModule,     
      CommonModule,
      FormsModule,
      ButtonModule,
      TableModule,
      InputNumberModule,
      DropdownModule,
    ToggleButtonModule],
  templateUrl: './confirmed.component.html',
  styleUrl: './confirmed.component.css'
})
export class ConfirmedComponent implements OnInit{
   @Input() visible: boolean = false; // Menyambungkan dengan property di komponen induk
   @Output() visibleChange = new EventEmitter<boolean>(); // Emit perubahan visibility
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
    isScoreDropdownDisabled: boolean = false; //Menyimpan status disabled
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
  
    ngOnInit(): void {
   
    }
    
    ngOnChanges(): void {
      console.log("ini user terbaru", this.year);
      this.userName = localStorage.getItem('full_name');
      this.groupAttitudeSkillService
        .getGroupAttitudeSkillsWithDetails()
        .subscribe((response) => {
          if (Array.isArray(response.content)) {
            // console.log('response', response.content);
            this.attitudeSkills = response.content;
  
            this.onYearChange();
            
          } else {
            // console.error('Response is not an array', response);
          }
        });
        
    }
  
    onYearChange(): void {
      const userId = localStorage.getItem('id');// Ambil tahun saat ini
      // Disable dropdown jika tahun yang dipilih bukan tahun saat ini
      // this.isScoreDropdownDisabled = this.assessmentYear !== currentYear;
  
      if (userId) {
        this.empAttitudeSkillService
          .getEmpAttitudeSkillsByUserIdAndAssesmentYear(
            this.user.user_id,
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
            error: (err) => {
              console.error('Error fetching emp attitude skills:', err);
            },
          });
          
      this.summaryService.getAssessmentStatus(this.user.user_id, this.year).subscribe(
        {next: (response) => {
          this.statusAssessment = response.content.status;
          console.log('Status Assessment:', this.statusAssessment);
          this.isScoreDropdownDisabled = this.statusAssessment == 1;
        }, error: (error) => {
          this.statusAssessment = 0;
          console.log('Status Assessment:', this.statusAssessment);
          console.error('Error fetching assessment status:', error);
          this.isScoreDropdownDisabled = this.statusAssessment == 1;
        }
      });

      this.empAchievementSkillService.getAllEmpAchievementSkillsByYearAndUserId(this.year, this.user.user_id).subscribe({
        next: (response) => {
          this.empAchiements = response.content;
          this.empAchiements.forEach(achievement => {
            achievement.enabled = true; // Tambahkan properti enabled dengan default true
          });
          console.log('ini dia emp ach ', this.empAchiements);
        }, error: (error) => {
          console.error('Error fetching emp attitude skills:', error);
        }
      })
      }
    }
  
    saveAllEmpAttitudeSkills() {
      const dataAchToSend = this.empAchiements.map(({ enabled, ...rest }) => rest);
      
        // const currentYear = new Date().getFullYear();
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

        console.log("ini data yanf dikirikm" , dataToSend);
  
          // Simpan attitude skills terlebih dahulu
        this.empAttitudeSkillService.saveAllEmpAttitudeSkills(dataToSend).subscribe({
          next: () => {
            this.isExistingData = true;
            this.attitudeSkills.forEach((group: GroupAttitudeSkills) => {
              group.attitude_skills.forEach((skill) => {
                skill.isDisabled = true;
              });
            });

      // Update semua achievement skills secara paralel
            const achievementUpdates = dataAchToSend.map((achievement) =>
              this.empAchievementSkillService.updateEmpAchievementSkill(achievement.id, achievement)
            );

            forkJoin(achievementUpdates).subscribe({
              next: () => {
                // Setelah semua achievement selesai, update assessment status
                this.summaryService.setAssessmentStatus1(this.user.user_id, this.year).subscribe({
                  next: () => {
                    this.isSaving = false;
                    this.closeDialog();

                    Swal.fire({
                      icon: 'success',
                      title: 'Success!',
                      text: 'Successfully saved your attitude and skills!',
                    });
                  },
                  error: (error) => {
                    console.error('Error updating assessment status:', error);
                    this.isSaving = false;
                    this.closeDialog();

                    Swal.fire({
                      icon: 'error',
                      title: 'Failed!',
                      text: 'Failed to update assessment status!',
                    });
                  },
                });
              },
              error: (error) => {
                console.error('Error updating achievements:', error);
                this.isSaving = false;
                this.closeDialog();

                Swal.fire({
                  icon: 'error',
                  title: 'Failed!',
                  text: 'Failed to update achievements!',
                });
              },
            });
          },
          error: (error) => {
            console.error('Error saving attitude skills:', error);
            this.isSaving = false;
            this.closeDialog();

            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to save attitude skills!',
            });
          },
        });

        // this.summaryService
        // .setAssessmentStatus1(this.user.user_id, this.year)
        // .subscribe({
        // });

        // this.empAttitudeSkillService
        //   .saveAllEmpAttitudeSkills(dataToSend)
        //   .subscribe({
        //     next: (response) => {
        //       this.isSaving = false;
        //       this.isExistingData = true;
        //       this.attitudeSkills.forEach((group: GroupAttitudeSkills) => {
        //         group.attitude_skills.forEach((skill) => {
        //           skill.isDisabled = true;
        //         });
        //       });
        //       dataAchToSend.forEach((achievement) => {
        //         this.empAchievementSkillService
        //           .updateEmpAchievementSkill(achievement.id, achievement)
        //           .subscribe({
        //           }); 
        //       });
        //       this.closeDialog();
        //       Swal.fire({
        //         icon: 'success',
        //         title: 'Success!',
        //         text: 'Successfully saved your attitude and skills!',
        //       });
        //     },
        //     error: (error) => {
        //       // console.error('Error saving multiple attitude skills:', error);
        //       this.isSaving = false;
        //       this.closeDialog();
              
        //       Swal.fire({
        //         icon: 'error',
        //         title: 'Failed!',
        //         text: 'Failed to save your attitude and skills!',
        //       });
        //     },
        //   });
    }

    onResetAssessment() {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Apakah Anda yakin ingin set status summary menjadi Unconfirmed?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes!',
          customClass: {
            popup: 'custom-swal-popup'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.summaryService.setAssessmentStatus0(this.user.user_id, this.year).subscribe({
    
              next: (data) => {
                const newPassword = data.content
                Swal.fire({
                  title: "Status Changed!",
                  text: 'Status Summary telah diubah menjadi Unconfirmed',
                  icon: "success"
                });
                this.visibleChange.emit(false);
                window.location.reload();
              },
              error: (error) => {
                console.error('Error updating user:', error);
                // Tambahkan penanganan error di sini
              }
            })
          }
        });
      }
}

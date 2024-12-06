import { Component, OnInit } from '@angular/core';
import { GroupAttitudeSkillService } from '../../service/group-attitude-skill/group-attitude-skill.service';
import { EmpAttitudeSkillService } from '../../service/emp-attitude-skill/emp-attitude-skill.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

interface AttitudeSkill {
  id: string;
  attitude_skill: string;
  score: number | null;
  user_id: string;
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
    DropdownModule
  ],
  templateUrl: './emp-attitude-skill.component.html',
  styleUrls: ['./emp-attitude-skill.component.css']
})
export class EmpAttitudeSkillComponent implements OnInit {
  attitudeSkills: { group_name: string, percentage: number, attitude_skills: AttitudeSkill[] }[] = [];
  empAttitudeSkill = {
    assessment_year: '',
    attitude_skill_id: null,
    score: {},
    user_id: null
  };

  isSaving: boolean = false;
  isExistingData: boolean = false;

  // Tambahkan kriteria dropdown
  scoreOptions = [
    { label: 'Sangat Baik', value: 100 },
    { label: 'Baik', value: 80 },
    { label: 'Cukup', value: 60 },
    { label: 'Kurang', value: 40 },
    { label: 'Sangat Kurang', value: 20 }
  ];

  constructor(
    private groupAttitudeSkillService: GroupAttitudeSkillService,
    private empAttitudeSkillService: EmpAttitudeSkillService
  ) {}

  ngOnInit(): void {
    this.groupAttitudeSkillService.getGroupAttitudeSkillsWithDetails().subscribe((response) => {
      if (Array.isArray(response.content)) {
        console.log('response', response.content);
        this.attitudeSkills = response.content;

        const userId = localStorage.getItem('id');
        if (userId) {
          console.log('User ID', userId);

          this.empAttitudeSkillService.getEmpAttitudeSkillByUserId(userId).subscribe({
  next: (attitudeSkillResponse: EmpAttitudeSkillResponse) => {
    console.log('Data Emp Attitude Skill:', attitudeSkillResponse);

    if (Array.isArray(attitudeSkillResponse.content) && attitudeSkillResponse.content.length > 0) {
      this.isExistingData = true;

      attitudeSkillResponse.content.forEach((empSkill: EmpAttitudeSkill) => {
        this.attitudeSkills.forEach((group: GroupAttitudeSkills) => {
          const skill = group.attitude_skills.find(s => s.id === empSkill.attitude_skill_id);
          if (skill) {
            skill.score = empSkill.score; // Update skor berdasarkan data API
          }
        });
      });
    } else {
      this.isExistingData = false;
    }
  },
  error: (err) => {
    console.error('Error fetching emp attitude skills:', err);
  }
});


        } else {
          console.error('User ID is null or undefined');
        }
      } else {
        console.error('Response is not an array', response);
      }
    });
  }

  saveAllEmpAttitudeSkills() {
    if (!this.isExistingData && this.attitudeSkills && this.attitudeSkills.length > 0) {
      const currentYear = new Date().getFullYear();
      const dataToSend = this.attitudeSkills.map(group => {
        return group.attitude_skills.map(skill => ({
          user_id: localStorage.getItem('id'),
          attitude_skill_id: skill.id,
          score: skill.score || 0,
          assessment_year: currentYear,
        }));
      }).flat();

      console.log('Data yang akan dikirim:', dataToSend);

      this.empAttitudeSkillService.saveAllEmpAttitudeSkills(dataToSend).subscribe({
        next: (response) => {
          alert('Multiple Emp Attitude Skills added successfully');
          this.isSaving = false;
          this.isExistingData = true;
        },
        error: (error) => {
          console.error('Error saving multiple attitude skills:', error);
          alert('Failed to save multiple attitude skills. Please check console for details.');
          this.isSaving = false;
        }
      });
    } else {
      alert('Data cannot be saved because it already exists or there is no data to save.');
    }
  }
}


// import { Component, OnInit } from '@angular/core';
// import { GroupAttitudeSkillService } from '../../service/group-attitude-skill/group-attitude-skill.service';
// import { EmpAttitudeSkillService } from '../../service/emp-attitude-skill/emp-attitude-skill.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ButtonModule } from 'primeng/button';
// import { TableModule } from 'primeng/table';
// import { InputNumberModule } from 'primeng/inputnumber';
// import { DropdownModule } from 'primeng/dropdown';

// interface AttitudeSkill {
//   id: string;
//   attitude_skill: string;
//   score: number | null;
//   user_id: string;
// }

// interface GroupAttitudeSkills {
//   group_name: string;
//   percentage: number;
//   attitude_skills: AttitudeSkill[];
// }

// @Component({
//   selector: 'app-emp-attitude-skill',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ButtonModule,
//     TableModule,
//     InputNumberModule,
//     DropdownModule
//   ],
//   templateUrl: './emp-attitude-skill.component.html',
//   styleUrls: ['./emp-attitude-skill.component.css']
// })
// export class EmpAttitudeSkillComponent implements OnInit {
//   attitudeSkills: GroupAttitudeSkills[] = [];
//   isSaving: boolean = false;
  
//   isExistingData: boolean = false;
//   scoreOptions = [
//     { label: 'Sangat Baik', value: 100 },
//     { label: 'Baik', value: 80 },
//     { label: 'Cukup', value: 60 },
//     { label: 'Kurang', value: 40 },
//     { label: 'Sangat Kurang', value: 20 }
//   ];


//   constructor(
//     private groupAttitudeSkillService: GroupAttitudeSkillService,
//     private empAttitudeSkillService: EmpAttitudeSkillService
//   ) {}

//   ngOnInit(): void {
//     this.groupAttitudeSkillService.getGroupAttitudeSkillsWithDetails().subscribe((response) => {
//       if (Array.isArray(response.content)) {
//         console.log('response', response.content);
//         this.attitudeSkills = response.content;

//         const userId = localStorage.getItem('id');
//         if (userId) {
//           console.log('User ID', userId);

//           this.empAttitudeSkillService.getEmpAttitudeSkillByUserId(userId).subscribe({
//             next: (attitudeSkillResponse) => {
//               console.log('Data Emp Attitude Skill:', attitudeSkillResponse);

//               if (Array.isArray(attitudeSkillResponse.content) && attitudeSkillResponse.content.length > 0) {
//                 this.isExistingData = true;

//                 attitudeSkillResponse.content.forEach(empSkill => {
//                   this.attitudeSkills.forEach(group => {
//                     const skill = group.attitude_skills.find(s => s.id === empSkill.attitude_skill_id);
//                     if (skill) {
//                       skill.score = empSkill.score; // Update skor berdasarkan data API
//                     }
//                   });
//                 });
//               } else {
//                 this.isExistingData = false;
//               }
//             },
//             error: (err) => {
//               console.error('Error fetching emp attitude skills:', err);
//             }
//           });

//         } else {
//           console.error('User ID is null or undefined');
//         }
//       } else {
//         console.error('Response is not an array', response);
//       }
//     });
//   }
  
//   saveAllEmpAttitudeSkills() {
//     if (!this.isExistingData && this.attitudeSkills && this.attitudeSkills.length > 0) {
//       const currentYear = new Date().getFullYear();
//       const dataToSend = this.attitudeSkills.map(group => {
//         return group.attitude_skills.map(skill => ({
//           user_id: localStorage.getItem('id'),
//           attitude_skill_id: skill.id,
//           score: skill.score || 0,
//           assessment_year: currentYear,
//         }));
//       }).flat();
      
//       console.log('Data yang akan dikirim:', dataToSend);
      
//       this.empAttitudeSkillService.saveAllEmpAttitudeSkills(dataToSend).subscribe({
//         next: (response) => {
//           alert('Multiple Emp Attitude Skills added successfully');
//           this.isSaving = false;
//           this.isExistingData = true;
//         },
//         error: (error) => {
//           console.error('Error saving multiple attitude skills:', error);
//           alert('Failed to save multiple attitude skills. Please check console for details.');
//           this.isSaving = false;
//         }
//       });
//     } else {
//       alert('Data cannot be saved because it already exists or there is no data to save.');
//     }
//   }
  
  
// }









// ngOnInit(): void {
//   this.groupAttitudeSkillService.getGroupAttitudeSkillsWithDetails().subscribe((response) => {
//     if (Array.isArray(response.content)) {
//       console.log('response', response.content);
//       this.attitudeSkills = response.content;

//       // Mendapatkan user_id dari localStorage
//       const userId = localStorage.getItem('id');
//       if (userId) {
//         console.log('User ID', userId);

//         // Ambil data empAttitudeSkill berdasarkan userId
//         this.empAttitudeSkillService.getEmpAttitudeSkillByUserId(userId).subscribe({
//           next: (attitudeSkillResponse) => {
//             console.log('Data Emp Attitude Skill:', attitudeSkillResponse);

//             // Pastikan response memiliki properti content yang berupa array
//             if (Array.isArray(attitudeSkillResponse.content) && attitudeSkillResponse.content.length > 0) {
//               this.isExistingData = true; // Data sudah ada

//               attitudeSkillResponse.content.forEach(empSkill => {
//                 this.attitudeSkills.forEach(group => {
//                   const skill = group.attitude_skills.find(s => s.id === empSkill.attitude_skill_id);
//                   if (skill) {
//                     skill.score = empSkill.score; // Update skor berdasarkan data API
//                   }
//                 });
//               });
//             } else {
//               this.isExistingData = false; // Data tidak ada
//             }
//           },
//           error: (err) => {
//             console.error('Error fetching emp attitude skills:', err);
//           }
//         });

//       } else {
//         console.error('User ID is null or undefined');
//       }
//     } else {
//       console.error('Response is not an array', response);
//     }
//   });
// }

// saveAllEmpAttitudeSkills() {
//   if (!this.isExistingData && this.attitudeSkills && this.attitudeSkills.length > 0) {
//     const currentYear = new Date().getFullYear();
//     const dataToSend = this.attitudeSkills.map(group => {
//       return group.attitude_skills.map(skill => ({
//         user_id: localStorage.getItem('id'),
//         attitude_skill_id: skill.id,
//         score: skill.score || 0,
//         assessment_year: currentYear,
//       }));
//     }).flat();

//     console.log('Data yang akan dikirim:', dataToSend);

//     this.empAttitudeSkillService.saveAllEmpAttitudeSkills(dataToSend).subscribe({
//       next: (response) => {
//         alert('Multiple Emp Attitude Skills added successfully');
//         this.isSaving = false;
//         this.isExistingData = true; // Set ke true setelah berhasil menyimpan
//       },
//       error: (error) => {
//         console.error('Error saving multiple attitude skills:', error);
//         alert('Failed to save multiple attitude skills. Please check console for details.');
//         this.isSaving = false;
//       }
//     });
//   } else {
//     alert('Data cannot be saved because it already exists or there is no data to save.');
//   }
// }

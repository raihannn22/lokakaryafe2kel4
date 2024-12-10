import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpTechnicalSkillService } from '../../service/emp-technical-skill/emp-technical-skill.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

interface TechnicalSkill {
  id: string;
  technical_skill: string;
}

interface EmpTechnicalSkill {
  technical_skill_id: string;
  criteria: string;
  score: number | null;
  isExisting?: boolean; // Tambahkan properti ini
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
    InputTextModule
  ],
  templateUrl: './emp-technical-skill.component.html',
  styleUrls: ['./emp-technical-skill.component.css'],
})
export class EmpTechnicalSkillComponent implements OnInit {
  technicalSkills: TechnicalSkill[] = [];
  technicalSkillData: { skill: TechnicalSkill; empSkills: EmpTechnicalSkill[] }[] = [];
  scoreOptions = [
    { label: 'Ahli (Mampu memberikan solusi dan konsultasi)', value: 100 },
    { label: 'Advance (Mampu sharing knowledge)', value: 80 },
    { label: 'Praktisi (Pernah handle project)', value: 60 },
    { label: 'Advance (Mampu sharing knowledge)', value: 40 },
    { label: 'Ahli (Mampu memberikan solusi dan konsultasi)', value: 20 },
  ];
  isSaving = false;
  isExistingData: boolean = false;

  isFormComplete(): boolean {
  // Pastikan setiap `empSkill` dalam `technicalSkillData` memiliki `criteria` dan `score` yang valid
  return this.technicalSkillData.every(techSkillData =>
    techSkillData.empSkills.every(empSkill => 
      empSkill.criteria && empSkill.criteria.trim() !== '' && empSkill.score !== null && empSkill.score !== undefined
    )
  );
}


  constructor(private empTechnicalSkillService: EmpTechnicalSkillService) {}

  ngOnInit(): void {
    this.fetchTechnicalSkillOptions();
  }

  fetchTechnicalSkillOptions(): void {
    const userId = localStorage.getItem('id');
    if (!userId) {
      alert('Please log in to access your data.');
      return;
    }

    // Fetch all technical skills
    this.empTechnicalSkillService.getAllTechnicalSkills().subscribe({
      next: (response) => {
        if (response.content && Array.isArray(response.content)) {
          this.technicalSkills = response.content;

          // Fetch existing EmpTechnicalSkills for the user
          this.empTechnicalSkillService.getEmpTechnicalSkillByUserId(userId).subscribe({
            next: (empSkillsResponse) => {
              this.populateFormWithExistingData(empSkillsResponse.content);
            },
            error: (error) => {
              console.error('Error fetching employee technical skills:', error);
              alert('Failed to fetch existing data. You can still add new entries.');
            },
          });
        } else {
          console.error('No technical skills found.');
        }
      },
      error: (error) => {
        console.error('Error fetching technical skills:', error);
      },
    });
  }

  populateFormWithExistingData(empSkills: any[]): void {
  this.technicalSkillData = this.technicalSkills.map((skill) => {
    const skillEmpSkills = empSkills
      .filter((empSkill) => empSkill.technical_skill_id === skill.id)
      .map((empSkill) => ({
        ...empSkill,
        isExisting: true, // Tandai sebagai data yang sudah ada di database
      }));

    return {
      skill,
      empSkills: skillEmpSkills.length > 0
        ? skillEmpSkills
        : [{ technical_skill_id: skill.id, criteria: '', score: null, isExisting: false }],
    };
  });
}



  addRow(skillId: string): void {
  const techSkillData = this.technicalSkillData.find((data) => data.skill.id === skillId);
  if (techSkillData) {
    techSkillData.empSkills.push({
      technical_skill_id: skillId,
      criteria: '',
      score: null,
      isExisting: false, // Tandai sebagai data baru
    });
  }
}



  removeRow(skillId: string, index: number): void {
  const techSkillData = this.technicalSkillData.find((data) => data.skill.id === skillId);
  if (techSkillData) {
    const empSkill = techSkillData.empSkills[index];
    if (!empSkill.isExisting) { // Hanya hapus data baru
      techSkillData.empSkills.splice(index, 1);
    }
  }
}


  saveAllEmpTechnicalSkills(): void {
  const userId = localStorage.getItem('id');
  const currentYear = new Date().getFullYear();

  const dataToSave = this.technicalSkillData.flatMap((skillData) =>
    skillData.empSkills
      .filter((empSkill) => empSkill.criteria.trim() !== '' && empSkill.score !== null) // Filter out empty rows
      .map((empSkill) => ({
        user_id: userId,
        technical_skill_id: empSkill.technical_skill_id,
        criteria: empSkill.criteria,
        score: empSkill.score || 0,
        assessment_year: currentYear,
      }))
  );

  if (dataToSave.length === 0) {
    alert('No valid data to save. Please fill out at least one skill before saving.');
    return;
  }

  this.isSaving = true;
  this.empTechnicalSkillService.saveAllEmpTechnicalSkills(dataToSave).subscribe({
    next: () => {
      alert('Technical skills saved successfully!');
      this.isSaving = false;
    },
    error: (error) => {
      console.error('Error saving technical skills:', error);
      alert('Failed to save technical skills. Check the console for details.');
      this.isSaving = false;
    },
  });
}

}



// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { EmpTechnicalSkillService } from '../../service/emp-technical-skill/emp-technical-skill.service';
// import { CommonModule } from '@angular/common';
// import { TableModule } from 'primeng/table';
// import { DropdownModule } from 'primeng/dropdown';
// import { ButtonModule } from 'primeng/button';

// interface TechnicalSkill {
//   id: string;
//   technical_skill: string;
// }

// interface EmpTechnicalSkill {
//   technical_skill_id: string;
//   criteria: string;
//   score: number | null;
// }

// @Component({
//   selector: 'app-emp-technical-skill',
//   standalone: true,
//   imports: [CommonModule, FormsModule, TableModule, DropdownModule, ButtonModule],
//   templateUrl: './emp-technical-skill.component.html',
//   styleUrls: ['./emp-technical-skill.component.css'],
// })
// export class EmpTechnicalSkillComponent implements OnInit {
//   technicalSkills: TechnicalSkill[] = [];
//   technicalSkillData: { skill: TechnicalSkill; empSkills: EmpTechnicalSkill[] }[] = [];
//   scoreOptions = [
//     { label: 'Excellent', value: 100 },
//     { label: 'Good', value: 80 },
//     { label: 'Average', value: 60 },
//     { label: 'Poor', value: 40 },
//     { label: 'Very Poor', value: 20 },
//   ];
//   isSaving = false;

//   constructor(private empTechnicalSkillService: EmpTechnicalSkillService) {}

//   ngOnInit(): void {
//     this.fetchTechnicalSkillOptions();
//   }

//   fetchTechnicalSkillOptions(): void {
//     this.empTechnicalSkillService.getAllTechnicalSkills().subscribe({
//       next: (response) => {
//         if (response.content && Array.isArray(response.content)) {
//           this.technicalSkills = response.content;
//           // Initialize empTechnicalSkills for each technical skill
//           this.technicalSkills.forEach((skill) => {
//             this.technicalSkillData.push({
//               skill,
//               empSkills: [], // Initialize empty array of emp skills for each technical skill
//             });
//           });
//         } else {
//           console.error('Technical skills are not available');
//         }
//       },
//       error: (error) => {
//         console.error('Error fetching technical skills:', error);
//       },
//     });
//   }

//   addRow(skillId: string): void {
//     // Find the corresponding technical skill and add an empty row for emp technical skill
//     const techSkillData = this.technicalSkillData.find(
//       (data) => data.skill.id === skillId
//     );
//     if (techSkillData) {
//       techSkillData.empSkills.push({
//         technical_skill_id: skillId,
//         criteria: '',
//         score: null,
//       });
//     }
//   }

//   removeRow(skillId: string, index: number): void {
//     const techSkillData = this.technicalSkillData.find(
//       (data) => data.skill.id === skillId
//     );
//     if (techSkillData && techSkillData.empSkills.length > 1) {
//       techSkillData.empSkills.splice(index, 1);
//     }
//   }

//   saveAllEmpTechnicalSkills(): void {
//     const userId = localStorage.getItem('id');
//     const currentYear = new Date().getFullYear();

//     const dataToSave = this.technicalSkillData.flatMap((skillData) =>
//       skillData.empSkills.map((empSkill) => ({
//         user_id: userId,
//         technical_skill_id: empSkill.technical_skill_id,
//         criteria: empSkill.criteria,
//         score: empSkill.score || 0,
//         assessment_year: currentYear,
//       }))
//     );

//     this.isSaving = true;
//     this.empTechnicalSkillService.saveAllEmpTechnicalSkills(dataToSave).subscribe({
//       next: () => {
//         alert('Technical skills saved successfully!');
//         this.isSaving = false;
//       },
//       error: (error) => {
//         console.error('Error saving technical skills:', error);
//         alert('Failed to save technical skills. Check the console for details.');
//         this.isSaving = false;
//       },
//     });
//   }
// }

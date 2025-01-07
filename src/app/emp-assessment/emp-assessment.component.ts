import { Component } from '@angular/core';
import { EmpAttitudeSkillComponent } from '../component/emp-attitude-skill/emp-attitude-skill.component';
import { EmpDevplanComponent } from '../component/emp-devplan/emp-devplan.component';
import { EmpSuggestionComponent } from '../component/emp-suggestion/emp-suggestion.component';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { CommonModule } from '@angular/common';
import { EmpTechnicalSkillComponent } from '../component/emp-technical-skill/emp-technical-skill.component';

@Component({
  selector: 'app-emp-assessment',
  standalone: true,
  imports: [
    EmpAttitudeSkillComponent,
    EmpTechnicalSkillComponent,
    EmpDevplanComponent,
    EmpSuggestionComponent,
    ButtonModule,
    StepsModule,
    CommonModule,
    EmpTechnicalSkillComponent,
  ],
  templateUrl: './emp-assessment.component.html',
  styleUrl: './emp-assessment.component.css',
})
export class EmployeeAssessmentComponent {
  activeIndex = 0;
  steps = [
    { label: 'Attitude Skill' },
    { label: 'Technical Skill' },
    { label: 'Development Plan' },
    { label: 'Suggestion' },
  ];

  next() {
    if (this.activeIndex < this.steps.length - 1) {
      this.activeIndex++;
    }
  }

  prev() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }
}

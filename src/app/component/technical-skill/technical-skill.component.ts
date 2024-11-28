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
import { TechnicalSkillService } from '../../service/technical-skill/technical-skill.service';

@Component({
  selector: 'app-technical-skill',
  standalone: true,
  imports: [
    CommonModule, // Use CommonModule instead of BrowserModule
    ButtonModule,
    CalendarModule,
    FormsModule,
    TableModule,
    DialogModule,
    CheckboxModule
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
  templateUrl: './technical-skill.component.html',
  styleUrls: ['./technical-skill.component.css']
})
export class TechnicalSkillComponent implements OnInit {
  technicalSkills: any[] = [];
  loading: boolean = true;
  technicalSkillDialog: boolean = false;
  technicalSkill: any = { group_name: '', percentage: null, enabled: false };

  constructor(
    private technicalSkillService: TechnicalSkillService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllTechnicalSkills();
  }

  getAllTechnicalSkills() {
    this.technicalSkillService.getAllTechnicalSkills().subscribe({
      next: (response) => {
        this.technicalSkills = response.content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching technical skills:', error);
        this.loading = false;
      }
    });
  }

  showAddDialog() {
    console.log('Menampilkan dialog tambah');
    this.technicalSkill = { group_name: '', percentage: null, enabled: 1 };
    this.technicalSkillDialog = true;
  }

  editTechnicalSkill(technicalSkill: any) {
    console.log('Mengedit Technical Skill', technicalSkill);
    this.technicalSkill = { ...technicalSkill };
    this.technicalSkillDialog = true;
  }

  saveTechnicalSkill() {
    console.log('Data yang dikirim:', this.technicalSkill);
    if (this.technicalSkill.id) {
      this.technicalSkillService.updateTechnicalSkill(this.technicalSkill.id, this.technicalSkill).subscribe({
        next: () => {
          alert('Technical Skill updated successfully');
          this.getAllTechnicalSkills();
          this.technicalSkillDialog = false;
        },
        error: (error) => {
          console.error('Error updating Technical Skill:', error);
        }
      });
    } else {
      this.technicalSkillService.saveTechnicalSkill(this.technicalSkill).subscribe({
        next: () => {
          alert('Technical Skill added successfully');
          this.getAllTechnicalSkills();
          this.technicalSkillDialog = false;
        },
        error: (error) => {
          console.error('Error saving Technical Skill:', error);
        }
      });
    }
  }

  deleteTechnicalSkill(id: string) {
    if (confirm('Are you sure you want to delete this Technical Skill?')) {
      this.technicalSkillService.deleteTechnicalSkill(id).subscribe({
        next: () => {
          alert('Technical Skill deleted successfully');
          this.getAllTechnicalSkills();
        },
        error: (error) => {
          console.error('Error deleting Technical Skill:', error);
        }
      });
    }
  }
}

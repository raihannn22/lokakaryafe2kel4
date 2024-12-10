import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { SummaryService } from '../../summary.service';
import { get } from 'http';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [DialogModule, TableModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit{
  @Input() visible: boolean = false; // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>(); // Emit perubahan visibility
  @Input() user: any = {};
  attitudeSkill: any[] = [];
  achievement: any[] = [];

  closeDialog() {
    this.visibleChange.emit(false);
  }

  constructor(private summaryService: SummaryService) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('ini data user di sumary', this.user.id);
      this.getAllEmpAttitudeSkill();
      this.getAllEmpAchievement();
    
  }

  getAllEmpAttitudeSkill() {
    this.summaryService.getEmpAttitudeSkillById(this.user.id).subscribe({
      next: (response) => {
        this.attitudeSkill = response.content; // Data ada di 'content'
        console.log('ini isi atitudeskilnya:',  this.attitudeSkill);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }


  getAllEmpAchievement() {
    this.summaryService.getEmpAchievementById(this.user.id).subscribe({
      next: (response) => {
        this.achievement = response.content; // Data ada di 'content'
        console.log('ini isi achievemtnya:',  this.achievement);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  mapData(attitudeSkills: any[], achievements: any[]): any[] {
    const groupedData: any = [];
  
    attitudeSkills = this.attitudeSkill;
    achievements = this.achievement;
    // Proses Attitude Skills
    attitudeSkills.forEach((item) => {
      groupedData.push({
        group: item.goup_attitude_skill_name,
        name: item.attitude_skill_name,
        score: item.score,
        source: 'Attitude' // Tambahkan sumber
      });
    });
  
    // Proses Achievements
    achievements.forEach((item) => {
      groupedData.push({
        group: item.group_achievement_name,
        name: item.achievement_name,
        score: item.score,
        source: 'Achievement' // Tambahkan sumber
      });
    });
  
    return groupedData;
  }
  

  
}

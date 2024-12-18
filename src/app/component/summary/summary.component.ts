import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { SummaryService } from '../../service/summary/summary.service';
import { get } from 'http';
import { CommonModule, NgIf } from '@angular/common';
import { forkJoin } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

interface Item {
  group: string;
  percentage: number;
  score: number;
  source: string;
}
interface GroupedItem {
  group: string;
  percentage: number;
  score: number;
  count: number;
  source: string;
}
@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [DialogModule, TableModule, CommonModule, DropdownModule, FormsModule, ButtonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit{
  @Input() visible: boolean = false; // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>(); // Emit perubahan visibility
  @Input() user: any = {};
  @Input() year: number = new Date().getFullYear()
  attitudeSkill: any[] = [];
  achievement: any[] = [];
  groupedAchievement: any[] = [];
  combinedData: any[] = []; 
  groupedData: any[] = [];
  normalizedData: any = [];
  suggestion: any = [];

  totalPercentage: number = 0;
  totalFinalScore: number = 0;
  yearsTitle: number= 0;

  selectedYear: number = 0;
  years: number[] = [
    2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
    2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046,
    2047, 2048, 2049, 2050,
  ];

  onYearChange(event: any) {
  }

  submit() {
    this.getAllEmpAchievement();
    this.yearsTitle = this.selectedYear
  }
  constructor(private summaryService: SummaryService) {
  }

  ngOnInit() {
    
  }

  ngOnChanges() {
    this.getAllEmpAchievement();
    this.selectedYear = this.year;
    this.yearsTitle = this.year;
  }

  closeDialog() {
    this.visibleChange.emit(false);
  }

  getAllEmpAchievement() {
    forkJoin({
      suggestion:  this.summaryService.getAllSuggestionByYear(this.user.id, this.selectedYear),
      empAtt :  this.summaryService.getEmpAttitudeSkillByIdandYear(this.user.id, this.selectedYear),
      emppAchievement:  this.summaryService.getEmpAchievementByIdandYear(this.user.id, this.selectedYear),
      groupAchievement: this.summaryService.getAllAchievements()
    }).subscribe(({emppAchievement, groupAchievement, empAtt, suggestion}) => {
      this.achievement = emppAchievement.content;
      this.groupedAchievement = groupAchievement.content;
      this.attitudeSkill = empAtt.content;
      this.suggestion = suggestion.content; 
      
        this.groupedAchievement = this.groupedAchievement.map(group => {
          const matchingAchievements = this.achievement.filter(ach => ach.achievement_id === group.id);
          const score = matchingAchievements.length > 0 
            ? matchingAchievements.reduce((sum, ach) => sum + ach.score, 0) 
            : 0;
      
          return {
            ...group,
            score
          };
        });
        this.mapData();
        this.groupedData = this.groupAndSumData(this.combinedData);
        this.totalPercentage = this.groupedData.reduce((total, item) => total + item.percentage, 0);
        this.totalFinalScore = this.groupedData.reduce((total, item) => total + (item.score * (item.percentage)/100), 0);
        console.log(this.groupedData);
    })

  
  }

  mapData() {
    this.combinedData = [];

    this.attitudeSkill.forEach((item) => {
      this.combinedData.push({
        group: item.group_attitude_skill_name || 'Attitude',
        percentage: item.group_attitude_skill_percentage,
        score: item.score,
        source: 'Attitude' 
      });
    });

    this.groupedAchievement.forEach((item) => {
      this.combinedData.push({
        group: item.group_name || 'Achievement', 
        percentage: item.group_percentage,
        score: item.score,
        source: 'Achievement' 
      });
    });
  }

  groupAndSumData(data: Item[]): GroupedItem[] {
   // Menggunakan reduce untuk mengelompokkan data dan menghitung total score per group
   const groupedData = data.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = {
        group: item.group,
        percentage: item.percentage,
        score: 0,
        count: 0,
        source: item.source, // Tambahkan source di awal
      };
    }

    acc[item.group].score += item.score; // Tambahkan skor
    acc[item.group].count += 1;         // Hitung jumlah item

    return acc;
  }, {} as Record<string, GroupedItem>);

  return Object.values(groupedData).map((item) => ({
    group: item.group,
    percentage: item.percentage,
    score: item.score / item.count, // Membagi total score dengan jumlah item
    count: item.count,              // Menambahkan count agar tetap ada di hasil akhir
    source: item.source,            // Tambahkan source
  }));

}





// normalizePercentages(data: any[]): any[] {
//   // Hitung total percentage saat ini
//   const totalPercentage = data.reduce((acc, item) => acc + item.percentage, 0);

//   // Normalisasi percentage untuk setiap grup
//   return data.map((item) => ({
//     ...item,
//     percentage: (item.percentage / totalPercentage) * 100, // Sesuaikan untuk total 100%
//   }));
// }

  

}
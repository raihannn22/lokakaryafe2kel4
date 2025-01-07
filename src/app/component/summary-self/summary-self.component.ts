import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { SummaryService } from '../../service/summary/summary.service';
import { CommonModule, NgIf } from '@angular/common';
import { forkJoin } from 'rxjs';
import { EmpSuggestionComponent } from '../emp-suggestion/emp-suggestion.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ButtonModule } from 'primeng/button';
interface Item {
  name: string;
  group: string;
  percentage: number;
  score: number;
  group_enabled: number;
  enabled : number;
  source: string;
  
}
interface GroupedItem {
  group: string;
  percentage: number;
  score: number;
  count: number;
  group_enabled: number;
  enabled : number;
  source: string;
  details: { name: string; score: number }[]; 
}
@Component({
  selector: 'app-summary-self',
  standalone: true,
  imports: [DialogModule, TableModule, CommonModule, DropdownModule, FormsModule, EmpSuggestionComponent, ButtonModule ],
  templateUrl: './summary-self.component.html',
  styleUrl: './summary-self.component.css'
})
export class SummarySelfComponent {

  attitudeSkill: any[] = [];
  achievement: any[] = [];
  groupedAchievement: any[] = [];
  combinedData: any[] = [];
  groupedData: any[] = [];
  normalizedData: any = [];
  userId: any = '';
  years: number[] = [
    2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
    2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046,
    2047, 2048, 2049, 2050,
  ];
  selectedYear: number = 2024;
  totalPercentage: number = 0;
  totalFinalScore: number = 0;

  constructor(private summaryService: SummaryService) {
  }


  ngOnInit() {
      this.userId = localStorage.getItem('id');
      // this.getAllEmpAttitudeSkill();
      this.getAll();

  }

  onYearChange(event: any){
    console.log(this.selectedYear, 'ini selected year');
    this.getAll();
  }

  ngOnChanges() {

  }

  getAll() {
    forkJoin({
      empAtittudeSkill:  this.summaryService.getEmpAttitudeSkillByIdandYear(this.userId, this.selectedYear),
      empAchievement:  this.summaryService.getEmpAchievementByIdandYear(this.userId, this.selectedYear),
      groupAchievement: this.summaryService.getAllAchievements()
    }).subscribe(({empAchievement, groupAchievement, empAtittudeSkill}) => {
      this.achievement = empAchievement.content;
      console.log('ini Achievement:', this.achievement)
      this.groupedAchievement = groupAchievement.content;
      console.log('Group Achievement:', this.groupedAchievement)
      this.attitudeSkill = empAtittudeSkill.content; // Data ada di 'content'
      console.log('ini isi attitude skill:', this.attitudeSkill);


      this.groupedAchievement = this.groupedAchievement.map(group => {
        const matchingAchievements = this.achievement.filter(ach => ach.achievement_id === group.id);
        const score = matchingAchievements.length > 0
          ? matchingAchievements.reduce((sum, ach) => sum + ach.score, 0)
          : 0;

        return {
          ...group,
          score // Tambahkan score ke dalam setiap grup
        };

      });
      console.log('Processed Group Achievement:', this.groupedAchievement);


      this.mapData();
      this.groupedData = this.groupAndSumData(this.combinedData);
      console.log('ini',this.groupedData);

      // Hitung total percentage
      this.totalPercentage = this.groupedData.reduce((total, item) => total + item.percentage, 0);

      // Hitung final score
      this.totalFinalScore = this.groupedData.reduce((total, item) => total + (item.score * (item.percentage)/100), 0);
    });
  }

  mapData() {
    this.combinedData = [];
  
    // Proses Attitude Skill
    this.attitudeSkill
      .filter((item) => item.group_enabled === 1 && item.enabled === 1) // Abaikan item yang disabled
      .forEach((item) => {
        this.combinedData.push({
          group: item.group_attitude_skill_name || 'Attitude',
          percentage: item.group_attitude_skill_percentage,
          score: item.score,
          enabled: item.enabled,
          group_enabled: item.group_enabled,
          source: 'Attitude',
          name: item.attitude_skill_name, // Gunakan nama attitude skill
        });
      });
  
    // Proses Achievement
    this.groupedAchievement
      .filter((item) => item.group_enabled === 1 && item.enabled === 1) // Abaikan item yang disabled
      .forEach((item) => {
        this.combinedData.push({
          group: item.group_name || 'Achievement',
          percentage: item.group_percentage,
          score: item.score,
          enabled: item.enabled,
          group_enabled: item.group_enabled,
          source: 'Achievement',
          name: item.achievement, // Gunakan nama achievement
        });
      });
  }
  

  groupAndSumData(data: Item[]): GroupedItem[] {
    const groupedData = data.reduce((acc, item) => {
      if (item.group_enabled === 0 || item.enabled === 0) {
        return acc;
      }
  
      if (!acc[item.group]) {
        acc[item.group] = {
          group: item.group,
          percentage: item.percentage,
          score: 0,
          count: 0,
          enabled: item.enabled,
          group_enabled: item.group_enabled,
          source: item.source,
          details: [], // Tambahkan array untuk menyimpan detail
        };
      }
  
      acc[item.group].score += item.score; // Tambahkan skor
      acc[item.group].count += 1; // Hitung jumlah item
  
      // Tambahkan detail item ke dalam array
      acc[item.group].details.push({
        name: item.name, // Nama dari attitude_skill_name atau achievement
        score: item.score, // Skor item
      });
  
      return acc;
    }, {} as Record<string, GroupedItem>);
  
    return Object.values(groupedData).map((item) => ({
      group: item.group,
      percentage: item.percentage,
      score: item.score / item.count, // Skor rata-rata
      count: item.count,
      enabled: item.enabled,
      group_enabled: item.group_enabled,
      source: item.source,
      details: item.details, // Tambahkan details ke hasil akhir
    }));
  }

  dataJson = [
    { "id": 1, "name": "John", "score": 90 },
    { "id": 2, "name": "Jane", "score": 85 },
    { "id": 3, "name": "Doe", "score": 92 }
  ];

   // Fungsi untuk mengekspor data JSON ke file Excel
   exportToExcel() {
    let exportData = [];
    let merges = [];
    let rowIndex = 0;
    let groupedBySource = this.groupBy(this.groupedData, 'source');

    for (let source in groupedBySource) {
      let sourceData = groupedBySource[source];
      exportData.push({ Group: 'Source: ' + source, Name: '', Score: '', Percentage: '', TotalPercentage: '', Source: '' });
      merges.push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 5 } });
      rowIndex++;

      sourceData.forEach((group: { details: any[]; percentage: number; group: any; source: any; }) => {
        let averageScore = this.calculateAverageScore(group.details);
        let totalPercentage = averageScore * (group.percentage / 100);

        exportData.push({
          Group: group.group,
          Name: '',
          Score: averageScore,
          Percentage: group.percentage,
          TotalPercentage: totalPercentage.toFixed(2),
          Source: group.source
        });

        group.details.forEach(detail => {
          exportData.push({
            Group: '',
            Name: detail.name,
            Score: detail.score,
            Percentage: '',
            TotalPercentage: '',
            Source: ''
          });
        });
      });
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    ws['!merges'] = merges;

    // Menyesuaikan lebar kolom berdasarkan panjang konten
    const colWidths = this.calculateColumnWidths(exportData);
    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    XLSX.writeFile(wb, 'data.xlsx');
  }

  groupBy(data: any[], key: string) {
    return data.reduce((result, currentValue) => {
      const groupKey = currentValue[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentValue);
      return result;
    }, {});
  }

  calculateAverageScore(details: any[]) {
    let totalScore = details.reduce((sum, detail) => sum + detail.score, 0);
    return totalScore / details.length;
  }

  // Fungsi untuk menyesuaikan lebar kolom berdasarkan panjang teks
  calculateColumnWidths(data: any[]) {
    const colWidths: { wpx: number; }[] = [];
    const columns = Object.keys(data[0]);
    
    columns.forEach((column, index) => {
      let maxLength = column.length;
      data.forEach(row => {
        const cellValue = String(row[column]);
        maxLength = Math.max(maxLength, cellValue.length);
      });
      colWidths.push({ wpx: maxLength * 7 }); // Set lebar kolom sesuai panjang teks, kalikan dengan 10 untuk menyesuaikan
    });

    return colWidths;
  }

}



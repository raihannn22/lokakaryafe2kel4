import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { SummaryService } from '../../summary.service';
import { CommonModule, NgIf } from '@angular/common';
import { forkJoin } from 'rxjs';
import { EmpSuggestionComponent } from '../emp-suggestion/emp-suggestion.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-summary-self',
  standalone: true,
  imports: [DialogModule, TableModule, CommonModule, DropdownModule, FormsModule, EmpSuggestionComponent ],
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
      this.getAllEmpAchievement();
 
  }

  onYearChange(event: any){
    console.log(this.selectedYear, 'ini selected year');
    this.getAllEmpAchievement();
  }

  ngOnChanges() {


  }



  // getAllEmpAttitudeSkill() {
  //   this.summaryService.getEmpAttitudeSkillById(this.userId).subscribe({
  //     next: (response) => {
  //       this.attitudeSkill = response.content; // Data ada di 'content'
  //       console.log('ini isi attitude skill:', this.attitudeSkill);
  //       this.mapData(); // Lakukan mapping setelah data attitude diterima
  //     },
  //     error: (error) => {
  //       console.error('Error fetching attitude skills:', error);
  //     },
  //   });
  // }

  getAllEmpAchievement() {
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
    // Gabungkan data dari attitudeSkill dan achievement
    this.combinedData = [];

    // Mapping untuk attitude skills
    this.attitudeSkill.forEach((item) => {
      this.combinedData.push({
        group: item.group_attitude_skill_name || 'Attitude', // Grup dari attitude
        percentage: item.group_attitude_skill_percentage,
        score: item.score,
        source: 'Attitude' // Sumber data
      });
    });

    // Mapping untuk achievements
    this.groupedAchievement.forEach((item) => {
      this.combinedData.push({
        group: item.group_name || 'Achievement', // Grup dari achievement
        percentage: item.group_percentage,
        score: item.score,
        source: 'Achievement' // Sumber data
      });
    });

    console.log('Data gabungan:', this.combinedData);
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

  // Mengubah objek yang sudah dikelompokkan menjadi array dan membagi score dengan jumlah item
  return Object.values(groupedData).map((item) => ({
    group: item.group,
    percentage: item.percentage,
    score: item.score / item.count, // Membagi total score dengan jumlah item
    count: item.count,              // Menambahkan count agar tetap ada di hasil akhir
    source: item.source,            // Tambahkan source
  }));

}

}
function then(arg0: () => void) {
  throw new Error('Function not implemented.');
}


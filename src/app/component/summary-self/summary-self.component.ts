import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { SummaryService } from '../../summary.service';
import { get } from 'http';
import { CommonModule, NgIf } from '@angular/common';
import { forkJoin } from 'rxjs';
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
  imports: [DialogModule, TableModule, CommonModule, NgIf,],
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

  constructor(private summaryService: SummaryService) {
  }

  ngOnInit() {
      this.userId = localStorage.getItem('id');
      this.getAllEmpAttitudeSkill();
      this.getAllEmpAchievement();
 
  }

  ngOnChanges() {

  
  }



  getAllEmpAttitudeSkill() {
    this.summaryService.getEmpAttitudeSkillById(this.userId).subscribe({
      next: (response) => {
        this.attitudeSkill = response.content; // Data ada di 'content'
        console.log('ini isi attitude skill:', this.attitudeSkill);
        this.mapData(); // Lakukan mapping setelah data attitude diterima
      },
      error: (error) => {
        console.error('Error fetching attitude skills:', error);
      },
    });

   
  }

  getAllEmpAchievement() {
    forkJoin({
      empAtittudeSkill:  this.summaryService.getEmpAttitudeSkillById(this.userId),
      empAchievement:  this.summaryService.getEmpAchievementById(this.userId),
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


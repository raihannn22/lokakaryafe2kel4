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
  selector: 'app-summary',
  standalone: true,
  imports: [DialogModule, TableModule, CommonModule, NgIf,],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit{
 
  @Input() visible: boolean = false; // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>(); // Emit perubahan visibility
  @Input() user: any = {};
  attitudeSkill: any[] = [];
  achievement: any[] = [];
  groupedAchievement: any[] = [];
  combinedData: any[] = []; 
  groupedData: any[] = [];
  normalizedData: any = [];

  totalPercentage: number = 0;
  totalFinalScore: number = 0;

  constructor(private summaryService: SummaryService) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('ini data user di summary', this.user.id);
    this.getAllEmpAttitudeSkill();
    this.getAllEmpAchievement();
    this.groupedData = this.groupAndSumData(this.combinedData);
    this.totalPercentage = this.groupedData.reduce((total, item) => total + item.percentage, 0);
    this.totalFinalScore = this.groupedData.reduce((total, item) => total + (item.score * (item.percentage)/100), 0);
;
  }

  closeDialog() {
    this.visibleChange.emit(false);
  }

  getAllEmpAttitudeSkill() {
    this.summaryService.getEmpAttitudeSkillById(this.user.id).subscribe({
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
    // this.summaryService.getEmpAchievementById(this.user.id).subscribe({
    //   next: (response) => {
    //     this.achievement = response.content; // Data ada di 'content'
    //     console.log('ini isi achievement:', this.achievement);
    //     this.mapData(); // Lakukan mapping setelah data achievement diterima
    //   },
    //   error: (error) => {
    //     console.error('Error fetching achievements:', error);
    //   },
    // });

    forkJoin({
      emppAchievement:  this.summaryService.getEmpAchievementById(this.user.id),
      groupAchievement: this.summaryService.getAllAchievements()
    }).subscribe(({emppAchievement, groupAchievement}) => {
      this.achievement = emppAchievement.content;
      console.log('ini Achievement:', this.achievement)
      this.groupedAchievement = groupAchievement.content;
      console.log('Group Achievement:', this.groupedAchievement)
    })   

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
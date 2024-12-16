import { Component, OnInit } from '@angular/core';
import { SummaryService } from '../../service/summary/summary.service';
import { forkJoin } from 'rxjs';
import { UserService } from '../../service/user/user.service';
import { CommonModule } from '@angular/common';
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
  selector: 'app-full-ass-sum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './full-ass-sum.component.html',
  styleUrl: './full-ass-sum.component.css'
})
export class FullAssSumComponent implements OnInit {

  constructor(private summaryService: SummaryService, private userService: UserService) { }

  selectedYear: number = 2024
  achievement: any[] = []
  attitudeSkill: any[] = []
  groupedAchievement: any[] = []
  combinedData: any[] = []
  oldUsers: any[] = [];
  ngOnInit(): void {
this.getAll();
  }

  getAll() {
    forkJoin({
      empAtittudeSkill: this.summaryService.getEmpAttitudeSkillByYear(this.selectedYear),
      empAchievement: this.summaryService.getEmpAchievementByYear(this.selectedYear),
      groupAchievement: this.summaryService.getAllAchievements(),
      User : this.userService.getAllUsers()
    }).subscribe(({ empAchievement, groupAchievement, empAtittudeSkill , User}) => {
      this.achievement = empAchievement.content;
      console.log('Semua Achievement:', this.achievement);
      this.groupedAchievement = groupAchievement.content;
      console.log('Group Achievement:', this.groupedAchievement);
      this.attitudeSkill = empAtittudeSkill.content;
      console.log('Semua Attitude Skill:', this.attitudeSkill);
      this.oldUsers = User.content; // Asumsikan data pengguna ada di 'content'
      console.log('Total users:', this.oldUsers);

      // Grupkan dan proses data per pengguna
      const userIds = [...new Set(this.achievement.map((ach) => ach.user_id))];
      this.combinedData = userIds.map((userId) => {
        const userAttitudes = this.attitudeSkill.filter((att) => att.user_id === userId);
        const userAchievements = this.achievement.filter((ach) => ach.user_id === userId);

        // Gabungkan data attitude dan achievement
        const combinedData = this.mapUserData(userAttitudes, userAchievements);
        const groupedData = this.groupAndSumData(combinedData);

        // Hitung total score
        const totalScore = groupedData.reduce((total, group) => {
          return total + (group.score * (group.percentage / 100));
        }, 0);

        return {
          userId,
          userName: this.getUserNameById(userId), // Ganti sesuai cara mendapatkan nama user
          groupedData,
          totalScore // Tambahkan total score per user
        };
      });

      console.log('Data Semua User:', this.combinedData);
    });
  }

  // getAllUsers() {
  //   this.userService.getAllUsers().subscribe({
  //     next: (response) => {
  //       this.oldUsers = response.content; // Asumsikan data pengguna ada di 'content'
  //       console.log('Total users:', this.oldUsers);
  //     },
  //     error: (error) => {
  //       console.error('Error fetching users:', error);
  //     },
  //   });
  // }

  getUserNameById(userId: number): string {
    const user = this.oldUsers.find((user) => user.id === userId);
    return user ? user.full_name : 'Unknown User'; // Gunakan properti yang sesuai
  }

  mapUserData(userAttitudes: any[], userAchievements: any[]) {
    const combinedData: { group: any; percentage: any; score: any; source: string; }[] = [];

    // Mapping untuk attitude skills
    userAttitudes.forEach((item) => {
      combinedData.push({
        group: item.group_attitude_skill_name || 'Attitude', // Grup dari attitude
        percentage: item.group_attitude_skill_percentage,
        score: item.score,
        source: 'Attitude' // Sumber data
      });
    });

    // Mapping untuk achievements
    userAchievements.forEach((item) => {
      combinedData.push({
        group: item.group_name || 'Achievement', // Grup dari achievement
        percentage: item.group_percentage,
        score: item.score,
        source: 'Achievement' // Sumber data
      });
    });

    return combinedData;
  }

  groupAndSumData(data: Item[]): GroupedItem[] {
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = {
          group: item.group,
          percentage: item.percentage,
          score: 0,
          count: 0,
          source: item.source,
        };
      }

      acc[item.group].score += item.score; // Tambahkan skor
      acc[item.group].count += 1;

      return acc;
    }, {} as Record<string, GroupedItem>);

    return Object.values(groupedData).map((item) => ({
      group: item.group,
      percentage: item.percentage,
      score: item.score / item.count, // Rata-rata score
      count: item.count,
      source: item.source,
    }));
  }



}

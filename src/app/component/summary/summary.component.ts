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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';

interface Item {
  name: string;
  group: string;
  percentage: number;
  score: number;
  group_enabled: number;
  enabled: number;
  source: string;
}
interface GroupedItem {
  group: string;
  percentage: number;
  score: number;
  count: number;
  group_enabled: number;
  enabled: number;
  source: string;

  details: { name: string; score: number }[];
}
@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    DialogModule,
    TableModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
})
export class SummaryComponent implements OnInit {
  @Input() visible: boolean = false; // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>(); // Emit perubahan visibility
  @Input() user: any = {};
  @Input() year: number = new Date().getFullYear();

  attitudeSkill: any[] = [];
  achievement: any[] = [];
  groupedAchievement: any[] = [];
  combinedData: any[] = [];
  groupedData: any[] = [];
  normalizedData: any = [];
  suggestion: any = [];

  totalPercentage: number = 0;
  totalFinalScore: number = 0;
  yearsTitle: number = 0;

  selectedYear: number = 0;
  years: number[] = [
    2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
    2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046,
    2047, 2048, 2049, 2050,
  ];

  onYearChange(event: any) {}

  submit() {
    this.getAllEmpAchievement();
    this.yearsTitle = this.selectedYear;
  }
  constructor(private summaryService: SummaryService) {}

  ngOnInit() {}

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
      suggestion: this.summaryService.getAllSuggestionByYear(
        this.user.id,
        this.selectedYear
      ),
      empAtt: this.summaryService.getEmpAttitudeSkillByIdandYear(
        this.user.id,
        this.selectedYear
      ),
      emppAchievement: this.summaryService.getEmpAchievementByIdandYear(
        this.user.id,
        this.selectedYear
      ),
      groupAchievement: this.summaryService.getAllAchievements(),
    }).subscribe(
      ({ emppAchievement, groupAchievement, empAtt, suggestion }) => {
        this.achievement = emppAchievement.content;
        this.groupedAchievement = groupAchievement.content;
        this.attitudeSkill = empAtt.content;
        this.suggestion = suggestion.content;

        this.groupedAchievement = this.groupedAchievement.map((group) => {
          const matchingAchievements = this.achievement.filter(
            (ach) => ach.achievement_id === group.id
          );
          const score =
            matchingAchievements.length > 0
              ? matchingAchievements.reduce((sum, ach) => sum + ach.score, 0)
              : 0;

          return {
            ...group,
            score,
          };
        });
        this.mapData();
        this.groupedData = this.groupAndSumData(this.combinedData);
        this.totalPercentage = this.groupedData.reduce(
          (total, item) => total + item.percentage,
          0
        );
        this.totalFinalScore = this.groupedData.reduce(
          (total, item) => total + (item.score * item.percentage) / 100,
          0
        );
        console.log(this.groupedData, 'ini grouped data');
        console.log(this.groupedAchievement, 'ini grouped achievement');
        console.log(this.attitudeSkill, 'ini attitude skill');
      }
    );
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

  printPDF() {
    const pdf = new jsPDF();

    const fullName = this.user.full_name || 'Unknown';
    const year = this.selectedYear || 'Unknown Year';
    const fileName = `Assessment Summary - ${fullName} - ${year}.pdf`;

    const title = `${fullName}'s Assessment Summary - ${year}`;

    // Menambahkan judul
    pdf.setFontSize(18);
    pdf.text(title, 14, 22);

    // Define headers for the single table
    const headers = ['Aspect', 'Score', 'Weight', 'Final Score'];

    // Prepare data for the table
    const tableData: string[][] = []; // Declare tableData with type

    // Loop through groupedData to populate tableData
    this.groupedData.forEach((group) => {
      // Add group achievement data
      tableData.push([
        group.group, // Aspect: Group Name
        group.score.toFixed(2), // Score: Group Score
        group.percentage + '%', // Weight: Group Weight
        ((group.score * group.percentage) / 100).toFixed(2), // Final Score: Group Final Score
      ]);

      // Add attitude skills under the respective group
      group.details.forEach((detail: { name: string; score: number }) => {
        tableData.push([
          detail.name, // Aspect: Skill Name
          detail.score.toFixed(2), // Score: Skill Score
          '', // Weight: Empty
          '', // Final Score: Empty
        ]);
      });
    });

    // Add total row at the end of the table
    const totalWeight = this.groupedData.reduce(
      (total, item) => total + item.percentage,
      0
    );
    tableData.push([
      'Total:', // Aspect: Total
      '', // Score: Empty
      totalWeight + '%', // Weight: Total Weight
      this.totalFinalScore.toFixed(2), // Final Score: Total Final Score
    ]);

    // Generate the table with row colors
    autoTable(pdf, {
      head: [headers],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [192, 192, 192], // Gray for header
        textColor: [0, 0, 0], // Black text for header
        fontSize: 12,
        fontStyle: 'bold', // Bold for header
      },
      didParseCell: (data) => {
        // Set background color for total row

        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fillColor = [192, 192, 192]; // Gray for total row
          data.cell.styles.fontStyle = 'bold'; // Bold for total row
        } else {
          // Normal style for other rows
          data.cell.styles.fillColor = [255, 255, 255]; // White for other rows
          data.cell.styles.fontStyle = 'normal'; // Normal for other rows
        }
      },
      margin: { top: 30 },
    });

    // Menyiapkan posisi untuk bagian saran
    let startY = (pdf as any).lastAutoTable.finalY + 20;

    // Menyimpan PDF dengan nama file
    pdf.save(fileName);
  }
}

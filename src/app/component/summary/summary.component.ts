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
import * as XLSX from 'xlsx';
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
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
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
    const userId = this.user?.id;
  if (userId) {
  forkJoin({
    suggestion: this.summaryService.getAllSuggestionByYear(
      userId,
      this.selectedYear
    ),
    empAtt: this.summaryService.getEmpAttitudeSkillByIdandYear(
      userId,
      this.selectedYear
    ),
    emppAchievement: this.summaryService.getEmpAchievementByIdandYear(
      userId,
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
    }
  );
} else {
  console.warn('ID tidak tersedia');
}
   
  }

  mapData() {
    this.combinedData = [];

    this.attitudeSkill
      .filter((item) => item.group_enabled === 1 && item.enabled === 1)
      .forEach((item) => {
        this.combinedData.push({
          group: item.group_attitude_skill_name || 'Attitude',
          percentage: item.group_attitude_skill_percentage,
          score: item.score,
          enabled: item.enabled,
          group_enabled: item.group_enabled,
          source: 'Attitude',
          name: item.attitude_skill_name,
        });
      });

    this.groupedAchievement
      .filter((item) => item.group_enabled === 1 && item.enabled === 1)
      .forEach((item) => {
        this.combinedData.push({
          group: item.group_name || 'Achievement',
          percentage: item.group_percentage,
          score: item.score,
          enabled: item.enabled,
          group_enabled: item.group_enabled,
          source: 'Achievement',
          name: item.achievement,
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
          details: [],
        };
      }

      acc[item.group].score += item.score;
      acc[item.group].count += 1;

      acc[item.group].details.push({
        name: item.name,
        score: item.score,
      });

      return acc;
    }, {} as Record<string, GroupedItem>);

    return Object.values(groupedData).map((item) => ({
      group: item.group,
      percentage: item.percentage,
      score: item.score / item.count,
      count: item.count,
      enabled: item.enabled,
      group_enabled: item.group_enabled,
      source: item.source,
      details: item.details,
    }));
  }

  printToPDF() {
    const pdf = new jsPDF();
    const tableColumn = ['Aspect', 'Score', 'Weight', 'Final Score'];
    const tableRows: any[] = [];
    const fullName = this.user.full_name || 'Unknown';
    const year = this.selectedYear || 'Unknown Year';

    tableRows.push([
      {
        content: 'Employee Name:',
        styles: { halign: 'left', fontStyle: 'bold' },
      },
      {
        content: fullName,
        colSpan: 3,
        styles: { halign: 'left' },
      },
    ]);
    tableRows.push([
      {
        content: 'Assessment Year:',
        styles: { halign: 'left', fontStyle: 'bold' },
      },
      {
        content: year,
        colSpan: 3,
        styles: { halign: 'left' },
      },
    ]);

    this.groupedData.forEach((group) => {
      tableRows.push([
        {
          content: group.group,
          styles: {
            fillColor: [211, 211, 211],
            fontStyle: 'bold',
            halign: 'center',
          },
        },
        {
          content: group.score.toFixed(2),
          styles: { halign: 'center' },
        },
        {
          content: group.percentage + '%',
          styles: { halign: 'center' },
        },
        {
          content: ((group.score * group.percentage) / 100).toFixed(2),
          styles: { halign: 'center' },
        },
      ]);

      group.details.forEach((detail: { name: string; score: number }) => {
        tableRows.push([
          `${detail.name}`,
          'Score:',
          detail.score.toFixed(2),
          '',
        ]);
      });
    });

    const totalWeight = this.groupedData.reduce(
      (total, item) => total + item.percentage,
      0
    );
    tableRows.push([
      {
        content: 'Total Score:',
        colSpan: 3,
        styles: { halign: 'center', fontStyle: 'bold' },
      },
      {
        content: this.totalFinalScore.toFixed(2),
        styles: { halign: 'center' },
      },
    ]);

    autoTable(pdf, {
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { cellPadding: 2, fontSize: 10 },
      columnStyles: {
        0: {},
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
      },
      margin: { top: 10 },
    });

    const fileName = `Assessment Summary - ${fullName} - ${year}.pdf`;
    pdf.save(fileName);
  }

  printToExcel() {
    const wb = XLSX.utils.book_new();
    const wsData = [];
    const fullName = this.user.full_name || 'Unknown';
    const year = this.selectedYear || 'Unknown Year';

    wsData.push(['Employee Name:', fullName, '', '']);
    wsData.push(['Assessment Year:', year, '', '']);
    wsData.push(['', '', '', '']);
    wsData.push(['Aspect', 'Score', 'Weight', 'Final Score']);

    let maxAspectLength = 'Aspect'.length;

    this.groupedData.forEach((group) => {
      wsData.push([
        {
          v: group.group,
          s: {
            fill: { rgb: 'D3D3D3' },
            font: { bold: true },
            alignment: { horizontal: 'center', wrapText: true },
          },
        },
        {
          v: group.score.toFixed(2),
          s: { alignment: { horizontal: 'center' } },
        },
        {
          v: group.percentage + '%',
          s: { alignment: { horizontal: 'center' } },
        },
        {
          v: ((group.score * group.percentage) / 100).toFixed(2),
          s: { alignment: { horizontal: 'center' } },
        },
      ]);

      maxAspectLength = Math.max(maxAspectLength, group.group.length);

      group.details.forEach((detail: any) => {
        wsData.push([
          {
            v: `- ${detail.name}`,
            s: { alignment: { horizontal: 'left' } },
          },
          {
            v: detail.score.toFixed(2),
            s: { alignment: { horizontal: 'center' } },
          },
          '',
          '',
        ]);

        maxAspectLength = Math.max(maxAspectLength, detail.name.length + 2);
      });
    });

    const totalWeight = this.groupedData.reduce(
      (total, item) => total + item.percentage,
      0
    );
    wsData.push([
      {
        v: 'Total Score:',
        s: { alignment: { horizontal: 'center' }, font: { bold: true } },
      },
      '',
      {
        v: totalWeight + '%',
        s: { alignment: { horizontal: 'center' } },
      },
      {
        v: this.totalFinalScore.toFixed(2),
        s: { alignment: { horizontal: 'center' } },
      },
    ]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Assessment Summary');

    const aspectColumnWidth = Math.min(
      Math.max(maxAspectLength * 10, 100),
      300
    );
    ws['!cols'] = [
      { wpx: aspectColumnWidth },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
    ];

    const fileName = `Assessment_Summary_${fullName}_${year}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
}

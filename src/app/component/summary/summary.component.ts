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

  printToPDF() {
    const pdf = new jsPDF();
    const tableColumn = ['Aspect', 'Score', 'Weight', 'Final Score'];
    const tableRows: any[] = [];
    const fullName = this.user.full_name || 'Unknown';
    const year = this.selectedYear || 'Unknown Year';

    // Menambahkan informasi pengguna dan tahun
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

    // Loop through groupedData untuk mengisi tableRows
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

      // Menambahkan detail sikap di bawah grup yang sesuai
      group.details.forEach((detail: { name: string; score: number }) => {
        tableRows.push([
          `${detail.name}`,
          'Score:',
          detail.score.toFixed(2),
          '',
        ]);
      });
    });

    // Menambahkan total di akhir tabel
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

    // Menghasilkan tabel
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

    // Menyimpan PDF dengan nama file
    const fileName = `Assessment Summary - ${fullName} - ${year}.pdf`;
    pdf.save(fileName);
  }

  // printToExcel() {
  //   const wb = XLSX.utils.book_new();
  //   const wsData = [];
  //   const fullName = this.user.full_name || 'Unknown';
  //   const year = this.selectedYear || 'Unknown Year';

  //   // Menambahkan informasi pengguna dan tahun
  //   wsData.push(['Employee Name:', fullName, '', '']);
  //   wsData.push(['Assessment Year:', year, '', '']);
  //   wsData.push(['', '', '', '']); // Baris kosong untuk pemisah
  //   wsData.push(['Aspect', 'Score', 'Weight', 'Final Score']);

  //   // Variabel untuk menyimpan panjang maksimum kolom "Aspect"
  //   let maxAspectLength = 'Aspect'.length; // Mulai dengan panjang header

  //   // Loop melalui groupedData untuk mengisi wsData
  //   this.groupedData.forEach((group) => {
  //     wsData.push([
  //       {
  //         v: group.group,
  //         s: {
  //           fill: { rgb: 'D3D3D3' },
  //           font: { bold: true },
  //           alignment: { horizontal: 'center', wrapText: true }, // Rata tengah
  //         },
  //       },
  //       {
  //         v: group.score.toFixed(2),
  //         s: { alignment: { horizontal: 'center' } }, // Rata tengah
  //       },
  //       {
  //         v: group.percentage + '%',
  //         s: { alignment: { horizontal: 'center' } }, // Rata tengah
  //       },
  //       {
  //         v: ((group.score * group.percentage) / 100).toFixed(2),
  //         s: { alignment: { horizontal: 'center' } }, // Rata tengah
  //       },
  //     ]);

  //     // Update panjang maksimum untuk kolom "Aspect"
  //     maxAspectLength = Math.max(maxAspectLength, group.group.length);

  //     // Menambahkan detail sikap di bawah grup yang sesuai
  //     group.details.forEach((detail: { name: string; score: number }) => {
  //       wsData.push([
  //         {
  //           v: `- ${detail.name}`,
  //           s: { alignment: { horizontal: 'left' } }, // Rata kiri
  //         },
  //         {
  //           v: detail.score.toFixed(2),
  //           s: { alignment: { horizontal: 'center' } }, // Rata tengah
  //         },
  //         '',
  //         '',
  //       ]);

  //       // Update panjang maksimum untuk detail
  //       maxAspectLength = Math.max(maxAspectLength, detail.name.length); // +2 untuk menambahkan '- '
  //     });
  //   });

  //   // Menambahkan total di akhir tabel
  //   const totalWeight = this.groupedData.reduce(
  //     (total, item) => total + item.percentage,
  //     0
  //   );
  //   wsData.push([
  //     {
  //       v: 'Total Score:',
  //       s: { alignment: { horizontal: 'center' }, font: { bold: true } }, // Rata tengah dan teks tebal
  //     },
  //     '',
  //     {
  //       v: totalWeight + '%',
  //       s: { alignment: { horizontal: 'center' } }, // Rata tengah
  //     },
  //     {
  //       v: this.totalFinalScore.toFixed(2),
  //       s: { alignment: { horizontal: 'center' } }, // Rata tengah
  //     },
  //   ]);

  //   // Mengonversi data ke worksheet
  //   const ws = XLSX.utils.aoa_to_sheet(wsData);
  //   XLSX.utils.book_append_sheet(wb, ws, 'Assessment Summary');

  //   // Mengatur lebar kolom
  //   const aspectColumnWidth = Math.min(Math.max(maxAspectLength * 10, 100)); // Lebar kolom untuk Aspect, minimal 100px dan maksimal 300px
  //   ws['!cols'] = [
  //     { wpx: aspectColumnWidth }, // Lebar kolom untuk Aspect
  //     { wpx: 100 }, // Lebar kolom untuk Score
  //     { wpx: 100 }, // Lebar kolom untuk Weight
  //     { wpx: 100 }, // Lebar kolom untuk Final Score
  //   ];

  //   // Menyimpan file Excel
  //   const fileName = `Assessment_Summary_${fullName}_${year}.xlsx`;
  //   XLSX.writeFile(wb, fileName);
  // }

  printToExcel() {
    const wb = XLSX.utils.book_new();
    const wsData = [];
    const fullName = this.user.full_name || 'Unknown';
    const year = this.selectedYear || 'Unknown Year';

    // Menambahkan informasi pengguna dan tahun
    wsData.push(['Employee Name:', fullName, '', '']);
    wsData.push(['Assessment Year:', year, '', '']);
    wsData.push(['', '', '', '']); // Baris kosong untuk pemisah
    wsData.push(['Aspect', 'Score', 'Weight', 'Final Score']);

    // Variabel untuk menyimpan panjang maksimum kolom "Aspect"
    let maxAspectLength = 'Aspect'.length; // Mulai dengan panjang header

    // Loop melalui groupedData untuk mengisi wsData
    this.groupedData.forEach((group) => {
      wsData.push([
        {
          v: group.group,
          s: {
            fill: { rgb: 'D3D3D3' },
            font: { bold: true },
            alignment: { horizontal: 'center', wrapText: true }, // Rata tengah
          },
        },
        {
          v: group.score.toFixed(2),
          s: { alignment: { horizontal: 'center' } }, // Rata tengah
        },
        {
          v: group.percentage + '%',
          s: { alignment: { horizontal: 'center' } }, // Rata tengah
        },
        {
          v: ((group.score * group.percentage) / 100).toFixed(2),
          s: { alignment: { horizontal: 'center' } }, // Rata tengah
        },
      ]);

      // Update panjang maksimum untuk kolom "Aspect"
      maxAspectLength = Math.max(maxAspectLength, group.group.length);

      // Menambahkan detail sikap di bawah grup yang sesuai
      group.details.forEach((detail: any) => {
        wsData.push([
          {
            v: `- ${detail.name}`,
            s: { alignment: { horizontal: 'left' } }, // Rata kiri
          },
          {
            v: detail.score.toFixed(2),
            s: { alignment: { horizontal: 'center' } }, // Rata tengah
          },
          '',
          '',
        ]);

        // Update panjang maksimum untuk detail
        maxAspectLength = Math.max(maxAspectLength, detail.name.length + 2); // +2 untuk menambahkan '- '
      });
    });

    // Menambahkan total di akhir tabel
    const totalWeight = this.groupedData.reduce(
      (total, item) => total + item.percentage,
      0
    );
    wsData.push([
      {
        v: 'Total Score:',
        s: { alignment: { horizontal: 'center' }, font: { bold: true } }, // Rata tengah dan teks tebal
      },
      '',
      {
        v: totalWeight + '%',
        s: { alignment: { horizontal: 'center' } }, // Rata tengah
      },
      {
        v: this.totalFinalScore.toFixed(2),
        s: { alignment: { horizontal: 'center' } }, // Rata tengah
      },
    ]);

    // Mengonversi data ke worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Assessment Summary');

    // Mengatur lebar kolom
    const aspectColumnWidth = Math.min(
      Math.max(maxAspectLength * 10, 100),
      300
    ); // Lebar kolom untuk Aspect, minimal 100px dan maksimal 300px
    ws['!cols'] = [
      { wpx: aspectColumnWidth }, // Lebar kolom untuk Aspect
      { wpx: 100 }, // Lebar kolom untuk Score
      { wpx: 100 }, // Lebar kolom untuk Weight
      { wpx: 100 }, // Lebar kolom untuk Final Score
    ];

    // Menyimpan file Excel
    const fileName = `Assessment_Summary_${fullName}_${year}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
}

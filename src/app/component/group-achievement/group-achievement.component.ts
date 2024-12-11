import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { GroupAchievementService } from '../../service/group-achievement/group-achievement.service';
import { CommonModule } from '@angular/common';  // Import CommonModule for directives like ngIf, ngFor
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { trigger, transition, style, animate } from '@angular/animations';
import { GroupAchievementService } from '../../service/group-achievement/group-achievement.service';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import Swal from 'sweetalert2';
import { SummaryService } from '../../summary.service';
import { GroupAttitudeSkillService } from '../../service/group-attitude-skill/group-attitude-skill.service';
import { forkJoin } from 'rxjs';
import { group } from 'console';
import { MessageModule } from 'primeng/message';


@Component({
  selector: 'app-group-achievement',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule,
    CalendarModule,
    FormsModule,
    TableModule,
    DialogModule,
    CheckboxModule,
    DropdownModule,
    TagModule,
    InputIconModule,
    InputTextModule,
    IconFieldModule,
    MessageModule
  ],
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ],
  templateUrl: './group-achievement.component.html',
  styleUrls: ['./group-achievement.component.css']
})
export class GroupAchievementComponent implements OnInit {
  groupAchievements: any[] = [];
  filteredGroupAchievements: any[] = []; 
  loading: boolean = true;
  groupAchievementDialog: boolean = false;
  groupAchievement: any = { group_name: '', percentage: null, enabled: false };
  searchKeyword: string = ''; 
  selectedCategory: string = ''; // Kategori yang dipilih dari dropdown
  searchCategories: any[] = [
    { label: 'Group Name', value: 'group_name' },
    { label: 'Percentage', value: 'percentage' },
  ];

  percent: number = 100;

  first: number = 0;
  totalRecords: number = 0;
  atitudeSkills: any[] = [];
  

  percentageAchieved: any[] = [];
  percentageAttitude: any[] = [];
  totalPercentageAttitude: number = 0;
  totalPercentageAchieved: number = 0;
  totalPercentage: number = 0;
  userPercentage:number = 0;

  constructor(
    private groupAchievementService: GroupAchievementService,
    private router: Router,
    private atitudeSkillService: GroupAttitudeSkillService
  ) {}

  ngOnInit() {
  
    forkJoin({
      groupAchievement: this.groupAchievementService.getAllGroupAchievements(this.first, 5),
      attitudeSkill: this.atitudeSkillService.getGroupAttitudeSkillsWithDetails()
    }).subscribe(({groupAchievement, attitudeSkill}) => {
      this.groupAchievements = groupAchievement.content;
      console.log('Group Achievement:', this.groupAchievements)
      this.totalRecords = groupAchievement.totalRecords;
      this.filteredGroupAchievements = this.groupAchievements;
      this.loading = false;
      this.percentageAchieved = this.groupAchievements.map((item) => item.percentage);
      this.totalPercentageAchieved= this.percentageAchieved.reduce((acc, item) => acc + item, 0);


      this.atitudeSkills = attitudeSkill.content;
        this.percentageAttitude = this.atitudeSkills.map((item) => item.percentage);
        this.totalPercentageAttitude = this.percentageAttitude.reduce((acc, item) => acc + item, 0);


        this.sumPercentage();
    })    
  }

  async tempMethod(): Promise <void> {
    await Promise.all([
      this.getAllGroupAchievements()]).
      finally(() => this.sumPercentage());
  }
  


  getAllGroupAchievements() {
    this.loading = true;
    this.groupAchievementService.getAllGroupAchievements(this.first, 5).subscribe({
      next: (response) => {
        this.groupAchievements = response.content;
        console.log('Group Achievement:', this.groupAchievements)
        this.totalRecords = response.totalRecords;
        this.filteredGroupAchievements = this.groupAchievements;
        this.loading = false;
        this.percentageAchieved = this.groupAchievements.map((item) => item.percentage);
        this.totalPercentageAchieved= this.percentageAchieved.reduce((acc, item) => acc + item, 0);
        console.log(this.totalPercentageAchieved);
      },
      error: (error) => {
        console.error('Error fetching achievements:', error);
        this.loading = false;
      },
      

    });


   
  }


  sumPercentage(){
    this.totalPercentage = this.totalPercentageAttitude + this.totalPercentageAchieved;
    console.log('ttal' , this.totalPercentage);
  }
 



  loadPage(event: any) {
    this.first = event.first; // Dapatkan halaman yang dipilih
    this.getAllGroupAchievements(); // Muat ulang data berdasarkan halaman baru
  }

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 }
  ];

  searchData() {
    if (!this.selectedCategory || this.searchKeyword.trim() === '') {
      // Jika kategori atau keyword kosong, tampilkan semua data
      this.filteredGroupAchievements = this.groupAchievements;
    } else {
      this.filteredGroupAchievements = this.groupAchievements.filter(groupAchievement => {
        const value = groupAchievement[this.selectedCategory];
        if (this.selectedCategory === 'percentage') {
          // Bandingkan sebagai numerik
          return value != null && value.toString().includes(this.searchKeyword);
        }
        // Bandingkan sebagai string
        return value?.toLowerCase().includes(this.searchKeyword.toLowerCase());
      });
    }
  }


  validateMaxValue(event: any): void {
    const maxValue = this.totalPercentage;
    console.log(maxValue);
    const inputValue = Number(event.target.value);

    if (inputValue > maxValue) {
      window.alert(`Nilai tidak boleh lebih dari ${maxValue}. Mohon dapat disesuaikan.`);
    }
  }

  showAddDialog() {
    console.log('Menampilkan dialog tambah');
    this.groupAchievement = { group_name: '', percentage: null, enabled: 1 };
    this.groupAchievementDialog = true;
  }

  editGroupAchievement(groupAchievement: any) {
    console.log('Mengedit group achievement', groupAchievement);
    this.groupAchievement = { ...groupAchievement };
    this.userPercentage = this.groupAchievement.percentage
    console.log(this.userPercentage , 'ini user percentagenya');
    console.log(this.totalPercentage , 'total persentase');
    this.groupAchievementDialog = true;
  }

  saveGroupAchievement() {
    if (this.groupAchievement.id){
      const maxValue = 100 - this.totalPercentage + this.userPercentage;
      if (this.groupAchievement.percentage > maxValue) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menyimpan',
          text: `Nilai Percentage tidak boleh lebih dari ${maxValue}.`,
          confirmButtonText: 'Kembali',
          // style: {
          //   'z-index': 9999
          // }
          customClass: {
            popup: 'custom-swal-popup'
          }
        });
        return;
      }
    }else{
      const maxValue = 100 - this.totalPercentage;
      if (this.groupAchievement.percentage > maxValue) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menyimpan',
          text: `Nilai Percentage tidak boleh lebih dari ${maxValue}.`,
          confirmButtonText: 'Kembali',
          // style: {
          //   'z-index': 9999
          // }
          customClass: {
            popup: 'custom-swal-popup'
          }
        });
        return;
    }
  }


    // Validasi nilai percentage
    console.log('Data yang dikirim:', this.groupAchievement);
    if (this.groupAchievement.id) {
      this.groupAchievementService.updateGroupAchievement(this.groupAchievement.id, this.groupAchievement).subscribe({
        next: () => {
          alert('Group Achievement updated successfully');
          this.getAllGroupAchievements();
          this.groupAchievementDialog = false;
          window.location.reload()
        },
        error: (error) => {
          console.error('Error updating group achievement:', error);
        }
      });
    } else {
      this.groupAchievementService.saveGroupAchievement(this.groupAchievement).subscribe({
        next: () => {
          alert('Group Achievement added successfully');
          this.getAllGroupAchievements();
          this.groupAchievementDialog = false;
          window.location.reload()
        },
        error: (error) => {
          console.error('Error saving group achievement:', error);
        }
      });
    }
  }

  deleteGroupAchievement(id: string) {
    if (confirm('Are you sure you want to delete this group achievement?')) {
      this.groupAchievementService.deleteGroupAchievement(id).subscribe({
        next: () => {
          alert('Group Achievement deleted successfully');
          this.getAllGroupAchievements();
        },
        error: (error) => {
          console.error('Error deleting group achievement:', error);
        }
      });
    }
  }
}

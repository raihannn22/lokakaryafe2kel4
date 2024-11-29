import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // Import CommonModule for directives like ngIf, ngFor
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { trigger, transition, style, animate } from '@angular/animations';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { AttitudeSkillService } from '../../service/attitude-skill/attitude-skill.service';
import { GroupAttitudeSkillService } from '../../service/group-attitude-skill/group-attitude-skill.service';

@Component({
  selector: 'app-attitude-skill',
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
    IconFieldModule
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
  templateUrl: './attitude-skill.component.html',
  styleUrls: ['./attitude-skill.component.css']
})
export class AttitudeSkillComponent implements OnInit {
  attitudeSkills: any[] = [];
  groupAttitudeSkills: any[] = [];
  filteredAttitudeSkills: any[] = []; 
  loading: boolean = true;
  attitudeSkillDialog: boolean = false;
  attitudeSkill: any = { attitudeSkill: '', group_id: null, enabled: false };
  searchKeyword: string = ''; 
  selectedCategory: string = ''; // Kategori yang dipilih dari dropdown
  searchCategories: any[] = [
    { label: 'Group Name', value: 'group_name' },
    { label: 'Attitude Skill', value: 'attitude_skill' },
  ];

  first: number = 0; // Untuk pagination
  totalRecords: number = 0; // Total jumlah data yang ada

  constructor(
    private attitudeSkillService: AttitudeSkillService ,
    private groupAttitudeSkillService: GroupAttitudeSkillService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllAttitudeSkills();
    this.getAllGroupAttitudeSkills();
  }

  getAllAttitudeSkills() {
    this.loading = true;
    this.attitudeSkillService.getAllAttitudeSkills(this.first, 5).subscribe({
      next: (response) => {
        this.attitudeSkills = response.content;
        this.totalRecords = response.totalRecords;
        this.filteredAttitudeSkills = this.attitudeSkills;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching attitudeSkills:', error);
        this.loading = false;
      }
    });
  }

  loadPage(event: any) {
    this.first = event.first; // Dapatkan halaman yang dipilih
    this.getAllAttitudeSkills(); // Muat ulang data berdasarkan halaman baru
  }

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 }
  ];

  getAllGroupAttitudeSkills() {
    this.attitudeSkillService.getAllGroupAttitudeSkills().subscribe({
      next: (response) => {
        this.groupAttitudeSkills = response.content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching group attitudeSkills:', error);
        this.loading = false;
      }
    });
  }

  searchData() {
    if (!this.selectedCategory || this.searchKeyword.trim() === '') {
      this.filteredAttitudeSkills = this.attitudeSkills; // Jika kategori kosong atau keyword kosong, tampilkan semua data
    } else {
      this.filteredAttitudeSkills = this.attitudeSkills.filter(attitudeSkill => {
        return attitudeSkill[this.selectedCategory]?.toLowerCase().includes(this.searchKeyword.toLowerCase());
      });
    }
  }
  

  showAddDialog() {
    console.log('Menampilkan dialog tambah');
    this.attitudeSkill = { attitudeSkill: '', group_id: '', enabled: 1 };
    this.attitudeSkillDialog = true;
  }

  editAttitudeSkill(attitudeSkill: any) {
    console.log('Mengedit Attitude Skill', attitudeSkill);
    this.attitudeSkill = { ...attitudeSkill };
    this.attitudeSkillDialog = true;
  }



saveAttitudeSkill() {
  const dataToSend = {
    attitude_skill: this.attitudeSkill.attitude_skill, // Nama attitudeSkill
    group_id: this.attitudeSkill.group_id,       // ID dari dropdown (langsung)
    enabled: this.attitudeSkill.enabled
  };

  console.log('Data yang dikirim:', dataToSend);

  if (this.attitudeSkill.id) {
    this.attitudeSkillService.updateAttitudeSkill(this.attitudeSkill.id, dataToSend).subscribe({
      next: () => {
        alert('AttitudeSkill updated successfully');
        this.getAllAttitudeSkills();
        this.attitudeSkillDialog = false;
      },
      error: (error) => {
        console.error('Error updating attitudeSkill:', error);
      }
    });
  } else {
    this.attitudeSkillService.saveAttitudeSkill(dataToSend).subscribe({
      next: () => {
        alert('attitudeSkill added successfully');
        this.getAllAttitudeSkills();
        this.attitudeSkillDialog = false;
      },
      error: (error) => {
        console.error('Error saving attitudeSkill:', error);
      }
    });
  }
}



  deleteAttitudeSkill(id: string) {
    if (confirm('Are you sure you want to delete this attitudeSkill?')) {
      this.attitudeSkillService.deleteAttitudeSkill(id).subscribe({
        next: () => {
          alert('Attitude Skill deleted successfully');
          this.getAllAttitudeSkills();
        },
        error: (error) => {
          console.error('Error deleting Attitude Skill:', error);
        }
      });
    }
  }
}

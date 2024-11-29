import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { GroupAttitudeSkillService } from '../../service/group-attitude-skill/group-attitude-skill.service';
import { CommonModule } from '@angular/common';  // Import CommonModule for directives like ngIf, ngFor
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { trigger, transition, style, animate } from '@angular/animations';
import { GroupAttitudeSkillService } from '../../service/group-attitude-skill/group-attitude-skill.service';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';


@Component({
  selector: 'app-group-attitude-skill',
  standalone: true,
  imports: [
    CommonModule, // Use CommonModule instead of BrowserModule
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
  templateUrl: './group-attitude-skill.component.html',
  styleUrls: ['./group-attitude-skill.component.css']
})
export class GroupAttitudeSkillComponent implements OnInit {
  groupAttitudeSkills: any[] = [];
  filteredgroupAttitudeSkills: any[] = []; 
  loading: boolean = true;
  groupAttitudeSkillDialog: boolean = false;
  groupAttitudeSkill: any = { group_name: '', percentage: null, enabled: false };
  searchKeyword: string = ''; 
  selectedCategory: string = ''; // Kategori yang dipilih dari dropdown
  searchCategories: any[] = [
    { label: 'Group Name', value: 'group_name' },
    { label: 'Percentage', value: 'percentage' },
  ];

  first: number = 0;
  totalRecords: number = 0;

  constructor(
    private groupAttitudeSkillService: GroupAttitudeSkillService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllGroupAttitudeSkills();
  }

  getAllGroupAttitudeSkills() {
    this.loading = true;
    this.groupAttitudeSkillService.getAllGroupAttitudeSkills(this.first, 5).subscribe({
      next: (response) => {
        this.groupAttitudeSkills = response.content;
        this.totalRecords = response.totalRecords;
        this.filteredgroupAttitudeSkills = this.groupAttitudeSkills;
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
    this.getAllGroupAttitudeSkills(); // Muat ulang data berdasarkan halaman baru
  }

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 }
  ];

  searchData() {
  if (!this.selectedCategory || this.searchKeyword.trim() === '') {
    // Jika kategori atau keyword kosong, tampilkan semua data
    this.filteredgroupAttitudeSkills = this.groupAttitudeSkills;
  } else {
    this.filteredgroupAttitudeSkills = this.groupAttitudeSkills.filter(groupAttitudeSkill => {
      const value = groupAttitudeSkill[this.selectedCategory];
      if (this.selectedCategory === 'percentage') {
        // Bandingkan sebagai numerik
        return value != null && value.toString().includes(this.searchKeyword);
      }
      // Bandingkan sebagai string
      return value?.toLowerCase().includes(this.searchKeyword.toLowerCase());
    });
  }
}


  showAddDialog() {
    console.log('Menampilkan dialog tambah');
    this.groupAttitudeSkill = { group_name: '', percentage: null, enabled: 1 };
    this.groupAttitudeSkillDialog = true;
  }

  editGroupAttitudeSkill(groupAttitudeSkill: any) {
    console.log('Mengedit group attitudeSkill', groupAttitudeSkill);
    this.groupAttitudeSkill = { ...groupAttitudeSkill };
    this.groupAttitudeSkillDialog = true;
  }

  saveGroupAttitudeSkill() {
    console.log('Data yang dikirim:', this.groupAttitudeSkill);
    if (this.groupAttitudeSkill.id) {
      this.groupAttitudeSkillService.updateGroupAttitudeSkill(this.groupAttitudeSkill.id, this.groupAttitudeSkill).subscribe({
        next: () => {
          alert('Group AttitudeSkill updated successfully');
          this.getAllGroupAttitudeSkills();
          this.groupAttitudeSkillDialog = false;
        },
        error: (error) => {
          console.error('Error updating attitudeSkill:', error);
        }
      });
    } else {
      this.groupAttitudeSkillService.saveGroupAttitudeSkill(this.groupAttitudeSkill).subscribe({
        next: () => {
          alert('Group AttitudeSkill added successfully');
          this.getAllGroupAttitudeSkills();
          this.groupAttitudeSkillDialog = false;
        },
        error: (error) => {
          console.error('Error saving attitudeSkill:', error);
        }
      });
    }
  }

  deleteGroupAttitudeSkill(id: string) {
    if (confirm('Are you sure you want to delete this group AttitudeSkill?')) {
      this.groupAttitudeSkillService.deleteGroupAttitudeSkill(id).subscribe({
        next: () => {
          alert('Group AttitudeSkill deleted successfully');
          this.getAllGroupAttitudeSkills();
        },
        error: (error) => {
          console.error('Error deleting AttitudeSkill:', error);
        }
      });
    }
  }
}

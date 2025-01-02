import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
import { InputText, InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { FilterMetadata } from 'primeng/api';
import Swal from 'sweetalert2';
import { TechnicalSkillService } from '../../service/technical-skill/technical-skill.service';

@Component({
  selector: 'app-technical-skill',
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
  ],
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './technical-skill.component.html',
  styleUrls: ['./technical-skill.component.css'],
})
export class TechnicalSkillComponent implements OnInit {
  technicalSkills: any[] = [];
  filteredTechnicalSkills: any[] = [];
  loading: boolean = true;
  technicalSkillDialog: boolean = false;
  technicalSkill: any = {
    technical_skill: '',
    percentage: null,
    enabled: false,
  };

  searchKeyword: string = '';
  filters: { [s: string]: FilterMetadata } = {};

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 },
  ];

  isTechnicalSkillDuplicate: boolean = false;

  first: number = 0;
  totalRecords: number = 0;

  pageSizeOptions: number[] = [5, 10, 20];
  selectedPageSize: number = 5;
  currentPage: number = 0;

  sortingDirection: string = 'asc';
  currentSortBy: string = 'technicalSkill';

  sortOptions = [{ label: 'Technical Skill', value: 'technicalSkill' }];

  constructor(
    private technicalSkillService: TechnicalSkillService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllTechnicalSkills();
  }

  getAllTechnicalSkills(
    sort: string = this.currentSortBy,
    direction: string = this.sortingDirection,
    searchKeyword: string = this.searchKeyword
  ) {
    this.loading = true;
    console.log(
      'Loading technical skill with sorting:',
      sort,
      'and direction:',
      direction
    );
    this.technicalSkillService
      .getAllTechnicalSkills(
        this.currentPage,
        this.selectedPageSize,
        sort,
        direction,
        searchKeyword
      )
      .subscribe({
        next: (response) => {
          this.technicalSkills = response.content;
          this.totalRecords = response.total_data;
          this.filteredTechnicalSkills = this.technicalSkills;
          this.loading = false;

          if (this.filteredTechnicalSkills.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No Data Found',
              text: 'No matching data found for your search criteria.',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                // Reset search keyword only
                this.searchKeyword = '';
                this.getAllTechnicalSkills(
                  this.currentSortBy,
                  this.sortingDirection,
                  this.searchKeyword
                );
              }
            });
          }

          // console.log('Data Technical Skills:', this.technicalSkills);
          // console.log('Total Records:', this.totalRecords);
        },
        error: (error) => {
          console.error('Error fetching technical Skills:', error);
          this.loading = false;
        },
      });
  }

  resetFilters() {
    this.searchKeyword = '';
    this.currentSortBy = 'technicalSkill';
    this.sortingDirection = 'asc';
    this.currentPage = 0;
    this.selectedPageSize = 5;

    this.getAllTechnicalSkills(
      this.currentSortBy,
      this.sortingDirection,
      this.searchKeyword
    );
  }

  loadPage(event: any) {
    this.currentPage = event.first / event.rows; // Menghitung halaman berdasarkan offset
    this.selectedPageSize = event.rows; // Ambil jumlah baris per halaman
    console.log('Page Size Change Triggered');
    console.log('Selected Page Size:', this.selectedPageSize);
    this.getAllTechnicalSkills(this.currentSortBy, this.sortingDirection);
  }

  onSortChange(event: any) {
    this.currentSortBy = event.value; // Update current sort by
    console.log('Sorting by:', this.currentSortBy); // Log for debugging

    this.currentPage = 0; // Reset to the first page
    console.log('Sorting direction:', this.sortingDirection); // Log for debugging

    this.getAllTechnicalSkills(this.currentSortBy, this.sortingDirection); // Call to load data with new sorting
  }

  toggleSortingDirection() {
    // Toggle between 'asc' and 'desc'
    this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';
    console.log('Sorting direction changed to:', this.sortingDirection); // Log the new direction
    // Reload achievements with the current sort criteria and new sorting direction
    this.getAllTechnicalSkills(this.currentSortBy, this.sortingDirection);
  }

  showAddDialog() {
    // console.log('Menampilkan dialog tambah');
    this.resetTecnicalSkill();
    this.technicalSkillDialog = true;
    this.isTechnicalSkillDuplicate = false;
  }

  editTechnicalSkill(technicalSkill: any) {
    // console.log('Mengedit technical skill', technicalSkill);
    this.technicalSkill = { ...technicalSkill };
    this.technicalSkillDialog = true;
    this.isTechnicalSkillDuplicate = false;
  }

  validateTechnicalSkill() {
    if (!this.technicalSkill.id) {
      const existingTechnicalSkill = this.technicalSkills.find(
        (technical) =>
          technical.technical_skill.toLowerCase() ===
          this.technicalSkill.technical_skill.toLowerCase()
      );
      if (existingTechnicalSkill) {
        this.isTechnicalSkillDuplicate = true;
        return false;
      }
    } else {
      const existingTechnicalSkill = this.technicalSkills.find(
        (technical) =>
          technical.technical_skill.toLowerCase() ===
            this.technicalSkill.technical_skill.toLowerCase() &&
          technical.id !== this.technicalSkill.id
      );
      if (existingTechnicalSkill) {
        this.isTechnicalSkillDuplicate = true;
        return false;
      }
    }

    this.isTechnicalSkillDuplicate = false;

    return true;
  }

  saveTechnicalSkill() {
    if (!this.validateTechnicalSkill()) {
      return;
    }
    if (this.technicalSkill.id) {
      this.technicalSkillService
        .updateTechnicalSkill(this.technicalSkill.id, this.technicalSkill)
        .subscribe({
          next: () => {
            this.getAllTechnicalSkills();
            this.technicalSkillDialog = false;
            this.resetTecnicalSkill();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully updated Technical Skill!',
              timer: 1500,
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to update Technical Skill!',
              timer: 1500,
            });
          },
        });
    } else {
      this.technicalSkillService
        .saveTechnicalSkill(this.technicalSkill)
        .subscribe({
          next: () => {
            this.getAllTechnicalSkills();
            this.technicalSkillDialog = false;
            this.resetTecnicalSkill();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Successfully added Technical Skill!',
              timer: 1500,
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Failed to add Technical Skill!.',
              timer: 1500,
            });
          },
        });
    }
  }

  resetTecnicalSkill() {
    this.technicalSkill = { technical_skill: '', enabled: 1 };
    this.isTechnicalSkillDuplicate = false;
  }

  deleteTechnicalSkill(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Data will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.technicalSkillService.deleteTechnicalSkill(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Successfully deleted Technical Skill!',
              showConfirmButton: false,
              timer: 1500,
            });
            this.getAllTechnicalSkills();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete Technical Skill!.',
              timer: 1500,
              confirmButtonText: 'Coba Lagi',
            });
          },
        });
      }
    });
  }
}

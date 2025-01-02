import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { DivisiService } from '../../../service/divisi/divisi.service';
import { CreateDivisionComponent } from '../create-division/create-division.component';
import { UpdateDivisionComponent } from '../update-division/update-division.component';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-divisi',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    TableModule,
    DialogModule,
    TagModule,
    ToastModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    CreateDivisionComponent,
    UpdateDivisionComponent,
    DropdownModule,
  ],
  templateUrl: './divisi.component.html',
  styleUrl: './divisi.component.css',
})
export class DivisiComponent {
  divisions: any[] = [];
  loading: boolean = true;
  displayCreateDialog = false;
  displayUpdateDialog = false;
  selecteddivision: any;
  searchValue: string | undefined;

  searchKeyword: string = '';
  totalRecords: number = 0;
  currentPage: number = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  selectedPageSize: number = 5;
  sortingDirection: string = 'asc';
  currentSortBy: string = 'divisionName';

  sortOptions = [{ label: 'Division Name', value: 'divisionName' }];

  constructor(
    private divisiService: DivisiService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAllDivisions();
  }

  getAllDivisions(
    sort: string = this.currentSortBy,
    direction: string = this.sortingDirection,
    searchKeyword: string = this.searchKeyword
  ) {
    this.loading = true;
    console.log(
      'Loading divisions with sorting:',
      sort,
      'and direction:',
      direction
    );
    this.divisiService
      .getAllDivisions(
        this.currentPage,
        this.selectedPageSize,
        sort,
        direction,
        searchKeyword
      )
      .subscribe({
        next: (response) => {
          this.divisions = response.content;
          this.totalRecords = response.total_data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching divisions:', error);
          this.loading = false;
        },
      });
  }

  loadPage(event: any) {
    this.currentPage = event.first / event.rows; // Update current page
    this.selectedPageSize = event.rows; // Update page size
    this.getAllDivisions(this.currentSortBy, this.sortingDirection); // Reload data with new page size
  }

  onSortChange(event: any) {
    this.currentSortBy = event.value; // Update current sort by
    console.log('Sorting by:', this.currentSortBy); // Log for debugging

    this.currentPage = 0; // Reset to the first page
    console.log('Sorting direction:', this.sortingDirection); // Log for debugging

    this.getAllDivisions(this.currentSortBy, this.sortingDirection); // Call to load data with new sorting
  }

  toggleSortingDirection() {
    // Toggle between 'asc' and 'desc'
    this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';
    console.log('Sorting direction changed to:', this.sortingDirection); // Log the new direction
    // Reload achievements with the current sort criteria and new sorting direction
    this.getAllDivisions(this.currentSortBy, this.sortingDirection);
  }

  openCreateDialog() {
    this.displayCreateDialog = true;
  }

  openUpdateDialog(divisions: any) {
    this.selecteddivision = divisions;
    this.displayUpdateDialog = true;
  }

  // Fungsi menangani event divisi yang dibuat
  ondivisionCreated(newdivision: any) {
    console.log('division baru:', newdivision);
    // Logika untuk menyimpan division ke database (via API)
    this.getAllDivisions();
    this.displayCreateDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
    // Tambahkan division baru ke daftar divisions atau update data sesuai kebutuhan
  }

  confirmDelete(divisions: any) {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Anda akan menghapus divisi ${divisions.DIVISION_NAME}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.divisiService.deleteDivision(divisions.ID).subscribe({
          next: () => {
            Swal.fire('Terhapus!', 'Divisi berhasil dihapus.', 'success');
            this.getAllDivisions(); // Panggil metode untuk memperbarui tabel
          },
          error: (error) => {
            Swal.fire(
              'Error',
              'Terjadi kesalahan saat menghapus Divisi.',
              'error'
            );
            console.error('Error deleting division:', error);
          },
        });
      }
    });
  }
}

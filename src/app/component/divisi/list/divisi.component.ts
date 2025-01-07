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

          if (this.divisions.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No Data Found',
              text: 'No matching data found for your search criteria.',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this.searchKeyword = '';
                this.getAllDivisions(
                  this.currentSortBy,
                  this.sortingDirection,
                  this.searchKeyword
                );
              }
            });
          }

          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
        },
      });
  }

  resetFilters() {
    this.searchKeyword = '';
    this.currentSortBy = 'divisionName';
    this.sortingDirection = 'asc';
    this.currentPage = 0;
    this.selectedPageSize = 5;

    this.getAllDivisions(
      this.currentSortBy,
      this.sortingDirection,
      this.searchKeyword
    );
  }

  loadPage(event: any) {
    this.currentPage = event.first / event.rows;
    this.selectedPageSize = event.rows;
    this.getAllDivisions(this.currentSortBy, this.sortingDirection);
  }

  onSortChange(event: any) {
    this.currentSortBy = event.value;
    this.currentPage = 0;
    this.getAllDivisions(this.currentSortBy, this.sortingDirection);
  }

  toggleSortingDirection() {
    this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';

    this.getAllDivisions(this.currentSortBy, this.sortingDirection);
  }

  openCreateDialog() {
    this.displayCreateDialog = true;
  }

  openUpdateDialog(divisions: any) {
    this.selecteddivision = divisions;
    this.displayUpdateDialog = true;
  }

  ondivisionCreated(newdivision: any) {
    this.getAllDivisions();
    this.displayCreateDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
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
            this.getAllDivisions();
          },
          error: (error) => {
            Swal.fire(
              'Error',
              'Terjadi kesalahan saat menghapus Divisi.',
              'error'
            );
          },
        });
      }
    });
  }
}

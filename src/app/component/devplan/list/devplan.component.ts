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
import { DevplanService } from '../../../service/devplan/devplan.service';
import { CreateDevplanComponent } from '../create-devplan/create-devplan.component';
import { UpdateDevplanComponent } from '../update-devplan/update-devplan.component';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-devplan',
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
    CreateDevplanComponent,
    UpdateDevplanComponent,
    DropdownModule,
  ],
  templateUrl: './devplan.component.html',
  styleUrl: './devplan.component.css',
})
export class DevplanComponent {
  devplans: any[] = [];
  loading: boolean = true;
  displayCreateDialog = false;
  displayUpdateDialog = false;
  selecteddevplan: any;
  searchValue: string | undefined;

  // Paginasi
  searchKeyword: string = '';
  totalRecords: number = 0;
  currentPage: number = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  selectedPageSize: number = 5;
  sortingDirection: string = 'asc';
  currentSortBy: string = 'plan';

  sortOptions = [{ label: 'Plan', value: 'plan' }];

  constructor(
    private devplanService: DevplanService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAllDevplans();
  }

  getAllDevplans(
    sort: string = this.currentSortBy,
    direction: string = this.sortingDirection,
    searchKeyword: string = this.searchKeyword
  ) {
    this.loading = true;
    console.log(
      'Loading dev plans with sorting:',
      sort,
      'and direction:',
      direction
    );
    this.devplanService
      .getAllDevplans(
        this.currentPage,
        this.selectedPageSize,
        sort,
        direction,
        searchKeyword
      )
      .subscribe({
        next: (response) => {
          // ; // Log respons API

          this.devplans = response.content; // Data ada di 'content'
          this.totalRecords = response.total_data; // Total data dari respons
          this.loading = false;

          if (this.devplans.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No Data Found',
              text: 'No matching data found for your search criteria.',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                // Reset search keyword only
                this.searchKeyword = '';
                this.getAllDevplans(
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
    this.currentSortBy = 'plan';
    this.sortingDirection = 'asc';
    this.currentPage = 0;
    this.selectedPageSize = 5;

    this.getAllDevplans(
      this.currentSortBy,
      this.sortingDirection,
      this.searchKeyword
    );
  }

  loadPage(event: any) {
    this.currentPage = event.first / event.rows; // Update current page
    this.selectedPageSize = event.rows; // Update page size
    this.getAllDevplans(this.currentSortBy, this.sortingDirection); // Reload data with new page size
  }

  onSortChange(event: any) {
    this.currentSortBy = event.value; // Update current sort by // Log for debugging
    this.currentPage = 0; // Reset to the first page // Log for debugging
    this.getAllDevplans(this.currentSortBy, this.sortingDirection); // Call to load data with new sorting
  }

  toggleSortingDirection() {
    // Toggle between 'asc' and 'desc'
    this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc'; // Log the new direction
    // Reload achievements with the current sort criteria and new sorting direction
    this.getAllDevplans(this.currentSortBy, this.sortingDirection);
  }

  openCreateDialog() {
    this.displayCreateDialog = true;
  }

  openUpdateDialog(divisions: any) {
    this.selecteddevplan = divisions;
    // ;
    this.displayUpdateDialog = true;
  }

  // Fungsi menangani event divisi yang dibuat
  ondevplanCreated(newdivision: any) {
    // Logika untuk menyimpan division ke database (via API)
    this.getAllDevplans();
    this.displayCreateDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
    // Tambahkan division baru ke daftar divisions atau update data sesuai kebutuhan
  }

  confirmDelete(devplans: any) {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Anda akan menghapus devplan dengan nama ${devplans.PLAN}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.devplanService.deleteDevPlan(devplans.ID).subscribe({
          next: () => {
            Swal.fire('Terhapus!', 'Divisi berhasil dihapus.', 'success');
            this.getAllDevplans(); // Panggil metode untuk memperbarui tabel
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

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


@Component({
  selector: 'app-divisi',
  standalone: true,
  imports: [CommonModule, ButtonModule, CalendarModule, FormsModule, TableModule, DialogModule, TagModule, ToastModule, 
    IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './divisi.component.html',
  styleUrl: './divisi.component.css'
})
export class DivisiComponent {

  
  divisions: any[] = [];
  loading: boolean = true;
  displayCreateDialog = false;
  displayUpdateDialog = false;
  selecteddivision: any;
  searchValue: string | undefined;
  

  constructor(
    private divisiService: DivisiService,
    private messageService: MessageService
    
  ) {}


  ngOnInit() {
    this.getAllDivisions();
  }

  getAllDivisions() {
    this.divisiService.getAllDivisions().subscribe({
      next: (response) => {
        this.divisions = response.content; // Data ada di 'content'
        console.log('Total rows:',  response.content);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching divisis:', error);
        this.loading = false;
      },
    });
  }


  openCreateDialog() {
    this.displayCreateDialog = true;
  }

  openUpdateDialog(divisi: any) {
    this.selecteddivision = divisi;
    console.log(this.selecteddivision);
    this.displayUpdateDialog = true;
  }

  
  // Fungsi menangani event divisi yang dibuat
  ondivisionCreated(newdivision: any) {
    console.log('division baru:', newdivision);
    // Logika untuk menyimpan division ke database (via API)
    this.getAllDivisions();
    this.displayCreateDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
    // Tambahkan division baru ke daftar divisions atau update data sesuai kebutuhan
  }

  confirmDelete(division: any) {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Anda akan menghapus pengguna ${division.divisionname}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.divisiService.deleteDivision(division.id).subscribe({
          next: () => {
            Swal.fire('Terhapus!', 'Pengguna berhasil dihapus.', 'success');
            this.getAllDivisions(); // Panggil metode untuk memperbarui tabel
          },
          error: (error) => {
            Swal.fire('Error', 'Terjadi kesalahan saat menghapus pengguna.', 'error');
            console.error('Error deleting division:', error);
          }
        });
      }
    });
  }
  
}


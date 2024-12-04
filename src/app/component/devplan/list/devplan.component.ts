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

@Component({
  selector: 'app-devplan',
  standalone: true,
  imports: [CommonModule, ButtonModule, CalendarModule, FormsModule, TableModule, DialogModule, TagModule, ToastModule, 
    IconFieldModule, InputIconModule, InputTextModule, CreateDevplanComponent, UpdateDevplanComponent],
  templateUrl: './devplan.component.html',
  styleUrl: './devplan.component.css'
})
export class DevplanComponent {

  devplans: any[] = [];
  loading: boolean = true;
  displayCreateDialog = false;
  displayUpdateDialog = false;
  selecteddevplan: any;
  searchValue: string | undefined;

  constructor(
    private devplanService: DevplanService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAllDevplans();
  }

  getAllDevplans() {
    this.devplanService.getAllDivisions().subscribe({
      next: (response) => {
        this.devplans = response.content; // Data ada di 'content'
        // console.log('ini devp;am:',  this.devplans);
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

  openUpdateDialog(divisions: any) {
    this.selecteddevplan = divisions;
    // console.log(this.selecteddevplan);
    this.displayUpdateDialog = true;
  }

  
  // Fungsi menangani event divisi yang dibuat
  ondevplanCreated(newdivision: any) {
    console.log('awqqq baru:', newdivision);
    // Logika untuk menyimpan division ke database (via API)
    this.getAllDevplans();
    this.displayCreateDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
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
            Swal.fire('Error', 'Terjadi kesalahan saat menghapus Divisi.', 'error');
            console.error('Error deleting division:', error);
          }
        });
      }
    });
  }
}

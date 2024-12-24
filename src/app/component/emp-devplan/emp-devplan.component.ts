import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { EmpDevplanService } from '../../service/emp-devplan/emp-devplan.service';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ThisReceiver } from '@angular/compiler';
import Swal from 'sweetalert2';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-emp-devplan',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ToolbarModule,
  ],
  templateUrl: './emp-devplan.component.html',
  styleUrl: './emp-devplan.component.css',
})
export class EmpDevplanComponent implements OnInit {
  Year: number = new Date().getFullYear();
  empdevplans: any[] = [];
  userId: any;
  remove: boolean = true;

  userName: string | null = '';

  constructor(private empDevplanService: EmpDevplanService) {}
  validateKeterangan(keterangan: any) {
    if (!keterangan.value.trim()) {
      keterangan.isInvalid = true; // Menandakan bahwa input kosong
    } else {
      keterangan.isInvalid = false; // Menandakan bahwa input valid
    }
  }

  ngOnInit() {
    this.userName = localStorage.getItem('full_name');
    this.userId = localStorage.getItem('id');
    this.loadPerihals();
    this.loadExistingData();
  }

  loadPerihals() {
    this.empDevplanService.getAllDevPlan().subscribe((data) => {
      this.empdevplans = data.content.map((item: { ID: any; PLAN: any }) => ({
        id: item.ID,
        title: item.PLAN,
        keterangans: [{ value: '' }], // Gunakan objek untuk tiap keterangan
      }));
    });
  }

  loadExistingData() {
    this.empDevplanService
      .getAllEmpDevPlan(this.userId, this.Year)
      .subscribe((data) => {
        data.content.forEach((item: any) => {
          const perihal = this.empdevplans.find(
            (p) => p.id === item.DEV_PLAN_ID
          );
          if (perihal) {
            // Hapus input kosong jika sudah ada data dari backend
            if (
              perihal.keterangans.length === 1 &&
              perihal.keterangans[0].value.trim() === ''
            ) {
              perihal.keterangans.pop(); // Hapus input kosong
            }
            // Tambahkan keterangan dari backend
            perihal.keterangans.push({ value: item.DETAIL, isExisting: true });
          }
        });
      });
  }

  // Menambah input keterangan baru untuk perihal tertentu
  addKeterangan(perihal: any) {
    // Tambahkan input baru hanya jika tidak ada keterangan kosong
    perihal.keterangans.push({ value: '', isExisting: false });
  }

  // Menghapus input keterangan berdasarkan indeks
  removeKeterangan(perihal: any, index: number) {
    const keteranganToRemove = perihal.keterangans[index];

    // Cek apakah input yang akan dihapus adalah disabled (isExisting: true)
    if (keteranganToRemove.isExisting) {
      // Tampilkan alert jika input yang dihapus disabled
      Swal.fire({
        title: 'Are you sure?',
        text: 'Apakah Anda yakin ingin menghapus data ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete!',
      }).then((result) => {
        if (result.isConfirmed) {
          perihal.keterangans.splice(index, 1);
        }
      });
    } else {
      // Hapus keterangan jika tidak disabled
      if (perihal.keterangans.length > 1) {
        perihal.keterangans.splice(index, 1); // Menghapus keterangan pada indeks tertentu
      } else {
        // Jika hanya satu keterangan, hapus form inputan terakhir
        perihal.keterangans.pop(); // Menghapus elemen terakhir dari array
      }
    }
  }

  // Simpan data ke database
  saveToDatabase() {
    const dataToSave = this.empdevplans.flatMap((perihal: any) =>
      perihal.keterangans.map((keterangan: { value: string }) => ({
        DEV_PLAN_ID: perihal.id,
        DETAIL: keterangan.value.trim(),
        ASSESSMENT_YEAR: this.Year,
      }))
    );
    const isAnyInputEmpty = this.empdevplans.some((empdevplan) =>
      empdevplan.keterangans.some(
        (keterangan: { value: string }) => !keterangan.value.trim()
      )
    );

    if (isAnyInputEmpty) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian!',
        text: 'Terdapat keterangan yang kosong, \n silakan periksa kembali!',
        confirmButtonText: 'OK',
      });
    } else {
      Swal.fire({
        html: 'Apakah Anda yakin ingin menyimpan data ini? <br> data yang di submit tidak dapat diubah',
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.empDevplanService.saveEmpDevPlan(dataToSave).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'data berhasil disimpan!',
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              });
            },
            (error: any) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'gagal untuk menyimpan data!',
              });
              console.error('Error changing password:', error);
            }
          );
        }
      });
    }
  }
}

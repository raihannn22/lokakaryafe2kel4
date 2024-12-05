import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { EmpDevplanService } from '../../service/emp-devplan/emp-devplan.service';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-emp-devplan',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule],
  templateUrl: './emp-devplan.component.html',
  styleUrl: './emp-devplan.component.css'
})
export class EmpDevplanComponent implements OnInit {
  // empdevplans: any[] = [

  // ];

  // constructor(private empDevplanService: EmpDevplanService) { }

  // ngOnInit() {
  //   this.loadPerihals();
  // }

  // loadPerihals() {
  //   this.empDevplanService.getAllDevPlan().subscribe(data => {
  //     this.empdevplans = data.content.map((item: { ID: any; PLAN: any; })        => ({
  //       id: item.ID,
  //       title: item.PLAN,
  //       keterangans: ['']  // Inisialisasi dengan keterangan kosong
  //     }));
  //     console.log('ini perihall', this.empdevplans);
  //   });
  // }

  // // Menambah input keterangan baru untuk perihal tertentu
  // addKeterangan(perihal: any) {
  //   perihal.keterangans.push('');
  // }

  // // Menghapus input keterangan berdasarkan indeks
  // removeKeterangan(perihal: any, index: number) {
  //   if (perihal.keterangans.length > 1) {
  //     perihal.keterangans.splice(index, 1);
  //   }
  // }



  // saveToDatabase() {
  // const dataToSave = this.empdevplans.map((perihal: any) => ({
  //   id: perihal.id,
  //   keterangans: perihal.keterangans
  // }))
  // console.log('ini lo',dataToSave);
  // }
  Year: number = new Date().getFullYear();
  empdevplans: any[] = [];
  userId: any;

  constructor(private empDevplanService: EmpDevplanService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('id');
    this.loadPerihals();
    this.loadExistingData();
  }

  loadPerihals() {
    this.empDevplanService.getAllDevPlan().subscribe(data => {
      this.empdevplans = data.content.map((item: { ID: any; PLAN: any; }) => ({
        id: item.ID,
        title: item.PLAN,
        keterangans: [{ value: '' }]  // Gunakan objek untuk tiap keterangan
      }));
      console.log('ini perihal', this.empdevplans);
    });
  }

  loadExistingData() {
    this.empDevplanService.getAllEmpDevPlan(this.userId, this.Year).subscribe(data => {
      console.log('Data yang diterima:', data);

      data.content.forEach((item: any) => {
        const perihal = this.empdevplans.find(p => p.id === item.DEV_PLAN_ID);
        if (perihal) {
          // Hapus input kosong jika sudah ada data dari backend
          if (perihal.keterangans.length === 1 && perihal.keterangans[0].value.trim() === '') {
            perihal.keterangans.pop(); // Hapus input kosong
          }
          // Tambahkan keterangan dari backend
          perihal.keterangans.push({ value: item.DETAIL });
        }
      });
    });
  }




  // Menambah input keterangan baru untuk perihal tertentu
  addKeterangan(perihal: any) {
    // Periksa apakah keterangan terakhir sudah terisi
    const lastKeterangan = perihal.keterangans[perihal.keterangans.length - 1];

    // Jika keterangan terakhir tidak kosong, tambahkan keterangan baru
    if (lastKeterangan && lastKeterangan.value.trim() !== '') {
      perihal.keterangans.push({ value: '' }); // Tambahkan input keterangan kosong
    } else {
      // Jika keterangan terakhir kosong, tampilkan pesan atau lakukan sesuatu
      alert('Keterangan sebelumnya harus diisi sebelum menambahkannya');
    }
  }

  // Menghapus input keterangan berdasarkan indeks
  removeKeterangan(perihal: any, index: number) {
    if (perihal.keterangans.length > 1) {
      perihal.keterangans.splice(index, 1); // Menghapus keterangan pada indeks tertentu
    }else {
      // Jika hanya satu keterangan, hapus form inputan terakhir
      perihal.keterangans.pop(); // Menghapus elemen terakhir dari array
    }
  }

  // Simpan data ke database
  saveToDatabase() {
    const dataToSave = this.empdevplans.flatMap((perihal: any) =>
      perihal.keterangans.map((keterangan: { value: string }) => ({  // Berikan tipe yang benar
        DEV_PLAN_ID: perihal.id,             // dev_plan_id dari perihal.id
        DETAIL: keterangan.value.trim(),     // detail dari keterangan input
        ASSESSMENT_YEAR: this.Year           // assessment_year dari currentYear
      }))
    );

    console.log('Data yang akan dikirim:', dataToSave);

    this.empDevplanService.saveEmpDevPlan(dataToSave).subscribe(
      (response) => {
        console.log('Data berhasil disimpan ke database', response);
      },
      (error) => {
        console.error('Error saving data to database', error);
      }
    )
    // Lakukan penyimpanan ke database di sini
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { EmpDevplanService } from '../../service/emp-devplan/emp-devplan.service';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

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

  constructor(private empDevplanService: EmpDevplanService) { }

  ngOnInit() {
    this.loadPerihals();
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

  // Menambah input keterangan baru untuk perihal tertentu
  addKeterangan(perihal: any) {
    perihal.keterangans.push({ value: '' });  // Tambahkan objek dengan properti value
  }

  // Menghapus input keterangan berdasarkan indeks
  removeKeterangan(perihal: any, index: number) {
    if (perihal.keterangans.length > 1) {
      perihal.keterangans.splice(index, 1); // Menghapus keterangan pada indeks tertentu
    }
  }

  // Simpan data ke database
  saveToDatabase() {
    const dataToSave = this.empdevplans.map((perihal: any) => ({
      id: perihal.id,
      keterangans: perihal.keterangans.map((keterangan: any) => keterangan.value) // Mengambil nilai dari objek value
    }));
    console.log('Data yang akan disimpan:', dataToSave);
    // Lakukan penyimpanan ke database di sini
  }
}

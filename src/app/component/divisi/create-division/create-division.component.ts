import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DivisiService } from '../../../service/divisi/divisi.service';

@Component({
  selector: 'app-create-division',
  standalone: true,
  imports: [DialogModule, InputTextModule, ButtonModule, CommonModule, FormsModule],
  templateUrl: './create-division.component.html',
  styleUrl: './create-division.component.css'
})
export class CreateDivisionComponent {
 
  isValidForm(): boolean {
    return !!this.newDivision.DIVISION_NAME 
  }

  
  @Input() visible: boolean = false;  // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>();  // Emit perubahan visibility

  @Output() divisionCreated = new EventEmitter<any>();  

  divisions: any[] = [];
  roles: any[] = [];

  constructor(
    private divisionService: DivisiService
  ) {}

  ngOnInit() {
  }





  newDivision = {
    DIVISION_NAME: ''
  };

  

 

  closeDialog() {
    this.visibleChange.emit(false)
  }

  onSubmit() {
    this.divisionService.saveDivision(this.newDivision).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.divisionCreated.emit(response);// Emit event ke komponen induk
        this.closeDialog();               // Tutup dialog setelah berhasil
      },
      error: (error) => {
        console.error('Error creating Division:', error);
        // Tambahkan penanganan error di sini
      }
    });
  }
}

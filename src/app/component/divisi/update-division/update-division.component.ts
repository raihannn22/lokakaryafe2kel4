import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DivisiService } from '../../../service/divisi/divisi.service';
@Component({
  selector: 'app-update-division',
  standalone: true,
  imports: [DialogModule, InputTextModule, ButtonModule, CommonModule, FormsModule],
  templateUrl: './update-division.component.html',
  styleUrl: './update-division.component.css'
})
export class UpdateDivisionComponent {

  isValidForm(): boolean {
    return !!this.newDivision.DIVISION_NAME 
  }

  
  @Input() visible: boolean = false;  // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>();  // Emit perubahan visibility
  @Input() division: any;
  @Output() divisionCreated = new EventEmitter<any>();  

  divisions: any[] = [];
  roles: any[] = [];

  constructor(
    private divisionService: DivisiService
  ) {}

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.division) {
      this.newDivision = { ...this.division };
    }
  }



  newDivision = {
    DIVISION_NAME: ''
  };

  

 

  closeDialog() {
    this.visibleChange.emit(false)
  }

  onSubmit() {
    const updatedData: any = { ...this.newDivision };
    this.divisionService.updateDivision( this.division.ID, updatedData).subscribe({
      next: (response) => {
        console.log('Division updated successfully:', response);
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

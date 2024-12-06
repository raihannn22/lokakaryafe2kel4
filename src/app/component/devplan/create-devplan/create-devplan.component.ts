import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DevplanService } from '../../../service/devplan/devplan.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-create-devplan',
  standalone: true,
  imports: [DialogModule, InputTextModule, ButtonModule, CommonModule, FormsModule, DropdownModule],
  templateUrl: './create-devplan.component.html',
  styleUrl: './create-devplan.component.css'
})
export class CreateDevplanComponent {
  @Input() visible: boolean = false;  // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>();  // Emit perubahan visibility
  @Output() devplanCreated = new EventEmitter<any>();  

  devplans: any[] = [];

  constructor(
    private devplanService: DevplanService
  ) {}

  isValidForm(): boolean {
    return !!this.newDevplan.PLAN 
  }

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 }
  ];

  ngOnInit() {
  }

  newDevplan = {
    PLAN: '',
    ENABLED: 0
  };

  closeDialog() {
    this.visibleChange.emit(false)
  }

  onSubmit() {
    this.devplanService.saveDevPlan(this.newDevplan).subscribe({
      next: (response) => {
        this.devplanCreated.emit(response);// Emit event ke komponen induk
        this.closeDialog();               // Tutup dialog setelah berhasil
      },
      error: (error) => {
        console.error('Error creating Division:', error);
        // Tambahkan penanganan error di sini
      }
    });
  }
}

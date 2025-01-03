import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DevplanService } from '../../../service/devplan/devplan.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-update-devplan',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    DropdownModule,
  ],
  templateUrl: './update-devplan.component.html',
  styleUrl: './update-devplan.component.css',
})
export class UpdateDevplanComponent {
  oldDevplans: any[] = [];

  isValidForm(): boolean {
    return !!this.newDevplan.PLAN;
  }

  isUniqueDevplan(): boolean {
    if (!this.newDevplan.PLAN) return false; // Validasi jika email kosong
    return (
      Array.isArray(this.oldDevplans) &&
      !this.oldDevplans.some(
        (devplan) =>
          devplan.PLAN.toLowerCase().trim() ===
            this.newDevplan.PLAN.toLowerCase().trim() &&
          devplan.PLAN.toLowerCase().trim() !==
            this.devplan.PLAN.toLowerCase().trim()
      )
    );
  }

  @Input() visible: boolean = false; // Menyambungkan dengan property di komponen induk
  @Output() visibleChange = new EventEmitter<boolean>(); // Emit perubahan visibility
  @Input() devplan: any;
  @Output() divisionCreated = new EventEmitter<any>();

  devplans: any[] = [];

  constructor(private devplanService: DevplanService) {}

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 },
  ];

  ngOnInit() {
    this.devplanService.getAllDevplans().subscribe({
      next: (response) => {
        this.oldDevplans = response.content;
      },
      error: (error) => {
        console.error('Error fetching divisions:', error);
      },
    });
  }

  ngOnChanges() {
    if (this.devplan) {
      this.newDevplan = { ...this.devplan };
    }
  }

  newDevplan = {
    PLAN: '',
    ENABLED: 0,
  };

  closeDialog() {
    this.visibleChange.emit(false);
  }

  onSubmit() {
    const updatedData: any = { ...this.newDevplan };
    this.devplanService.updateDevPlan(this.devplan.ID, updatedData).subscribe({
      next: (response) => {
        console.log('Division updated successfully:', response);
        this.divisionCreated.emit(response); // Emit event ke komponen induk
        this.closeDialog(); // Tutup dialog setelah berhasil
      },
      error: (error) => {
        console.error('Error creating Division:', error);
        // Tambahkan penanganan error di sini
      },
    });
  }
}
